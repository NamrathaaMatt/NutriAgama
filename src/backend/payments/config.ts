/**
 * Razorpay payment configuration — SINGLE SOURCE OF TRUTH.
 *
 * Reads environment variables with the following precedence:
 *   RAZORPAY_KEY_ID  /  NEXT_PUBLIC_RAZORPAY_KEY_ID   (public — safe for client)
 *   RAZORPAY_KEY_SECRET                              (SERVER ONLY — never expose)
 *   RAZORPAY_WEBHOOK_SECRET                          (SERVER ONLY — never expose)
 *   RAZORPAY_CURRENCY                                (default: INR)
 *
 * When the env vars are absent, clearly-marked dummy constants are used as a
 * fallback so the code compiles and the flow can be exercised up to the point
 * of calling Razorpay's API. Replace them with real test-mode keys in .env.local
 * (see .env.example) — never hard-code real credentials in this file.
 *
 * IMPORTANT: only `keyId` may ever reach client-side code. Import this module
 * from server-side files only (API routes, server actions).
 */

const PLACEHOLDER_KEY_ID = "rzp_test_XXXXXXXXXXXXXX";
const PLACEHOLDER_KEY_SECRET = "PLACEHOLDER_KEY_SECRET";
const PLACEHOLDER_WEBHOOK_SECRET = "PLACEHOLDER_WEBHOOK_SECRET";

export type RazorpayConfig = {
  /** Public key id — the only value safe to send to the browser. */
  keyId: string;
  /** Secret used to sign/verify payment signatures. SERVER ONLY. */
  keySecret: string;
  /** Secret used to verify webhook signatures. SERVER ONLY. */
  webhookSecret: string;
  /** Billing currency (default INR). */
  currency: string;
  /** True while placeholder credentials are in use (Razorpay API calls will fail). */
  usingPlaceholders: boolean;
};

export function getRazorpayConfig(): RazorpayConfig {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    PLACEHOLDER_KEY_ID;
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET || PLACEHOLDER_KEY_SECRET;
  const webhookSecret =
    process.env.RAZORPAY_WEBHOOK_SECRET || PLACEHOLDER_WEBHOOK_SECRET;
  const currency = process.env.RAZORPAY_CURRENCY || "INR";

  return {
    keyId,
    keySecret,
    webhookSecret,
    currency,
    usingPlaceholders:
      keyId === PLACEHOLDER_KEY_ID || keySecret === PLACEHOLDER_KEY_SECRET,
  };
}
