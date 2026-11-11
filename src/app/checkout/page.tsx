"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/frontend/hooks/use-cart";
import { useProducts } from "@/frontend/hooks/use-products";
import { createClient } from "@/backend/supabase/client";
import { addAddress, type Address } from "@/backend/actions/addresses";
import Navbar from "@/frontend/components/navbar/Navbar";
import "@/frontend/styles/shop.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormState = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type OrderSummary = {
  id: string;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
};

type RazorpayInfo = {
  keyId: string;
  amount: number; // paise
  currency: string;
  orderId: string;
};

type CreateOrderResponse = {
  requiresPayment?: boolean;
  order?: OrderSummary;
  razorpay?: RazorpayInfo;
  error?: string;
};

type VerifyResponse = {
  success?: boolean;
  error?: string;
};

/** An order the server already created, still waiting for its payment. */
type CreatedOrder = {
  id: string;
  razorpay: RazorpayInfo | null;
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

// Same rules the address book enforces (see src/backend/actions/addresses.ts).
const PHONE_RE = /^(\+91[\s-]?)?[6-9][0-9]{9}$/;
const PINCODE_RE = /^[1-9][0-9]{5}$/;

// ---------------------------------------------------------------------------
// Razorpay checkout script (loaded once, on demand)
// ---------------------------------------------------------------------------

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Could not load the payment window. Check your connection."))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Could not load the payment window. Check your connection."));
    document.body.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const { items, loaded, clearCart } = useCart();
  const { products, loaded: productsLoaded, refreshProducts } = useProducts();

  // Auth + address book
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState("");

  // Inline "add address" form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  // Order placement
  const [method, setMethod] = useState<"razorpay" | "cod">("razorpay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedOrder | null>(null);

  // Login gate: no session -> back to login, returning here afterwards.
  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;
      if (!user) {
        router.replace("/login?next=/checkout");
        return;
      }

      setEmail(user.email ?? "");
      setAuthChecked(true);

      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;
      const list = (data ?? []) as Address[];
      setAddresses(list);
      setSelectedId(list.find((a) => a.is_default)?.id ?? list[0]?.id ?? "");
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  // Stock tags should be fresh while the customer decides.
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Resolve the cart against the catalogue, exactly like the cart page does.
  const lines = items.map((item) => {
    const product = products.find((p) => p.slug === item.slug);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    return { item, product, variant };
  });

  const buyable = lines.filter((l) => l.product && l.variant && l.variant.inStock);
  const hasOutOfStock = lines.some((l) => l.variant && !l.variant.inStock);
  const subtotal = buyable.reduce(
    (sum, l) => sum + (l.variant ? l.variant.price * l.item.quantity : 0),
    0
  );
  const itemCount = buyable.reduce((sum, l) => sum + l.item.quantity, 0);
  const selected = addresses.find((a) => a.id === selectedId) ?? null;

  // The API accepts { slug, quantity } — same slug twice is merged here so the
  // payload already matches what the server would do with it.
  const apiItems = (() => {
    const bySlug = new Map<string, number>();
    for (const line of buyable) {
      bySlug.set(line.item.slug, (bySlug.get(line.item.slug) ?? 0) + line.item.quantity);
    }
    return [...bySlug].map(([slug, quantity]) => ({ slug, quantity }));
  })();

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setFormError(null);
  }

  // Convenience carried over from the address book: fill city/state from pincode.
  async function lookupPincode(pin: string) {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const json = await res.json();
      const office = json?.[0]?.PostOffice?.[0];
      if (office) {
        setForm((f) => ({ ...f, city: f.city || office.District, state: f.state || office.State }));
      }
    } catch {
      /* lookup is a convenience only, ignore failures */
    }
  }

  function handlePincode(raw: string) {
    const pin = raw.replace(/\D/g, "").slice(0, 6);
    updateForm("pincode", pin);
    if (pin.length === 6) lookupPincode(pin);
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Client-side hints before the server action runs (it validates too).
    if (form.fullName.trim().length < 2) return setFormError("Enter your full name.");
    if (!PHONE_RE.test(form.phone.trim())) return setFormError("Enter a valid 10-digit mobile number.");
    if (form.line1.trim().length < 3) return setFormError("Enter your address.");
    if (!form.city.trim()) return setFormError("Enter your city.");
    if (!form.state.trim()) return setFormError("Enter your state.");
    if (!PINCODE_RE.test(form.pincode.trim())) return setFormError("Enter a valid 6-digit pincode.");

    setSavingAddress(true);
    try {
      const result = await addAddress(form);
      if (result.error) {
        setFormError(result.error);
        return;
      }

      // Reload the book so the new address is selectable.
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const list = (data ?? []) as Address[];
      setAddresses(list);
      setSelectedId(result.id ?? list[0]?.id ?? "");
      setForm(EMPTY_FORM);
      setShowForm(false);
    } finally {
      setSavingAddress(false);
    }
  }

  // -------------------------------------------------------------------------
  // Order flow
  // -------------------------------------------------------------------------

  async function openPayment(order: CreatedOrder, address: Address) {
    if (!order.razorpay) return;

    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      await loadRazorpayScript();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the payment window.");
      setSubmitting(false);
      return;
    }

    const Ctor = window.Razorpay;
    if (!Ctor) {
      setError("Could not open the payment window.");
      setSubmitting(false);
      return;
    }

    const rzp = new Ctor({
      key: order.razorpay.keyId,
      amount: order.razorpay.amount,
      currency: order.razorpay.currency,
      order_id: order.razorpay.orderId,
      name: "NUTRI-AGMA",
      description: `Order ${order.id.slice(0, 8).toUpperCase()}`,
      prefill: {
        name: address.name,
        email,
        contact: address.phone,
      },
      theme: { color: "#38492f" },
      handler: (rsp: RazorpayResponse) => {
        void verifyPayment(order.id, rsp);
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          setNotice(
            "Payment window closed. Your order is saved — choose Complete payment when you are ready."
          );
        },
      },
    });

    rzp.open();
  }

  async function verifyPayment(orderId: string, rsp: RazorpayResponse) {
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, ...rsp }),
      });
      const data: VerifyResponse = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        setError(
          data.error ??
            "Payment could not be verified. If you were charged, contact support with your order id."
        );
        setSubmitting(false);
        return;
      }

      await clearCart();
      router.push(`/order-confirmation?order_id=${orderId}`);
    } catch {
      setError("Could not verify the payment. Check your connection and do not pay again.");
      setSubmitting(false);
    }
  }

  async function placeOrder() {
    if (!selected) {
      setError("Choose a delivery address.");
      return;
    }
    if (apiItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (hasOutOfStock) {
      setError("Some items are out of stock. Update your cart first.");
      return;
    }
    if (!email) {
      setError("Your account has no email address, which we need for the order confirmation.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: apiItems,
          shippingAddress: {
            name: selected.name,
            phone: selected.phone,
            address_line: selected.address_line,
            landmark: selected.landmark,
            city: selected.city,
            state: selected.state,
            pincode: selected.pincode,
          },
          paymentMethod: method,
          email,
        }),
      });

      const data: CreateOrderResponse = await res.json().catch(() => ({}));

      if (!res.ok || data.error || !data.order) {
        setError(data.error ?? "Could not place the order. Please try again.");
        setSubmitting(false);
        return;
      }

      // COD: the order is written, nothing more to pay right now.
      if (data.requiresPayment === false) {
        await clearCart();
        router.push(`/order-confirmation?order_id=${data.order.id}`);
        return;
      }

      if (!data.razorpay) {
        setError("The payment setup is incomplete. Please try again.");
        setSubmitting(false);
        return;
      }

      // `submitting` stays true from here: the modal is about to open, and only
      // its dismissal or the verification result may re-enable the button —
      // otherwise a second click could open two modals for one order.
      const order: CreatedOrder = { id: data.order.id, razorpay: data.razorpay };
      setCreated(order);
      await openPayment(order, selected);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (!authChecked || !loaded || !productsLoaded) {
    return <div className="page" />;
  }

  const emptyCart = buyable.length === 0 && !hasOutOfStock;

  return (
    <div className="page">
      <Navbar textTone="black" iconTone="black" fixed={true} opaque={true} />

      <div className="cartHero">
        <div className="cartHeroLeaf cartHeroLeafLeft" aria-hidden="true">🌿</div>
        <div className="cartHeroText">
          <h1 className="cartHeroTitle">Checkout</h1>
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
        {emptyCart ? (
          <div className="wishlistEmpty">
            <span className="wishlistEmptyIcon" aria-hidden="true">🛒</span>
            <p className="wishlistEmptyText">Your cart is empty.</p>
            <Link href="/shop" className="wishlistShopBtn">
              Browse the Shop
            </Link>
          </div>
        ) : (
          <div className="cartLayout">
            {/* ---------------- Left: address + payment ---------------- */}
            <div className="cartMain">
              <div className="cartMainHeader">
                <h2 className="cartMainHeading">1. Delivery address</h2>
                {addresses.length > 0 && !showForm && !created && (
                  <button
                    type="button"
                    className="cartClearBtn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add new address
                  </button>
                )}
              </div>

              {addresses.length === 0 && !showForm && (
                <p className="coHint">Add an address so we know where to deliver.</p>
              )}

              {addresses.length > 0 && (
                <ul className="coAddrList">
                  {[...addresses]
                    .sort((a, b) => Number(b.is_default) - Number(a.is_default))
                    .map((a) => (
                      <li key={a.id}>
                        <label
                          className={`coAddr ${selectedId === a.id ? "coAddrSelected" : ""} ${
                            created ? "coAddrLocked" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="checkout-address"
                            checked={selectedId === a.id}
                            onChange={() => setSelectedId(a.id)}
                            disabled={Boolean(created)}
                          />
                          <span className="coAddrBody">
                            <span className="coAddrTop">
                              <strong className="coAddrName">{a.name}</strong>
                              {a.is_default && <span className="coAddrBadge">Default</span>}
                            </span>
                            <span className="coAddrText">
                              {a.address_line}
                              {a.landmark ? `, ${a.landmark}` : ""}
                              <br />
                              {a.city}, {a.state} {a.pincode}
                            </span>
                            <span className="coAddrPhone">{a.phone}</span>
                          </span>
                        </label>
                      </li>
                    ))}
                </ul>
              )}

              {addresses.length > 0 && !showForm && !created && (
                <button
                  type="button"
                  className="coAddBtn"
                  onClick={() => setShowForm(true)}
                >
                  + Deliver to a new address
                </button>
              )}

              {showForm && !created && (
                <form className="coForm" onSubmit={handleSaveAddress} noValidate>
                  <div className="coFormGrid">
                    <input
                      className="coInput"
                      placeholder="Full name"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(e) => updateForm("fullName", e.target.value)}
                      aria-label="Full name"
                    />
                    <input
                      className="coInput"
                      type="tel"
                      placeholder="Mobile number"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      aria-label="Mobile number"
                    />
                  </div>

                  <input
                    className="coInput"
                    placeholder="Address line 1"
                    autoComplete="address-line1"
                    value={form.line1}
                    onChange={(e) => updateForm("line1", e.target.value)}
                    aria-label="Address line 1"
                  />
                  <input
                    className="coInput"
                    placeholder="Landmark (optional)"
                    autoComplete="address-line2"
                    value={form.line2}
                    onChange={(e) => updateForm("line2", e.target.value)}
                    aria-label="Landmark"
                  />

                  <div className="coFormGrid coFormGrid3">
                    <input
                      className="coInput"
                      placeholder="City"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      aria-label="City"
                    />
                    <input
                      className="coInput"
                      placeholder="State"
                      autoComplete="address-level1"
                      value={form.state}
                      onChange={(e) => updateForm("state", e.target.value)}
                      aria-label="State"
                    />
                    <input
                      className="coInput"
                      placeholder="Pincode"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => handlePincode(e.target.value)}
                      aria-label="Pincode"
                    />
                  </div>

                  {addresses.length > 0 && (
                    <label className="coCheck">
                      <input
                        type="checkbox"
                        checked={form.isDefault}
                        onChange={(e) => updateForm("isDefault", e.target.checked)}
                      />
                      Set as default address
                    </label>
                  )}

                  {formError && (
                    <p className="coError" role="alert">{formError}</p>
                  )}

                  <div className="coFormActions">
                    <button
                      type="submit"
                      className="addToCartBtn"
                      disabled={savingAddress}
                    >
                      {savingAddress ? "Saving…" : "Save address"}
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        className="cartContinueBtn coCancelBtn"
                        onClick={() => {
                          setShowForm(false);
                          setFormError(null);
                        }}
                        disabled={savingAddress}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* ---------------- Payment method ---------------- */}
              <div className="cartMainHeader coSection">
                <h2 className="cartMainHeading">2. Payment method</h2>
              </div>

              <div className="coPayList">
                <label
                  className={`coPay ${method === "razorpay" ? "coPaySelected" : ""} ${
                    created ? "coAddrLocked" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={method === "razorpay"}
                    onChange={() => setMethod("razorpay")}
                    disabled={Boolean(created)}
                  />
                  <span className="coPayBody">
                    <span className="coPayTitle">Pay online</span>
                    <span className="coPayDesc">
                      UPI, cards, netbanking and wallets — secured by Razorpay
                    </span>
                  </span>
                </label>

                <label
                  className={`coPay ${method === "cod" ? "coPaySelected" : ""} ${
                    created ? "coAddrLocked" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={method === "cod"}
                    onChange={() => setMethod("cod")}
                    disabled={Boolean(created)}
                  />
                  <span className="coPayBody">
                    <span className="coPayTitle">Cash on delivery</span>
                    <span className="coPayDesc">Pay when your order arrives</span>
                  </span>
                </label>
              </div>

              {created && (
                <p className="coPendingBanner">
                  Order <strong>{created.id.slice(0, 8).toUpperCase()}</strong> has been
                  created. Complete the payment to confirm it — your cart stays as it is
                  until then.
                </p>
              )}
            </div>

            {/* ---------------- Right: order summary ---------------- */}
            <aside className="cartSummary">
              <h2 className="cartSummaryTitle">Order Summary</h2>

              <div className="coSummaryItems">
                {buyable.map(({ item, product, variant }) =>
                  product && variant ? (
                    <div className="coSummaryItem" key={item.variantId}>
                      <span className="coSummaryItemName">
                        {product.name}
                        <span className="coSummaryItemMeta"> · {variant.label}</span>
                        <span className="coSummaryItemQty"> × {item.quantity}</span>
                      </span>
                      <span className="coSummaryItemPrice">
                        ₹{(variant.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ) : null
                )}
              </div>

              <div className="cartSummaryRow">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="coDeliveryRow">
                <span>Delivery</span>
                <span>Free</span>
              </div>

              <div className="cartSummaryTotal">
                <span>Total</span>
                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                  <span className="cartSummaryTotalNote">GST included</span>
                </span>
              </div>

              {hasOutOfStock && (
                <p className="cartStockNotice">
                  Some items are out of stock. Remove them in the cart to continue.
                </p>
              )}

              {error && (
                <p className="coError" role="alert">{error}</p>
              )}
              {notice && <p className="coNotice">{notice}</p>}

              {created ? (
                <button
                  type="button"
                  className="addToCartBtn cartCheckoutBtn"
                  onClick={() => selected && openPayment(created, selected)}
                  disabled={submitting}
                >
                  {submitting ? "Opening payment…" : "Complete payment →"}
                </button>
              ) : (
                <button
                  type="button"
                  className="addToCartBtn cartCheckoutBtn"
                  onClick={placeOrder}
                  disabled={submitting || hasOutOfStock || !selected || apiItems.length === 0}
                >
                  {submitting
                    ? "Placing order…"
                    : method === "cod"
                      ? "Place Order (COD) →"
                      : "Place Order →"}
                </button>
              )}

              <Link href="/cart" className="cartContinueBtn">
                ← Back to Cart
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
