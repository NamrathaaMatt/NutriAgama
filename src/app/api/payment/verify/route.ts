import { NextResponse } from "next/server";
import { createAdminClient } from "@/backend/supabase/admin";
import { verifyPaymentSignature } from "@/backend/payments/razorpay";

export const runtime = "nodejs";

/**
 * POST /api/payment/verify
 *
 * Confirms a checkout payment after the Razorpay modal returns.
 *
 * The signature is verified SERVER SIDE against the key secret — the browser
 * is never trusted. The payment is looked up by the RAZORPAY order id
 * (`razorpay_order_id`), never by our internal order id, so a forged internal
 * id can't confirm somebody else's payment.
 *
 * Guests are allowed (no session required).
 */

type VerifyBody = {
  orderId?: unknown;
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
};

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function serverError(error: string) {
  return NextResponse.json({ error }, { status: 500 });
}

function readAdmin() {
  try {
    return { admin: createAdminClient(), error: null as string | null };
  } catch (err) {
    return { admin: null, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Read `status` out of the RPC's jsonb result.
 *
 * PostgREST returns a jsonb scalar as the response body directly, but tolerate
 * a wrapped shape too: this field is INFORMATIONAL ONLY. The RPC raises on any
 * real problem (which PostgREST surfaces as `error`), and the database is the
 * source of truth — an unexpected shape must never turn a confirmed payment
 * into a 500 that the customer would see after being charged.
 */
function readStatus(result: unknown): string | null {
  if (!result || typeof result !== "object") return null;

  const direct = (result as { status?: unknown }).status;
  if (typeof direct === "string") return direct;

  const nested = (result as { data?: unknown }).data;
  if (nested && typeof nested === "object") {
    const status = (nested as { status?: unknown }).status;
    if (typeof status === "string") return status;
  }

  return null;
}

export async function POST(request: Request) {
  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const razorpayOrderId =
    typeof body.razorpay_order_id === "string" ? body.razorpay_order_id.trim() : "";
  const razorpayPaymentId =
    typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id.trim() : "";
  const signature =
    typeof body.razorpay_signature === "string" ? body.razorpay_signature.trim() : "";

  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !signature) {
    return badRequest("Missing payment verification fields.");
  }

  const { admin, error: adminError } = readAdmin();
  if (!admin) {
    console.error(adminError);
    return serverError("The server is not configured to verify payments yet.");
  }

  // 1. Find the payment attempt by the Razorpay order id.
  const { data: payment, error: lookupError } = await admin
    .from("payments")
    .select("id, order_id, status")
    .eq("provider_order_id", razorpayOrderId)
    .maybeSingle();

  if (lookupError) {
    console.error("Payment lookup failed:", lookupError.message);
    return serverError("Could not look up the payment.");
  }
  if (!payment) {
    return badRequest("No payment found for this payment attempt.");
  }
  if (payment.order_id !== orderId) {
    return badRequest("This payment does not belong to the supplied order.");
  }

  // 2. Verify the signature: HMAC_SHA256(order_id|payment_id) over the secret,
  //    compared in constant time. This is the source of truth.
  const signatureValid = verifyPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature,
  });
  if (!signatureValid) {
    return badRequest("Payment signature verification failed.");
  }

  // 3. Atomic confirm: payment -> paid and order -> confirmed in one transaction.
  const { data: result, error: confirmError } = await admin.rpc(
    "confirm_razorpay_payment",
    {
      p_provider_order_id: razorpayOrderId,
      p_payment_id: razorpayPaymentId,
      p_raw_response: {
        source: "checkout_verify",
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        verified_at: new Date().toISOString(),
      },
    }
  );

  if (confirmError) {
    console.error("confirm_razorpay_payment failed:", confirmError.message);
    return serverError("Could not confirm the payment.");
  }

  const outcome = readStatus(result);
  if (outcome !== null && outcome !== "paid" && outcome !== "already_paid") {
    // Should be unreachable — the RPC only ever returns those two values.
    console.error("Unexpected confirm outcome:", outcome);
  }

  // 4. Idempotent audit event — unique on event_id, so a retry won't duplicate it.
  const { error: eventError } = await admin.from("payment_events").upsert(
    {
      event_id: `verify:${razorpayPaymentId}`,
      payment_id: razorpayPaymentId,
      event_type: "payment.verified",
      payload: {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        order_id: orderId,
      },
    },
    { onConflict: "event_id", ignoreDuplicates: true }
  );
  if (eventError) {
    // The payment is already confirmed — log it, but don't fail the response.
    console.error("payment_events insert failed:", eventError.message);
  }

  return NextResponse.json({
    success: true,
    orderId,
    paymentStatus: "paid",
    alreadyConfirmed: outcome === "already_paid",
  });
}
