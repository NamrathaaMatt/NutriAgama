"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/frontend/hooks/use-products";
import { useCart } from "@/frontend/hooks/use-cart";
import "@/frontend/styles/shop.css";

type CartLine = {
  slug: string;
  quantity: number;
};

type SuggestionProduct = {
  slug: string;
  name: string;
  price: number | string;
  image: string;
  hoverImage?: string;
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

  if (!product) return null;

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
        <span className="cartRowMeta">{product.tagline}</span>
        <span className="cartRowPrice">₹{product.price}</span>

        <span className="cartRowStock">
          <span className="cartStockDot" aria-hidden="true" />
          In stock
        </span>
      </div>

      <div className="cartRowSide">
        <div className="qtyStepper">
          <button
            type="button"
            onClick={() => updateQuantity(product.slug, line.quantity - 1)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span>{line.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(product.slug, line.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="cartRowRemoveIcon"
          onClick={() => removeFromCart(product.slug)}
          aria-label={`Remove ${product.name} from cart`}
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

  const handleAdd = () => {
    addToCart(item.slug, 1);
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
        >
          {added ? "✓" : "Add"}
        </button>
      </div>

      <span className="cartSuggestionPrice">₹{item.price}</span>
    </div>
  );
}

export default function CartPage() {
  const { products, loaded: productsLoaded } = useProducts();
  const { items, loaded, totalItems, clearCart } = useCart();

  if (!loaded || !productsLoaded) {
    return <div className="page" />;
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.slug === item.slug);
    return product ? sum + Number(product.price) * item.quantity : sum;
  }, 0);

  const cartSlugs = items.map((i) => i.slug);
  const suggestions = products.filter((p) => !cartSlugs.includes(p.slug)).slice(0, 4);

  return (
    <div className="page">
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
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="cartSummaryTotal">
                <span>Total</span>
                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                  <span className="cartSummaryTotalNote">(incl. all taxes)</span>
                </span>
              </div>

              <button type="button" className="addToCartBtn cartCheckoutBtn">
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