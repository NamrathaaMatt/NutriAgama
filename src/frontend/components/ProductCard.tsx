"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useWishlist } from "@/frontend/hooks/use-wishlist";
import { useCart } from "@/frontend/hooks/use-cart";

function starClass(rating: number, position: number) {
  if (rating >= position) return "star starFull";
  if (rating >= position - 0.5) return "star starHalf";
  return "star";
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-hidden="true">
      <span className={starClass(rating, 1)}>★</span>
      <span className={starClass(rating, 2)}>★</span>
      <span className={starClass(rating, 3)}>★</span>
      <span className={starClass(rating, 4)}>★</span>
      <span className={starClass(rating, 5)}>★</span>
    </span>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const liked = isWishlisted(product.slug);

  return (
    <Link href={`/shop/${product.slug}`} className="card">
      <div className="cardImageWrap">
        <span className="discountBadge">In Stock</span>
        <button
          type="button"
          className={`wishlistBtn ${liked ? "wishlistBtnActive" : ""}`}
          aria-pressed={liked}
          aria-label={
            liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
        >
          ♥
        </button>

        <Image
          src={product.image}
          alt={product.name}
          fill
          className="cardImage cardImageBase"
          sizes="(max-width: 640px) 50vw, 240px"
        />
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt={product.name}
            fill
            className="cardImage cardImageHover"
            sizes="(max-width: 640px) 50vw, 240px"
          />
        )}
      </div>

      <div className="cardBody">
        <h3 className="cardName">{product.name}</h3>
        <p className="cardTagline">{product.tagline}</p>

        <div className="ratingRow">
          <Stars rating={product.rating} />
          <span className="ratingValue">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <div className="cardFooter">
          <div className="priceBlock">
            <span className="price">₹{product.price}</span>
            <span className="mrp">₹{product.mrp}</span>
          </div>
          <button
            className="addToCartBtn"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.slug, 1);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
          >
            <span aria-hidden="true">{added ? "✓" : "🛒"}</span>{" "}
            {added ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}