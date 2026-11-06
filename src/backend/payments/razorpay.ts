/**
 * Server-side Razorpay client + payment helpers.
 *
 * - Lazy singleton Razorpay client (instantiated on first use).
 * - Amounts are always converted rupees -> paise at this boundary (x100, rounded).
 * - Signature verification uses HMAC-SHA256 + crypto.timingSafeEqual.
 *
 * SERVER ONLY: this module reads the key secret from config. Never import it
 * from client components.
 */

import Razorpay from "razorpay";
import crypto from "crypto";
import { getRazorpayConfig } from "./config";

let client: Razorpay | null = null;

/** Lazily create (and cache) the Razorpay client singleton. */
export function getRazorpayClient(): Razorpay {
  if (!client) {
    const { keyId, keySecret } = getRazorpayConfig();
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return client;
}

/**
 * Create a Razorpay order for the given amount.
 *
 * @param amountInRupees amount in rupees (e.g. 499.5)
 * @param receipt        your internal receipt reference (order id/number)
 * @returns the Razorpay order id (e.g. "order_NxK...").
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  receipt: string
): Promise<string> {
  const { currency } = getRazorpayConfig();
  const amount = Math.round(amountInRupees * 100); // rupees -> PAISE
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid order amount: ${amountInRupees}`);
  }

  const order = await getRazorpayClient().orders.create({
    amount,
    currency,
    receipt,
  });

  return order.id;
}

/**
 * Verify a checkout payment signature.
 * expected = HMAC_SHA256(key_secret, `${orderId}|${paymentId}`)
 * compared with crypto.timingSafeEqual.
 */
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!orderId || !paymentId || !signature) return false;
  const { keySecret } = getRazorpayConfig();
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return timingSafeEqualHex(expected, signature);
}

/**
 * Verify a webhook signature against the RAW request body bytes.
 * expected = HMAC_SHA256(webhookSecret, rawBody)
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string | null | undefined
): boolean {
  if (!signature) return false;
  const { webhookSecret } = getRazorpayConfig();
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");
  return timingSafeEqualHex(expected, signature);
}

/** Length-safe timing-safe hex comparison. */
function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
