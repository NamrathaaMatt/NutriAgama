"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";

import { homeSlides } from "./data/homeSlides";

import HomeBackground from "./components/HomeBackground";
import HomeProduct from "./components/HomeProduct";
import HomeQuote from "./components/HomeQuote";
import HomeShopButton from "./components/HomeShopButton";
import FeaturedSection from "./components/FeaturedSection";
import HealthBenefitsRedirect from "./components/HealthBenefitsRedirect";
import RecipeRedirect from "./components/RecipeRedirect";
import Testimonials from "./components/Testimonials";
import Navbar from "@/frontend/components/navbar/Navbar";

import styles from "./styles/home.module.css";

/* =========================================================
   PRODUCT ANIMATION
   ========================================================= */

const productVariants = {
  /*
   * The product moves along the carousel's curve rather than a straight
   * diagonal. These points are sampled from the same circular arc so the
   * movement stays smooth at every point in the transition.
   */
  initial: {
    opacity: 0.85,
    x: 140,
    y: -105,
    rotate: 0,
    scale: 0.76,
  },

  animate: {
    opacity: 0.85,
    x: [140, 105, 63, 23, 0],
    y: [-105, -93, -68, -32, 0],
    rotate: 0,
    scale: [0.76, 0.8, 0.87, 0.95, 1],
  },

  exit: {
    opacity: 0.85,
    x: [0, 44, 97, 149, 180],
    y: [0, 25, 68, 123, 170],
    rotate: 0,
    scale: [1, 0.95, 0.87, 0.8, 0.76],
  },
};

const productTransition = {
  duration: 1.1,
  ease: "linear" as const,
  times: [0, 0.2, 0.48, 0.78, 1],
};

const initialSlideIndex = homeSlides.findIndex(
  (slide) => slide.id === "protein",
);

/* =========================================================
   BACKGROUND FADE
   ========================================================= */

function BackgroundTransition({
  slide,
}: {
  slide: (typeof homeSlides)[number];
}) {
  const [visibleSlide, setVisibleSlide] = useState(slide);
  const [incomingSlide, setIncomingSlide] = useState<
    (typeof homeSlides)[number] | null
  >(null);
  const hasInitialized = useRef(false);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    setIncomingSlide(slide);
  }, [slide]);

  useLayoutEffect(() => {
    const element = backgroundRef.current;

    if (!element || !incomingSlide) {
      return;
    }

    const ctx = gsap.context(() => {
      /*
       * Reveal from top-right to bottom-left. The mask is set only
       * while this slide enters and is removed once the reveal ends.
       */
      gsap.set(element, {
        autoAlpha: 0,
        "--background-reveal": "0%",
        maskImage:
          "linear-gradient(to bottom left, #000 0%, #000 var(--background-reveal), transparent calc(var(--background-reveal) + 24%), transparent 100%)",
        webkitMaskImage:
          "linear-gradient(to bottom left, #000 0%, #000 var(--background-reveal), transparent calc(var(--background-reveal) + 24%), transparent 100%)",
        maskRepeat: "no-repeat",
        webkitMaskRepeat: "no-repeat",
      });

      gsap.timeline()
        .set(element, { autoAlpha: 1 }, productTransition.duration)
        .to(element, {
          "--background-reveal": "140%",
          duration: 1.15,
          ease: "power2.inOut",

          onComplete: () => {
            gsap.set(element, {
              clearProps:
                "--background-reveal,maskImage,webkitMaskImage,maskRepeat,webkitMaskRepeat,opacity,visibility",
            });
            setVisibleSlide(incomingSlide);
            setIncomingSlide(null);
          },
        }, productTransition.duration);
    }, backgroundRef);

    return () => {
      ctx.revert();
    };
  }, [incomingSlide]);

  return (
    <>
      <div className={styles.backgroundLayer}>
        <HomeBackground background={visibleSlide.background} />
        <HomeQuote quote={visibleSlide.quote} alt={visibleSlide.quoteAlt} />
      </div>
      {incomingSlide && (
        <div
          ref={backgroundRef}
          className={styles.backgroundMotion}
        >
          <HomeBackground background={incomingSlide.background} />
          <HomeQuote quote={incomingSlide.quote} alt={incomingSlide.quoteAlt} />
        </div>
      )}
    </>
  );
}

/* =========================================================
   HOME
   ========================================================= */

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(initialSlideIndex);

  const currentSlide = homeSlides[activeSlide];

  const goToNextSlide = useCallback(() => {
    setActiveSlide((currentIndex) =>
      (currentIndex + 1) % homeSlides.length,
    );
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(goToNextSlide, 8000);

    return () => window.clearInterval(intervalId);
  }, [goToNextSlide]);

  return (
    <main className={styles.home}>
      {/* Fixed navbar - colors still controlled by currentSlide */}
      <Navbar
        textTone={currentSlide.navbarTextTone}
        iconTone={currentSlide.navbarIconTone}
        fixed
      />

      {/* ===================================================
          SECTION 1 — HERO
          =================================================== */}
      <section className={styles.hero}>

        {/* =====================================================
            1. BACKGROUND
            ===================================================== */}

        <BackgroundTransition
          slide={currentSlide}
        />

        {/* =====================================================
            2. PRODUCT
            ===================================================== */}

        <AnimatePresence
          mode="wait"
          initial={false}
        >
          <motion.div
            key={currentSlide.id}
            className={styles.productMotion}
            variants={productVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={productTransition}
          >
            <HomeProduct
              product={currentSlide.product}
              slideId={currentSlide.id}
              productSlug={currentSlide.productSlug}
            />
          </motion.div>
        </AnimatePresence>

        {/* =====================================================
            3. ROTATING / SWIPING CAROUSEL
            ===================================================== */}

        {/* Carousel controls are temporarily hidden while autoplay remains active.
        <HomeCarousel
          onNext={goToNextSlide}
          onPrevious={goToPreviousSlide}
        /> */}

        {/* =====================================================
            4. SHOP BUTTON
            ===================================================== */}

        <HomeShopButton />

      </section>

      {/* ===================================================
          SECTION 2 — FEATURED PRODUCTS
          currentSlide is passed as-is. FeaturedSection applies
          its own delay so its bg crossfade starts only after
          the hero product animation finishes.
          =================================================== */}
      <FeaturedSection currentSlide={currentSlide} />
      <HealthBenefitsRedirect />
      <RecipeRedirect />
      <Testimonials />
    </main>
  );
}
