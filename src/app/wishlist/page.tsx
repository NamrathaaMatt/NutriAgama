"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/frontend/hooks/use-products";
import { useWishlist } from "@/frontend/hooks/use-wishlist";
import { useCart } from "@/frontend/hooks/use-cart";
import { useToast } from "@/frontend/hooks/use-toast";
import Navbar from "@/frontend/components/navbar/Navbar";
import { Product, Variant } from "@/types/product";
import "@/frontend/styles/shop.css";
import { Heart } from "lucide-react";


// One saved size of a product.
type SavedEntry = {
  product: Product;
  variant: Variant;
};

type SuggestionProduct = {
  slug: string;
  name: string;
  tagline: string;
  price: number | string;
  image: string;
  hoverImage?: string;
  inStock: boolean;
  variants?: { id: string }[];
};

function WishlistCard({ entry }: { entry: SavedEntry }) {
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { product, variant } = entry;

  const handleAdd = async () => {
    if (!variant.inStock) return;
    const ok = await addToCart(product.slug, 1, variant.id);
    if (!ok) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card">
      <div className="cardImageWrap">
        <span className={`discountBadge ${variant.inStock ? "" : "outOfStockBadge"}`}>
          {variant.inStock ? "In Stock" : "Out of Stock"}
        </span>

        <button
          type="button"
          className="wishlistBtn productRelatedWishlist wishlistBtnActive"
          aria-label={`Remove ${product.name} ${variant.label} from wishlist`}
          onClick={() => toggleWishlist(product.slug, variant.id)}
        >
          ♥
        </button>

        <Link href={`/shop/${product.slug}`} className="productRelatedImageLink">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="cardImage cardImageBase"
            sizes="(max-width: 700px) 50vw, 260px"
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              className="cardImage cardImageHover"
              sizes="(max-width: 700px) 50vw, 260px"
            />
          )}
        </Link>
      </div>

      <div className="cardBody">
        <h3 className="cardName">
          <Link href={`/shop/${product.slug}`} className="productRelatedNameLink">
            {product.name}
          </Link>
        </h3>
        <p className="cardTagline">
          {variant.label} · {product.tagline}
        </p>

        <div className="cardFooter">
          <span className="price">₹{variant.price}</span>
          <button
            type="button"
            className="addToCartBtn"
            onClick={handleAdd}
            disabled={!variant.inStock}
          >
            {variant.inStock ? (
              <>
                <span aria-hidden="true">{added ? "✓" : "🛒"}</span>{" "}
                {added ? "Added" : "Add to Cart"}
              </>
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function WishlistSuggestionCard({ item }: { item: SuggestionProduct }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const liked = isWishlisted(item.slug);
  const hasSizes = (item.variants?.length ?? 0) > 1;

  const handleAdd = async () => {
    if (!item.inStock) return;
    const ok = await addToCart(item.slug, 1);
    if (!ok) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card">
      <div className="cardImageWrap">
        <span className={`discountBadge ${item.inStock ? "" : "outOfStockBadge"}`}>
          {item.inStock ? "In Stock" : "Out of Stock"}
        </span>

        <button
          type="button"
          className={`wishlistBtn productRelatedWishlist ${liked ? "wishlistBtnActive" : ""}`}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(item.slug)}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>

        <Link href={`/shop/${item.slug}`} className="productRelatedImageLink">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="cardImage cardImageBase"
            sizes="(max-width: 700px) 50vw, 260px"
          />
          {item.hoverImage && (
            <Image
              src={item.hoverImage}
              alt=""
              fill
              className="cardImage cardImageHover"
              sizes="(max-width: 700px) 50vw, 260px"
            />
          )}
        </Link>
      </div>

      <div className="cardBody">
        <h3 className="cardName">
          <Link href={`/shop/${item.slug}`} className="productRelatedNameLink">
            {item.name}
          </Link>
        </h3>
        <p className="cardTagline">{item.tagline}</p>

        <div className="cardFooter">
          <span className="price">
            {hasSizes ? "From " : ""}₹{item.price}
          </span>
          <button
            type="button"
            className="addToCartBtn"
            onClick={handleAdd}
            disabled={!item.inStock}
          >
            {item.inStock ? (
              <>
                <span aria-hidden="true">{added ? "✓" : "🛒"}</span>{" "}
                {added ? "Added" : "Add to Cart"}
              </>
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { products, loaded: productsLoaded } = useProducts();
  const { items: saved, loaded, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [moving, setMoving] = useState(false);

  if (!loaded || !productsLoaded) {
    return <div className="page" />;
  }

  // Match each saved size to its product and size details.
  const entries: SavedEntry[] = [];
  for (const entry of saved) {
    const product = products.find((p) => p.slug === entry.slug);
    const variant = product?.variants.find((v) => v.id === entry.variantId);
    if (product && variant) entries.push({ product, variant });
  }

  const savedSlugs = entries.map((e) => e.product.slug);
  const suggestions = products.filter((p) => !savedSlugs.includes(p.slug)).slice(0, 4);
  const inStockEntries = entries.filter((e) => e.variant.inStock);
  const soldOutCount = entries.length - inStockEntries.length;

  // Moves in-stock sizes one at a time. A size leaves the wishlist only
  // after it was added to the cart, so nothing gets lost if an add fails.
  const handleMoveAllToCart = async () => {
    if (moving || inStockEntries.length === 0) return;
    setMoving(true);

    let moved = 0;
    let failed = 0;

    try {
      for (const entry of inStockEntries) {
        const ok = await addToCart(entry.product.slug, 1, entry.variant.id);
        if (!ok) {
          failed += 1;
          continue;
        }
        await toggleWishlist(entry.product.slug, entry.variant.id);
        moved += 1;
      }
    } finally {
      setMoving(false);
    }

    if (moved === 0) {
      showToast("Could not move items to the cart. Please try again.", "error");
      return;
    }

    const parts = [`Moved ${moved} ${moved === 1 ? "item" : "items"} to your cart`];
    if (soldOutCount > 0) parts.push(`${soldOutCount} sold out stayed in your wishlist`);
    if (failed > 0) parts.push(`${failed} could not be moved`);
    showToast(parts.join(". "));
  };

  return (
    <div className="page">
      <Navbar textTone="black" iconTone="black" fixed={true} opaque={true} />
      <div className="wishlistHero">
        <div className="wishlistHeroLeaf" aria-hidden="true">♥</div>
        <div className="wishlistHeroText">
          <h1 className="wishlistHeroTitle">My Wishlist</h1>
          <p className="wishlistHeroSubtitle">Everything you love, saved in one place</p>
        </div>
        <div className="wishlistHeroDecor">
          <p className="wishlistHeroScript">
            Curated
            <br />
            With
            <br />
            Care
          </p>
          <div className="wishlistHeroNote">
            Save Now,
            <br />
            Shop
            <br />
            Later 💛
          </div>
        </div>
      </div>

      <Link href="/shop" className="backToShop">
        <span aria-hidden="true">←</span> Back to Shop
      </Link>

      <div className="wishlistPage">
        <div className="wishlistHeader">
          <div>
            <p className="wishlistCount">
              {entries.length} {entries.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {entries.length === 0 && (
          <div className="wishlistEmpty">
            <span className="wishlistEmptyIcon" aria-hidden="true">♥</span>
            <p className="wishlistEmptyText">Your wishlist is empty.</p>
            <Link href="/shop" className="wishlistShopBtn">
              Browse the Shop
            </Link>
          </div>
        )}

        {entries.length > 0 && (
          <div className="wishlistGrid">
            {entries[0] && <WishlistCard entry={entries[0]} />}
            {entries[1] && <WishlistCard entry={entries[1]} />}
            {entries[2] && <WishlistCard entry={entries[2]} />}
            {entries[3] && <WishlistCard entry={entries[3]} />}
            {entries[4] && <WishlistCard entry={entries[4]} />}
            {entries[5] && <WishlistCard entry={entries[5]} />}
            {entries[6] && <WishlistCard entry={entries[6]} />}
            {entries[7] && <WishlistCard entry={entries[7]} />}
          </div>
        )}

        {entries.length > 0 && (
          <div className="wishlistMoveAllRow">
            <button
              type="button"
              className="wishlistMoveAllBtn"
              onClick={handleMoveAllToCart}
              disabled={moving || inStockEntries.length === 0}
            >
              {moving ? "Moving…" : "🛒 Move All to Cart"}
            </button>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="productRelated wishlistRelated">
            <h2 className="productReviewsHeading">You may also like</h2>

            <div className="productRelatedList">
              {suggestions[0] && <WishlistSuggestionCard item={suggestions[0]} />}
              {suggestions[1] && <WishlistSuggestionCard item={suggestions[1]} />}
              {suggestions[2] && <WishlistSuggestionCard item={suggestions[2]} />}
              {suggestions[3] && <WishlistSuggestionCard item={suggestions[3]} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}