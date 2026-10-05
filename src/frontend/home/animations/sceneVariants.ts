import type { Variants } from "framer-motion";
import { HOME_ANIMATION } from "./animationConstants";

/* =========================================================
   BACKGROUND
   ========================================================= */

export const backgroundVariants: Variants = {
  initial: {
    opacity: 0,
    scale: HOME_ANIMATION.backgroundScale,
    rotate: HOME_ANIMATION.backgroundRotation,
  },

  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,

    transition: {
      duration: HOME_ANIMATION.sceneDuration,
      ease: HOME_ANIMATION.ease,
    },
  },

  exit: {
    opacity: 0,
    scale: HOME_ANIMATION.backgroundScale,
    rotate: -HOME_ANIMATION.backgroundRotation,

    transition: {
      duration: HOME_ANIMATION.sceneDuration,
      ease: HOME_ANIMATION.ease,
    },
  },
};


/* =========================================================
   PRODUCT — SUSHI REVOLVER MOTION
   ========================================================= */

export const productVariants: Variants = {
  /*
   * New product enters from the upper-right,
   * follows a curved path, and settles into
   * the exact existing product position.
   *
   * This is intentionally NOT a 360° orbit.
   */

  initial: {
    opacity: 0,

    x: 420,
    y: -260,

    rotate: 90,
    scale: 0.92,
  },

  animate: {
    opacity: 0.85,

    x: [420, 300, 150, 0],
    y: [-260, -180, -70, 0],

    rotate: [90, 60, 25, 0],

    scale: [0.92, 0.95, 0.98, 1],

    transition: {
      duration: 1.15,
      delay: HOME_ANIMATION.layerStagger,

      ease: [0.22, 1, 0.36, 1],

      times: [0, 0.35, 0.7, 1],
    },
  },

  /*
   * Old product exits toward the lower-left,
   * following the opposite half of the motion.
   */

  exit: {
    opacity: 0,

    x: [0, -150, -300, -420],
    y: [0, 70, 180, 260],

    rotate: [0, -25, -60, -90],

    scale: [1, 0.98, 0.95, 0.92],

    transition: {
      duration: 1.15,

      ease: [0.22, 1, 0.36, 1],

      times: [0, 0.3, 0.65, 1],
    },
  },
};


/* =========================================================
   QUOTE
   ========================================================= */

export const quoteVariants: Variants = {
  initial: {
    opacity: 0,
    x: HOME_ANIMATION.quoteDistance,
    rotate: HOME_ANIMATION.quoteRotation,
  },

  animate: {
    opacity: 1,
    x: 0,
    rotate: 0,

    transition: {
      duration: HOME_ANIMATION.sceneDuration,
      delay: HOME_ANIMATION.layerStagger * 2,
      ease: HOME_ANIMATION.ease,
    },
  },

  exit: {
    opacity: 0,
    x: -HOME_ANIMATION.quoteDistance,
    rotate: -HOME_ANIMATION.quoteRotation,

    transition: {
      duration: HOME_ANIMATION.sceneDuration,
      ease: HOME_ANIMATION.ease,
    },
  },
};