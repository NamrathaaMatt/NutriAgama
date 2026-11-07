import { NextResponse } from "next/server";
import { createClient } from "@/backend/supabase/server";
import { createAdminClient } from "@/backend/supabase/admin";
import { getRazorpayConfig } from "@/backend/payments/config";
import { createRazorpayOrder } from "@/backend/payments/razorpay";

export const runtime = "nodejs";

/**
 * POST /api/orders
 *
 * Creates an order from a cart + shipping address.
 *
 * - Prices are always read from the `products` table on the server — the
 *   client never sends an amount.
 * - `paymentMethod: "razorpay"` also creates a Razorpay order + a `payments`
 *   row and returns everything the checkout needs to open the payment modal.
 * - `paymentMethod: "cod"` stops after the order row is written.
 *
 * Guests are allowed (no session required); when a session exists the order is
 * attached to the authenticated user.
 */

/** Sanity caps so a stray payload can't create an absurd order. */
const MAX_DISTINCT_ITEMS = 50;
const MAX_QTY_PER_ITEM = 10;

// Same rules the address book enforces (see src/backend/actions/addresses.ts).
const PHONE_RE = /^(\+91[\s-]?)?[6-9][0-9]{9}$/;
const PINCODE_RE = /^[1-9][0-9]{5}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ShippingAddress = {
  name: string;
  phone: string;
  address_line: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
};

type OrderRequestBody = {
  items?: unknown;
  shippingAddress?: unknown;
  paymentMethod?: unknown;
  email?: unknown;
};

type OrderLine = {
  slug: string;
  name: string;
  quantity: number;
  unit_price: number;
};

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function serverError(error: string) {
  return NextResponse.json({ error }, { status: 500 });
}

/**
 * Flatten the validated address into the plain-text `orders.shipping_address`
 * column (the column is `text` in this project — not jsonb). The structured
 * pieces are also kept in `customer_name` / `customer_phone`.
 */
function formatAddress(address: ShippingAddress) {
  const parts = [address.name, address.address_line];
  if (address.landmark) parts.push(address.landmark);
  parts.push(`${address.city}, ${address.state} - ${address.pincode}`);
  parts.push(address.phone);
  return parts.join(", ");
}

/** Attach the session user when there is one — guests stay anonymous. */
async function getSessionUser(): Promise<{ id: string; email: string | null } | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email ?? null };
  } catch {
    return null;
  }
}

function readAddress(raw: unknown): ShippingAddress | string {
  if (!raw || typeof raw !== "object") return "A shipping address is required.";
  const input = raw as Record<string, unknown>;
  const str = (value: unknown) => String(value ?? "").trim();

  const address: ShippingAddress = {
    name: str(input.name),
    phone: str(input.phone),
    address_line: str(input.address_line),
    landmark: str(input.landmark) || null,
    city: str(input.city),
    state: str(input.state),
    pincode: str(input.pincode),
  };

  if (address.name.length < 2) return "Enter the recipient's full name.";
  if (!PHONE_RE.test(address.phone)) return "Enter a valid 10-digit mobile number.";
  if (address.address_line.length < 3) return "Enter your address.";
  if (!address.city) return "Enter your city.";
  if (!address.state) return "Enter your state.";
  if (!PINCODE_RE.test(address.pincode)) return "Enter a valid 6-digit pincode.";

  return address;
}

function readQuantities(raw: unknown): Map<string, number> | string {
  if (!Array.isArray(raw) || raw.length === 0) return "Your cart is empty.";
  if (raw.length > MAX_DISTINCT_ITEMS) {
    return `An order can contain at most ${MAX_DISTINCT_ITEMS} different items.`;
  }

  const quantities = new Map<string, number>();

  for (const entry of raw) {
    const item = (entry ?? {}) as Record<string, unknown>;
    const slug = typeof item.slug === "string" ? item.slug.trim() : "";
    const quantity = typeof item.quantity === "number" ? item.quantity : Number.NaN;

    if (!slug) return "Every cart item needs a product slug.";
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_ITEM) {
      return `Quantity for "${slug}" must be a whole number between 1 and ${MAX_QTY_PER_ITEM}.`;
    }

    quantities.set(slug, (quantities.get(slug) ?? 0) + quantity);
  }

  for (const [slug, quantity] of quantities) {
    if (quantity > MAX_QTY_PER_ITEM) {
      return `Quantity for "${slug}" must be a whole number between 1 and ${MAX_QTY_PER_ITEM}.`;
    }
  }

  return quantities;
}

export async function POST(request: Request) {
  let body: OrderRequestBody;
  try {
    body = (await request.json()) as OrderRequestBody;
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const paymentMethod =
    body.paymentMethod === undefined || body.paymentMethod === null
      ? "razorpay"
      : body.paymentMethod;
  if (paymentMethod !== "razorpay" && paymentMethod !== "cod") {
    return badRequest("paymentMethod must be 'razorpay' or 'cod'.");
  }

  const quantities = readQuantities(body.items);
  if (typeof quantities === "string") return badRequest(quantities);

  const address = readAddress(body.shippingAddress);
  if (typeof address === "string") return badRequest(address);

  const session = await getSessionUser();
  const email =
    session?.email ?? (typeof body.email === "string" ? body.email.trim() : "");
  if (!EMAIL_RE.test(email)) {
    return badRequest("Enter a valid email address for the order confirmation.");
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    return serverError("The server is not configured to create orders yet.");
  }

  // --- Price the cart on the server (client amounts are never trusted) ---
  const slugs = [...quantities.keys()];
  const { data: products, error: productError } = await admin
    .from("products")
    .select("slug, name, price")
    .in("slug", slugs);

  if (productError) {
    console.error("Product lookup failed:", productError.message);
    return serverError("Could not read the product catalogue.");
  }

  const catalogue = new Map<string, { name: string; price: number }>();
  for (const row of products ?? []) {
    const slug = String((row as { slug?: unknown }).slug ?? "");
    const name = String((row as { name?: unknown }).name ?? slug);
    const price = Number((row as { price?: unknown }).price);
    if (slug && Number.isFinite(price) && price > 0) {
      catalogue.set(slug, { name, price });
    }
  }

  const lines: OrderLine[] = [];
  let subtotal = 0;
  for (const [slug, quantity] of quantities) {
    const product = catalogue.get(slug);
    if (!product) return badRequest(`"${slug}" is no longer available.`);

    lines.push({ slug, name: product.name, quantity, unit_price: product.price });
    subtotal += product.price * quantity;
  }

  // Round once, at the boundary, in rupees.
  subtotal = Math.round(subtotal * 100) / 100;
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return badRequest("The order total is invalid.");
  }

  const { currency } = getRazorpayConfig();

  // --- Persist the order first so it has an id to use as the receipt ---
  // Existing `orders` schema: address is plain text, line items live in the
  // separate `order_items` table, and `customer_name` / `customer_phone` hold
  // the structured contact fields.
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: session?.id ?? null,
      email,
      customer_name: address.name,
      customer_phone: address.phone,
      shipping_address: formatAddress(address),
      total: subtotal, // taxes are already included in the listed price
      currency,
      payment_method: paymentMethod,
      payment_status: paymentMethod === "cod" ? "cod_pending" : "pending",
      status: "pending",
    })
    .select("id, total, currency, payment_method, payment_status, status")
    .single();

  if (orderError || !order) {
    console.error("Order insert failed:", orderError?.message ?? "unknown error");
    return serverError("Could not create the order.");
  }

  // Line items (FK -> orders.id, ON DELETE CASCADE).
  const { error: itemsError } = await admin.from("order_items").insert(
    lines.map((line) => ({
      order_id: order.id,
      product_slug: line.slug,
      product_name: line.name,
      unit_price: line.unit_price,
      quantity: line.quantity,
    }))
  );

  if (itemsError) {
    console.error("Order items insert failed:", itemsError.message);
    // Remove the headless order so the customer can simply retry.
    await admin.from("orders").delete().eq("id", order.id);
    return serverError("Could not create the order.");
  }

  const orderSummary = {
    id: order.id as string,
    total: Number(order.total),
    currency: order.currency as string,
    paymentMethod: order.payment_method as string,
    paymentStatus: order.payment_status as string,
    status: order.status as string,
  };

  // --- COD: no Razorpay order, no payments row ---
  if (paymentMethod === "cod") {
    return NextResponse.json({ requiresPayment: false, order: orderSummary });
  }

  // --- Online: create the Razorpay order, then the payments row ---
  const { keyId, usingPlaceholders } = getRazorpayConfig();
  const amountInPaise = Math.round(subtotal * 100);

  try {
    const razorpayOrderId = await createRazorpayOrder(subtotal, order.id);

    const { error: paymentError } = await admin.from("payments").insert({
      order_id: order.id,
      payment_provider: "razorpay",
      provider_order_id: razorpayOrderId,
      amount: amountInPaise,
      currency,
      status: "pending",
    });

    if (paymentError) throw new Error(paymentError.message);

    return NextResponse.json({
      requiresPayment: true,
      razorpay: {
        keyId, // public — safe for the browser
        amount: amountInPaise, // smallest currency unit (paise)
        currency,
        orderId: razorpayOrderId,
      },
      order: orderSummary,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err instanceof Error ? err.message : err);

    // Remove the half-created order so the customer can simply retry.
    await admin.from("orders").delete().eq("id", order.id);

    const message = usingPlaceholders
      ? "Payments are not configured yet: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local (see .env.example)."
      : "Could not start the payment. Please try again.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
