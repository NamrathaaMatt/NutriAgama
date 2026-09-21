"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "@/frontend/components/mock-products";
import { useWishlist } from "@/frontend/hooks/use-wishlist";
import { useCart } from "@/frontend/hooks/use-cart";
import "@/frontend/styles/shop.css";

type WishlistItem = {
  slug: string;
  name: string;
  tagline: string;
  price: number | string;
  image: string;
  hoverImage?: string;
};

type SuggestionProduct = {
  slug: string;
  name: string;
  tagline: string;
  price: number | string;
  image: string;
  hoverImage?: string;
};

function WishlistCard({ item }: { item: WishlistItem }) {
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(item.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card">
      <div className="cardImageWrap">
        <span className="discountBadge">In Stock</span>

        <button
          type="button"
          className="wishlistBtn productRelatedWishlist wishlistBtnActive"
          aria-label="Remove from wishlist"
          onClick={() => toggleWishlist(item.slug)}
        >
          ♥
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
          <span className="price">₹{item.price}</span>
          <button type="button" className="addToCartBtn" onClick={handleAdd}>
            <span aria-hidden="true">{added ? "✓" : "🛒"}</span>{" "}
            {added ? "Added" : "Add to Cart"}
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

  const handleAdd = () => {
    addToCart(item.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card">
      <div className="cardImageWrap">
        <span className="discountBadge">In Stock</span>

        <button
          type="button"
          className={`wishlistBtn productRelatedWishlist ${liked ? "wishlistBtnActive" : ""}`}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(item.slug)}
        >
          ♥
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
          <span className="price">₹{item.price}</span>
          <button type="button" className="addToCartBtn" onClick={handleAdd}>
            <span aria-hidden="true">{added ? "✓" : "🛒"}</span>{" "}
            {added ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { slugs, loaded, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!loaded) {
    return <div className="page" />;
  }

  const items = mockProducts.filter((p) => slugs.includes(p.slug));
  const suggestions = mockProducts.filter((p) => !slugs.includes(p.slug)).slice(0, 4);

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addToCart(item.slug, 1);
      toggleWishlist(item.slug);
    });
  };

  return (
        <div className="page">
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
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {items.length === 0 && (
          <div className="wishlistEmpty">
            <span className="wishlistEmptyIcon" aria-hidden="true">♥</span>
            <p className="wishlistEmptyText">Your wishlist is empty.</p>
            <Link href="/shop" className="wishlistShopBtn">
              Browse the Shop
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="wishlistGrid">
            {items[0] && <WishlistCard item={items[0]} />}
            {items[1] && <WishlistCard item={items[1]} />}
            {items[2] && <WishlistCard item={items[2]} />}
            {items[3] && <WishlistCard item={items[3]} />}
            {items[4] && <WishlistCard item={items[4]} />}
            {items[5] && <WishlistCard item={items[5]} />}
            {items[6] && <WishlistCard item={items[6]} />}
            {items[7] && <WishlistCard item={items[7]} />}
          </div>
        )}

        {items.length > 0 && (
  <div className="wishlistMoveAllRow">
    <button
      type="button"
      className="wishlistMoveAllBtn"
      onClick={handleMoveAllToCart}
    >
      🛒 Move All to Cart
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