export const HOME_ANIMATION = {
  // Main scene transition
  sceneDuration: 0.85,

  // Carousel is handled by GSAP
  carouselDuration: 2.0,

  // Small stagger between visual layers
  layerStagger: 0.04,

  // Background movement
  backgroundScale: 1.035,
  backgroundRotation: 1.2,

  // Product movement
  productRotation: 2.5,
  productDistance: 35,

  // Quote movement
  quoteRotation: 1.5,
  quoteDistance: 20,

  // Main scene easing
  ease: [0.22, 1, 0.36, 1] as const,

  // Carousel easing
  carouselEase: "power2.inOut",
} as const;