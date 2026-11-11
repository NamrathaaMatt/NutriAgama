"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/frontend/hooks/use-products";
import { useCart } from "@/frontend/hooks/use-cart";
import Navbar from "@/frontend/components/navbar/Navbar";
import "@/frontend/styles/shop.css";

type CartLine = {
  slug: string;
  variantId: string;
  quantity: number;
};

type SuggestionProduct = {
  slug: string;
  name: string;
  price: number | string;
  image: string;
  hoverImage?: string;
  inStock: boolean;
  variants?: { id: string }[];
};

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CartRow({ line }: { line: CartLine }) {
  const { products } = useProducts();
  const { updateQuantity, removeFromCart } = useCart();
  const product = products.find((p) => p.slug === line.slug);
  const variant = product?.variants.find((v) => v.id === line.variantId);

  if (!product || !variant) return null;

  return (
    <div className="cartRow">
      <Link href={`/shop/${product.slug}`} className="cartRowImageLink">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="cartRowImage"
          sizes="96px"
        />
      </Link>

      <div className="cartRowInfo">
        <Link href={`/shop/${product.slug}`} className="cartRowName">
          {product.name}
        </Link>
        <span className="cartRowMeta">
          {variant.label} · {product.tagline}
        </span>
        <span className="cartRowPrice">₹{variant.price}</span>

        <span className={`cartRowStock ${variant.inStock ? "" : "cartRowStockOut"}`}>
          <span className="cartStockDot" aria-hidden="true" />
          {variant.inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      <div className="cartRowSide">
        <div className="qtyStepper">
          <button
            type="button"
            onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span>{line.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
            disabled={!variant.inStock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="cartRowRemoveIcon"
          onClick={() => removeFromCart(line.variantId)}
          aria-label={`Remove ${product.name} ${variant.label} from cart`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function CartSuggestionCard({ item }: { item: SuggestionProduct }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const hasSizes = (item.variants?.length ?? 0) > 1;

  const handleAdd = async () => {
    if (!item.inStock) return;
    const ok = await addToCart(item.slug, 1);
    if (!ok) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="cartSuggestionCard">
      <Link href={`/shop/${item.slug}`} className="cartSuggestionImageWrap">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="cartSuggestionImage cartSuggestionImageBase"
          sizes="(max-width: 640px) 40vw, 200px"
        />
        {item.hoverImage && (
          <Image
            src={item.hoverImage}
            alt=""
            fill
            className="cartSuggestionImage cartSuggestionImageHover"
            sizes="(max-width: 640px) 40vw, 200px"
          />
        )}
      </Link>

      <div className="cartSuggestionRow">
        <Link href={`/shop/${item.slug}`} className="cartSuggestionName">
          {item.name}
        </Link>
        <button
          type="button"
          className={`cartSuggestionAddBtn ${added ? "cartSuggestionAddBtnActive" : ""}`}
          onClick={handleAdd}
          disabled={!item.inStock}
        >
          {!item.inStock ? "Sold out" : added ? "✓" : "Add"}
        </button>
      </div>

      <span className="cartSuggestionPrice">
        {hasSizes ? "From " : ""}₹{item.price}
      </span>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { products, loaded: productsLoaded, refreshProducts } = useProducts();
  const { items, loaded, clearCart } = useCart();

  // Reload stock every time the cart opens, so tags are never stale.
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  if (!loaded || !productsLoaded) {
    return <div className="page" />;
  }

  // Each cart line is a product in one size. Look both up together.
  const lines = items.map((item) => {
    const product = products.find((p) => p.slug === item.slug);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    return { item, variant };
  });

  // Only in-stock sizes count toward what can actually be bought.
  const buyable = lines.filter((l) => l.variant && l.variant.inStock);
  const hasOutOfStock = lines.some((l) => l.variant && !l.variant.inStock);

  const subtotal = buyable.reduce(
    (sum, l) => sum + (l.variant ? l.variant.price * l.item.quantity : 0),
    0
  );
  const buyableCount = buyable.reduce((sum, l) => sum + l.item.quantity, 0);

  const cartSlugs = items.map((i) => i.slug);
  const suggestions = products.filter((p) => !cartSlugs.includes(p.slug)).slice(0, 4);

  return (
    <div className="page">
      <Navbar textTone="black" iconTone="black" fixed={true} opaque={true} />
      <div className="cartHero">
        <div className="cartHeroLeaf cartHeroLeafLeft" aria-hidden="true">🌿</div>
        <div className="cartHeroText">
          <h1 className="cartHeroTitle">Your Cart</h1>
        </div>
        <div className="cartHeroDecor">
        </div>
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
        {items.length === 0 && (
          <div className="wishlistEmpty">
            <span className="wishlistEmptyIcon" aria-hidden="true">🛒</span>
            <p className="wishlistEmptyText">Your cart is empty.</p>
            <Link href="/shop" className="wishlistShopBtn">
              Browse the Shop
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="cartLayout">
            <div className="cartMain">
              <div className="cartMainHeader">
                <h2 className="cartMainHeading">Cart Items ({items.length})</h2>
                <button type="button" className="cartClearBtn" onClick={clearCart}>
                  <TrashIcon /> Clear Cart
                </button>
              </div>

              <div className="cartList">
                {items[0] && <CartRow line={items[0]} />}
                {items[1] && <CartRow line={items[1]} />}
                {items[2] && <CartRow line={items[2]} />}
                {items[3] && <CartRow line={items[3]} />}
                {items[4] && <CartRow line={items[4]} />}
                {items[5] && <CartRow line={items[5]} />}
                {items[6] && <CartRow line={items[6]} />}
                {items[7] && <CartRow line={items[7]} />}
              </div>
            </div>

            <div className="cartSummary">
              <h2 className="cartSummaryTitle">Order Summary</h2>

              <div className="cartSummaryRow">
                <span>Subtotal ({buyableCount} items)</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
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
                  Some items are out of stock. Remove them to continue to checkout.
                </p>
              )}

              <button
                type="button"
                className="addToCartBtn cartCheckoutBtn"
                disabled={hasOutOfStock}
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout →
              </button>

              <Link href="/shop" className="cartContinueBtn">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="cartSuggestions">
            <div className="cartSuggestionsHeader">
              <div>
                <h2 className="cartMainHeading">You may also like</h2>
                <p className="cartSuggestionsSubtitle">More natural goodness for you</p>
              </div>
              <Link href="/shop" className="cartSuggestionsViewAll">
                View All Products →
              </Link>
            </div>

            <div className="cartSuggestionsGrid">
              {suggestions[0] && <CartSuggestionCard item={suggestions[0]} />}
              {suggestions[1] && <CartSuggestionCard item={suggestions[1]} />}
              {suggestions[2] && <CartSuggestionCard item={suggestions[2]} />}
              {suggestions[3] && <CartSuggestionCard item={suggestions[3]} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}