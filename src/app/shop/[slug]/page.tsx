"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "@/frontend/components/mock-products";
import "@/frontend/styles/shop.css";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

type Review = {
  name: string;
  rating: number;
  comment: string;
  title?: string;
  date?: string;
};

type RelatedProduct = {
  slug: string;
  name: string;
  description: string;
  price: number | string;
  image: string;
};

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

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="productReviewCard">
      <div className="productReviewHeader">
        <div className="productReviewAvatar">{review.name.charAt(0)}</div>
        <div className="productReviewMeta">
          <div className="productReviewNameRow">
            <span className="productReviewName">{review.name}</span>
            <span className="productReviewVerified">
              <span className="productReviewVerifiedIcon" aria-hidden="true">✓</span>
              Verified Buyer
            </span>
          </div>
          {review.date && <span className="productReviewDate">{review.date}</span>}
        </div>
      </div>

      <Stars rating={review.rating} />

      {review.title && <h3 className="productReviewTitle">{review.title}</h3>}
      <p className="productReviewComment">{review.comment}</p>
    </div>
  );
}

function RelatedCard({ item }: { item: RelatedProduct }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="card">
      <div className="cardImageWrap">
        <span className="discountBadge">In Stock</span>

        <button
          type="button"
          className={`wishlistBtn productRelatedWishlist ${liked ? "wishlistBtnActive" : ""}`}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setLiked((v) => !v)}
        >
          ♥
        </button>

        <Link href={`/shop/${item.slug}`} className="productRelatedImageLink">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="cardImage"
            sizes="(max-width: 700px) 50vw, 260px"
          />
        </Link>
      </div>

      <div className="cardBody">
        <h3 className="cardName">
          <Link href={`/shop/${item.slug}`} className="productRelatedNameLink">
            {item.name}
          </Link>
        </h3>
        <p className="cardTagline">{item.description}</p>

        <div className="cardFooter">
          <span className="price">₹{item.price}</span>
          <button type="button" className="addToCartBtn">
            <span aria-hidden="true">🛒</span> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const product = mockProducts.find((p) => p.slug === slug);

  const [quantity, setQuantity] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!product) {
    notFound();
  }

  const images = [product.image, product.hoverImage].filter(Boolean) as string[];
  const others = mockProducts.filter((p) => p.slug !== slug);

  const goPrev = () =>
    setActiveSlide((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () =>
    setActiveSlide((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="page">
      <Link href="/shop" className="backToShop">
        <span aria-hidden="true">←</span> Back to Shop
      </Link>

      <div className="productPage">
        <div className="productGallery">
          <div className="productMainImageWrap">
            <button
              type="button"
              className={`wishlistBtn productGalleryWishlist ${wishlisted ? "wishlistBtnActive" : ""}`}
              aria-pressed={wishlisted}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => setWishlisted((w) => !w)}
            >
              ♥
            </button>

            <Image
              src={images[activeSlide]}
              alt={`${product.name} photo ${activeSlide + 1}`}
              fill
              className="productImage"
              sizes="(max-width: 900px) 100vw, 42vw"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="productGalleryNav productGalleryNavPrev"
                  onClick={goPrev}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="productGalleryNav productGalleryNavNext"
                  onClick={goNext}
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="productThumbRow">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`productThumb ${i === activeSlide ? "productThumbActive" : ""}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`View photo ${i + 1}`}
                >
                  <Image src={src} alt="" fill className="productThumbImage" sizes="100px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="productInfo">
          <div className="productBadgeRow">
            {product.badges.map((badge) => (
              <span className="productBadge" key={badge}>
                {badge}
              </span>
            ))}
          </div>

          <h1 className="productTitle">{product.name}</h1>
          <p className="productDescription">{product.description}</p>

          <div className="productPriceRow">
            <span className="productPrice">₹{product.price}</span>
            <div className="productSpec">
              <span className="productSpecLabel">Net Weight</span>
              <span className="productSpecValue">{product.netWeight}</span>
            </div>
          </div>

          <div className="productSpecRow">
            <div className="productSpec">
              <span className="productSpecLabel">Ingredients</span>
              <span className="productSpecValue">{product.ingredients}</span>
            </div>
          </div>

          <div className="productCartRow">
            <div className="qtyStepper">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button type="button" className="addToCartBtn productAddToCartBtn">
              <span aria-hidden="true">🛒</span> Add to Cart
            </button>
            <button type="button" className="buyNowBtn">
              Buy Now
            </button>
          </div>

          <div className="productDescriptionWrap">
            <p className={`productDescription ${showFullDescription ? "" : "productDescriptionClamped"}`}>
              {product.long_description}
            </p>
            <button
              type="button"
              className="productDescriptionToggle"
              onClick={() => setShowFullDescription((v) => !v)}
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          </div>

          <div className="productInfoSection">
            <h2 className="productInfoHeading">How to Use</h2>
            <p className="productInfoText">{product.howToUse}</p>
          </div>
        </div>
      </div>

      <div className="productDivider" />

      <div className="productReviews">
        <h2 className="productReviewsHeading">Our Customer Reviews</h2>

        <div className="productReviewsSummary">
          <Stars rating={product.rating} />
          <span className="productReviewsSummaryText">
            {product.rating} out of 5 ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="productReviewList">
          {product.reviews[0] && <ReviewCard review={product.reviews[0]} />}
          {product.reviews[1] && <ReviewCard review={product.reviews[1]} />}
          {product.reviews[2] && <ReviewCard review={product.reviews[2]} />}
        </div>
      </div>

      <div className="productDivider" />

      <div className="productRelated">
        <h2 className="productReviewsHeading">People also like</h2>

        <div className="productRelatedList">
          {others[0] && <RelatedCard item={others[0]} />}
          {others[1] && <RelatedCard item={others[1]} />}
          {others[2] && <RelatedCard item={others[2]} />}
          {others[3] && <RelatedCard item={others[3]} />}
        </div>
      </div>
    </div>
  );
}