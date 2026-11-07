import { NextResponse } from "next/server";
import { createAdminClient } from "@/backend/supabase/admin";
import { verifyWebhookSignature } from "@/backend/payments/razorpay";

export const runtime = "nodejs";

/**
 * POST /api/payment/webhook
 *
 * Razorpay webhook receiver. This is the source of truth for payment state —
 * it works even if the customer closes the browser before /api/payment/verify.
 *
 * Flow:
 *   1. Read the RAW request body (`request.text()`) BEFORE parsing it — the
 *      signature is computed over the exact bytes Razorpay sent.
 *   2. Verify `x-razorpay-signature` with the webhook secret (401 otherwise).
 *   3. De-duplicate on `payment_events.event_id` (unique index).
 *   4. `payment.captured` -> confirm_razorpay_payment()
 *      `payment.failed`   -> mark_razorpay_payment_failed()
 *   5. Always answer 200 for anything we handled, already handled, or chose to
 *      ignore, so Razorpay stops retrying.
 */

type Json = Record<string, unknown>;

function asObject(value: unknown): Json | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Json)
    : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function ok(body: Json) {
  return NextResponse.json(body, { status: 200 });
}

export async function POST(request: Request) {
  // RAW BODY FIRST — never JSON.parse before the signature check.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let parsed: Json | null = null;
  try {
    parsed = asObject(JSON.parse(rawBody));
  } catch {
    parsed = null;
  }
  if (!parsed) {
    return NextResponse.json({ error: "Webhook body is not valid JSON." }, { status: 400 });
  }

  const event = parsed;
  const eventType = asString(event.event);
  if (!eventType) {
    return NextResponse.json({ error: "Webhook is missing an event type." }, { status: 400 });
  }

  const payment = asObject(asObject(event.payload)?.payment);
  const entity = asObject(payment?.entity);
  const paymentId = asString(entity?.id);
  const providerOrderId = asString(entity?.order_id);

  // Razorpay does not send a top-level event id, so derive a stable one from
  // (event type + payment id). Retrying the same delivery produces the same id,
  // which the unique index on payment_events.event_id turns into a no-op.
  const eventId =
    asString(event.event_id) ?? `${eventType}:${paymentId ?? "unknown"}`;

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    // 5xx makes Razorpay retry once the service role key is configured.
    return NextResponse.json(
      { error: "The server is not configured to receive webhooks yet." },
      { status: 500 }
    );
  }

  // --- 1. Idempotency: already processed? Acknowledge and stop. ---
  const { data: seen, error: seenError } = await admin
    .from("payment_events")
    .select("id")
    .eq("event_id", eventId)
    .maybeSingle();

  if (seenError) {
    console.error("Webhook dedupe lookup failed:", seenError.message);
    return NextResponse.json({ error: "Could not read the event log." }, { status: 500 });
  }
  if (seen) {
    return ok({ received: true, duplicate: true, event: eventType });
  }

  // --- 2. Apply the state transition ---
  let handlerError: string | null = null;
  let ignored = false;

  if (eventType === "payment.captured" || eventType === "payment.failed") {
    if (!providerOrderId) {
      ignored = true;
    } else {
      const fn =
        eventType === "payment.captured"
          ? "confirm_razorpay_payment"
          : "mark_razorpay_payment_failed";

      const { error } = await admin.rpc(fn, {
        p_provider_order_id: providerOrderId,
        p_payment_id: paymentId,
        p_raw_response: entity ?? null,
      });
      if (error) handlerError = error.message;
    }
  } else {
    // Other event types (refunds, settlements, ...) are acknowledged only.
    ignored = true;
  }

  // A signed event for a payment we never created (e.g. another account's
  // keys) is acknowledged so Razorpay stops retrying, but not treated as a bug.
  const unknownPayment =
    handlerError !== null && handlerError.includes("No payment record");

  if (handlerError && !unknownPayment) {
    console.error(`Webhook ${eventType} failed:`, handlerError);
    // Deliberately NOT recording the event, so a retry can re-run it.
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }

  // --- 3. Record the delivery (audit trail + idempotency) ---
  const { error: recordError } = await admin.from("payment_events").upsert(
    {
      event_id: eventId,
      payment_id: paymentId,
      event_type: eventType,
      payload: event,
    },
    { onConflict: "event_id", ignoreDuplicates: true }
  );

  if (recordError) {
    console.error("Webhook event log insert failed:", recordError.message);
    return NextResponse.json({ error: "Could not record the webhook event." }, { status: 500 });
  }

  return ok({
    received: true,
    duplicate: false,
    event: eventType,
    ignored: ignored || unknownPayment,
  });
}
