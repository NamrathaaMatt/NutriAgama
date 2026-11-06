import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/backend/supabase/admin";
import Navbar from "@/frontend/components/navbar/Navbar";
import "@/frontend/styles/shop.css";

export const metadata = {
  title: "Order confirmed | NUTRI-AGMA",
};

/** Orders are uuid v4 (gen_random_uuid) — reject anything else up front. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type OrderLine = {
  product_slug?: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

type OrderRow = {
  id: string;
  email: string;
  customer_name: string | null;
  total: number | string;
  currency: string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  shipping_address: string | null;
  order_items: OrderLine[] | null;
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const PAYMENT_LABELS: Record<string, string> = {
  pending: "Awaiting payment",
  cod_pending: "Cash on delivery — payable on delivery",
  paid: "Paid",
  failed: "Payment failed",
};

/** Mirrors the pre-existing orders.status CHECK constraint. */
const ORDER_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function money(value: number | string, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  const symbol = currency === "INR" ? "₹" : "";
  return `${symbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawOrderId = params.order_id;
  const orderId = typeof rawOrderId === "string" ? rawOrderId.trim() : "";

  if (!orderId || !UUID_RE.test(orderId)) notFound();

  let order: OrderRow | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "id, email, customer_name, total, currency, payment_method, " +
          "payment_status, status, created_at, shipping_address, " +
          "order_items(product_name, product_slug, unit_price, quantity)"
      )
      .eq("id", orderId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    order = data as OrderRow | null;
  } catch (err) {
    console.error("Order lookup failed:", err instanceof Error ? err.message : err);
  }

  if (!order) notFound();

  const items = Array.isArray(order.order_items) ? order.order_items : [];
  const isPaid = order.payment_status === "paid";
  const isFailed = order.payment_status === "failed";

  const placedAt = new Date(order.created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="page">
      <Navbar textTone="black" iconTone="black" fixed={true} opaque={true} />

      <div className="cartHero">
        <div className="cartHeroLeaf cartHeroLeafLeft" aria-hidden="true">
          🌿
        </div>
        <div className="cartHeroText">
          <h1 className="cartHeroTitle">
            {isFailed ? "Payment failed" : isPaid ? "Thank you!" : "Order received"}
          </h1>
        </div>
        <div className="cartHeroDecor" />
        <svg
          className="cartHeroWave"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,80 L0,80 Z"
            fill="var(--cream)"
          />
        </svg>
      </div>

      <div className="cartPage">
        <div className="cartMain" style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div className="cartMainHeader">
            <h2 className="cartSummaryTitle">Order confirmation</h2>
            <span className="cartRowStock">
              <span className="cartStockDot" aria-hidden="true" />
              {ORDER_LABELS[order.status] ?? order.status}
            </span>
          </div>

          <p className="cartSummaryRow">
            <span>Order number</span>
            <span>{order.id}</span>
          </p>
          <p className="cartSummaryRow">
            <span>Payment</span>
            <span>
              {PAYMENT_LABELS[order.payment_status] ?? order.payment_status}
              {order.payment_method === "cod" ? " (COD)" : ""}
            </span>
          </p>
          <p className="cartSummaryRow">
            <span>Placed</span>
            <span>{placedAt}</span>
          </p>
          <p className="cartSummaryRow">
            <span>Email</span>
            <span>{order.email}</span>
          </p>

          <div className="cartList" style={{ margin: "16px 0" }}>
            {items.map((line, index) => (
              <div className="cartRow" key={line.product_slug ?? index}>
                <div className="cartRowInfo">
                  <span className="cartRowName">{line.product_name}</span>
                  <span className="cartRowMeta">
                    Qty {line.quantity} × {money(line.unit_price, order.currency)}
                  </span>
                </div>
                <div className="cartRowSide">
                  <span className="cartRowPrice">
                    {money(
                      (Number(line.unit_price) || 0) * (line.quantity || 1),
                      order.currency
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="cartSummaryTotal">
            <span>Total</span>
            <span>{money(order.total, order.currency)}</span>
          </div>

          <h3 className="cartSummaryTitle" style={{ marginTop: "20px" }}>
            Shipping to
          </h3>
          <p className="cartSummaryRow">
            <span>{order.shipping_address}</span>
          </p>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <Link href="/shop" className="wishlistShopBtn">
              Continue Shopping
            </Link>
            <Link href="/cart" className="cartContinueBtn" style={{ width: "auto" }}>
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
