"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

import { homeSlides, type HomeSlide } from "../data/homeSlides";
import styles from "../styles/featured.module.css";

/* ─── Timing constant ────────────────────────────────────────────────────────
   Must be ≥ the Hero product enter animation duration (1100 ms).
   We add a 250 ms buffer so the bg crossfade begins only after the
   product has visibly reached its final position.
   ──────────────────────────────────────────────────────────────────────────── */
const HERO_SETTLE_DELAY_MS = 1350;

/* =========================================================
   BACKGROUND CROSSFADE  (GSAP — same pattern as Hero)
   ========================================================= */

function FeaturedBackground({ slide }: { slide: HomeSlide }) {
  const [visibleSlide, setVisibleSlide] = useState(slide);
  const [incomingSlide, setIncomingSlide] = useState<HomeSlide | null>(null);
  const hasInitialized = useRef(false);
  const incomingRef = useRef<HTMLDivElement>(null);

  // Queue an incoming slide whenever the target changes after first render
  useLayoutEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
    setIncomingSlide(slide);
  }, [slide]);

  // Fade the incoming background in with GSAP
  useLayoutEffect(() => {
    const el = incomingRef.current;
    if (!el || !incomingSlide) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1.0,
          ease: "power2.inOut",
          onComplete: () => {
            setVisibleSlide(incomingSlide);
            setIncomingSlide(null);
          },
        }
      );
    }, incomingRef);

    return () => ctx.revert();
  }, [incomingSlide]);

  return (
    <>
      {/* Base (currently visible) background */}
      <div className={styles.featuredBgBase}>
        <Image
          src={visibleSlide.background2}
          alt=""
          fill
          sizes="100vw"
          className={styles.featuredBgImg}
        />
      </div>

      {/* Incoming background — fades over the base */}
      {incomingSlide && (
        <div ref={incomingRef} className={styles.featuredBgIncoming}>
          <Image
            src={incomingSlide.background2}
            alt=""
            fill
            sizes="100vw"
            className={styles.featuredBgImg}
          />
        </div>
      )}
    </>
  );
}

/* =========================================================
   SECTION 2 — FEATURED PRODUCTS
   ========================================================= */

type FeaturedSectionProps = {
  /** The slide currently active in the Hero (may still be animating in). */
  currentSlide: HomeSlide;
};

export default function FeaturedSection({ currentSlide }: FeaturedSectionProps) {
  // What's shown as the large product + info on the right
  const [featuredSlide, setFeaturedSlide] = useState(currentSlide);
  // What background is currently rendered
  const [bgSlide, setBgSlide] = useState(currentSlide);

  const bgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * When the hero slide changes, wait HERO_SETTLE_DELAY_MS before updating
   * Section 2. This guarantees the bg crossfade never begins while the
   * hero product rotation is still in progress.
   */
  useEffect(() => {
    // Clear any pending timer from a previous rapid slide change
    if (bgTimerRef.current !== null) clearTimeout(bgTimerRef.current);

    bgTimerRef.current = setTimeout(() => {
      setFeaturedSlide(currentSlide);
      setBgSlide(currentSlide);
      bgTimerRef.current = null;
    }, HERO_SETTLE_DELAY_MS);

    return () => {
      if (bgTimerRef.current !== null) {
        clearTimeout(bgTimerRef.current);
        bgTimerRef.current = null;
      }
    };
  }, [currentSlide]);

  // Manual card click — update immediately (user chose, don't wait for hero)
  const handleCardClick = useCallback(
    (slide: HomeSlide) => {
      if (slide.id === featuredSlide.id) return;
      if (bgTimerRef.current !== null) {
        clearTimeout(bgTimerRef.current);
        bgTimerRef.current = null;
      }
      setFeaturedSlide(slide);
      setBgSlide(slide);
    },
    [featuredSlide.id]
  );

  // The three other products (not currently featured)
  const otherSlides = homeSlides.filter((s) => s.id !== featuredSlide.id);

  return (
    <section
      className={styles.featured}
      data-slide={featuredSlide.id}
      aria-label="Featured products"
    >
      {/* Background crossfade — starts only after hero settles */}
      <FeaturedBackground slide={bgSlide} />

      {/* ── "ROOTED IN WELLNESS" label ─────────────── */}
      <p className={styles.featuredLabel}>ROOTED IN WELLNESS</p>

      <div className={styles.featuredContent}>
        {/* ─── LEFT: large product image (clickable like small cards) ─── */}
        <div className={styles.featuredLeft}>
          <Link
            href={`/shop/${featuredSlide.productSlug}`}
            className={styles.featuredLargeLink}
            aria-label={`View ${featuredSlide.name}`}
          >
            <div className={styles.featuredLargeWrap}>
              <Image
                key={featuredSlide.id}
                src={featuredSlide.productThumb}
                alt={featuredSlide.productAlt}
                width={featuredSlide.product.width}
                height={featuredSlide.product.height}
                className={styles.featuredLargeImg}
                priority
              />
              <Image
                key={`${featuredSlide.id}-hover`}
                src={featuredSlide.product}
                alt={featuredSlide.productAlt}
                width={featuredSlide.product.width}
                height={featuredSlide.product.height}
                className={styles.featuredLargeImgHover}
                priority
              />
            </div>
          </Link>
        </div>

        {/* ─── RIGHT: info + small cards ──────────────── */}
        <div className={styles.featuredRight} data-slide={featuredSlide.id}>
          <div className={styles.featuredInfo}>
            <h2 className={styles.featuredName}>{featuredSlide.name}</h2>
            <p className={styles.featuredTagline}>{featuredSlide.tagline}</p>
            <p className={styles.featuredDescription}>{featuredSlide.description}</p>
            <p className={styles.featuredBenefits}>{featuredSlide.benefits}</p>

            <div className={styles.featuredMeta}>
              <span className={styles.featuredWeight}>{featuredSlide.weight}</span>
              <span className={styles.featuredPrice}>₹{featuredSlide.price}</span>
            </div>
          </div>

          <Link
            href={`/shop/${featuredSlide.productSlug}`}
            className={styles.featuredCta}
          >
            Shop Now →
          </Link>

          {/* Small product cards — pushed to bottom */}
          <div className={styles.featuredCards} role="list">
            {otherSlides.map((slide) => (
              <button
                key={slide.id}
                type="button"
                role="listitem"
                aria-label={`Feature ${slide.name}`}
                className={`${styles.featuredCard} ${
                  slide.id === featuredSlide.id ? styles.featuredCardActive : ""
                }`}
                onClick={() => handleCardClick(slide)}
              >
                <div className={styles.featuredCardImgWrap}>
                  <Image
                    src={slide.productThumb}
                    alt={slide.name}
                    fill
                    sizes="140px"
                    className={styles.featuredCardThumb}
                  />
                  <Image
                    src={slide.product}
                    alt={slide.name}
                    fill
                    sizes="140px"
                    className={styles.featuredCardHover}
                  />
                </div>
                <span className={styles.featuredCardLabel}>{slide.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
