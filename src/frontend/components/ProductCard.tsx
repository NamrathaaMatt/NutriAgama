"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import Link from "next/link";

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <span key={i} className="star starFull">★</span>;
        if (i === full && hasHalf) return <span key={i} className="star starHalf">★</span>;
        return <span key={i} className="star">★</span>;
      })}
    </span>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <Link href={`/shop/${product.slug}`} className="card">
      <div className="cardImageWrap">
        <span className="discountBadge">In Stock</span>
        <button
          type="button"
          className={`wishlistBtn ${wishlisted ? "wishlistBtnActive" : ""}`}
          aria-pressed={wishlisted}
          aria-label={
            wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((w) => !w);
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
              // your add-to-cart logic here
            }}
          >
            <span aria-hidden="true">🛒</span> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}