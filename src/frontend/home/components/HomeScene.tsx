import { AnimatePresence, motion } from "framer-motion";

import styles from "../styles/scene.module.css";

import HomeBackground from "./HomeBackground";
import HomeProduct from "./HomeProduct";
import HomeQuote from "./HomeQuote";
import HomeShopButton from "./HomeShopButton";

import type { HomeSlide } from "../data/homeSlides";

type HomeSceneProps = {
  slide: HomeSlide;
  active?: boolean;
};

export default function HomeScene({
  slide,
  active = true,
}: HomeSceneProps) {
  return (
    <section
      className={`${styles.scene} ${
        active ? styles.active : ""
      }`}
      aria-label={`${slide.id} homepage scene`}
    >
      <HomeBackground
        background={slide.background}
      />

      <HomeQuote
        quote={slide.quote}
        alt={slide.quoteAlt}
      />

      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={slide.id}
          className={styles.productMotion}

          initial={{
            opacity: 0,
            x: 380,
            y: -240,
            rotate: 90,
            scale: 0.92,
          }}

          animate={{
            opacity: 0.85,

            x: [380, 300, 160, 0],
            y: [-240, -170, -70, 0],

            rotate: [90, 60, 25, 0],
            scale: [0.92, 0.95, 0.98, 1],
          }}

          exit={{
            opacity: 0,

            x: [0, -160, -300, -380],
            y: [0, 70, 170, 240],

            rotate: [0, -25, -60, -90],
            scale: [1, 0.98, 0.95, 0.92],
          }}

          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.35, 0.7, 1],
          }}
        >
          <HomeProduct
            product={slide.product}
            slideId={slide.productAlt}
            productSlug={slide.productSlug}
          />
        </motion.div>
      </AnimatePresence>

      <HomeShopButton />
    </section>
  );
}
