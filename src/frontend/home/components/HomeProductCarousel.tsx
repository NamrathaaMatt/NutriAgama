"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

import styles from "../styles/home.module.css";

import circleImage from "../assets/carousel/white-circle.svg";
import arrowImage from "../assets/carousel/arrow.svg";

type HomeProductCarouselProps = {
  onNext: () => void;
  onPrevious?: () => void;
};

export default function HomeProductCarousel({
  onNext,
  onPrevious,
}: HomeProductCarouselProps) {
  const arrowRef = useRef<HTMLSpanElement | null>(null);

  const touchStartX = useRef<number | null>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const arrow = arrowRef.current;

    if (!arrow) {
      return;
    }

    /*
     * GSAP controls ONLY the arrow.
     * The circle never receives a transform.
     */
    gsap.set(arrow, {
      rotation: 0,
      transformOrigin: "50% 50%",
    });

    return () => {
      gsap.killTweensOf(arrow);
    };
  }, []);

  const rotate = useCallback((direction: "next" | "previous") => {
    const arrow = arrowRef.current;

    if (!arrow || isAnimating.current) {
      return;
    }

    isAnimating.current = true;

    /*
     * Negative = clockwise/counter-clockwise depending
     * on the orientation of your arrow SVG.
     *
     * This is the direction that matched the animation
     * you approved previously.
     */
    const amount = direction === "next" ? -360 : 360;

    gsap.to(arrow, {
      rotation: `+=${amount}`,
      duration: 2,
      ease: "power2.inOut",
      overwrite: true,

      onComplete: () => {
        isAnimating.current = false;
      },
    });

    if (direction === "next") {
      onNext();
    } else {
      onPrevious?.();
    }
  }, [onNext, onPrevious]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      rotate("next");
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [rotate]);

  const handleTouchStart = (
    event: React.TouchEvent<HTMLButtonElement>,
  ) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLButtonElement>,
  ) => {
    const startX = touchStartX.current;

    touchStartX.current = null;

    if (startX === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX;

    if (endX === undefined) {
      return;
    }

    const distance = endX - startX;

    /*
     * Ignore tiny accidental swipes.
     */
    if (Math.abs(distance) < 40) {
      return;
    }

    if (distance < 0) {
      rotate("next");
    } else {
      rotate("previous");
    }
  };

  return (
    <button
      type="button"
      className={styles.productCarouselButton}
      onClick={() => rotate("next")}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Change product"
    >
      {/* FIXED CIRCLE */}
      <Image
        className={styles.productCarouselCircle}
        src={circleImage}
        alt=""
        fill
        sizes="990px"
        priority
        draggable={false}
      />

      {/* ROTATING ARROW ONLY */}
      <span
        ref={arrowRef}
        className={styles.productCarouselArrow}
      >
        <Image
          className={styles.productCarouselArrowImage}
          src={arrowImage}
          alt=""
          fill
          sizes="990px"
          priority
          draggable={false}
        />
      </span>
    </button>
  );
}
