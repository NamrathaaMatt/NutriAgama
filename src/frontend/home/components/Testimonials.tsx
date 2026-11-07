"use client";

import { useState } from "react";
import styles from "../styles/testimonials.module.css";

type ProductKey = "Kashaya" | "Menthe Mudde" | "Moringa" | "Protein Powder";

type Testimonial = {
  quote: string;
  name: string;
  location: string;
  initial: string;
};

const testimonialsByProduct: Record<ProductKey, Testimonial[]> = {
  Kashaya: [
    {
      quote:
        "The Kashaya has become part of my evening routine. It tastes like something my grandmother would have made.",
      name: "Ananya R.",
      location: "Mysuru",
      initial: "A",
    },
    {
      quote:
        "I love that it is simple, natural and something the whole family enjoys. No artificial aftertaste.",
      name: "Sneha M.",
      location: "Bengaluru",
      initial: "S",
    },
    {
      quote:
        "We were looking for a healthier alternative and this has been perfect. It is now a regular in our household.",
      name: "Priya K.",
      location: "Chennai",
      initial: "P",
    },
    {
      quote:
        "My kids actually ask for it, which never happens with healthy food. Really happy with the quality.",
      name: "Rohit S.",
      location: "Pune",
      initial: "R",
    },
    {
      quote:
        "It feels like a traditional drink made for everyday life. Simple, comforting and easy to make.",
      name: "Meera V.",
      location: "Mangaluru",
      initial: "M",
    },
  ],

  "Menthe Mudde": [
    {
      quote:
        "It reminds me of the food we grew up eating, but it fits so easily into our routine today.",
      name: "Lakshmi P.",
      location: "Mysuru",
      initial: "L",
    },
    {
      quote:
        "The flavour is so familiar and comforting. It has quickly become one of our family favourites.",
      name: "Kavya R.",
      location: "Bengaluru",
      initial: "K",
    },
    {
      quote:
        "I wanted something traditional that would also be convenient. This has been exactly that.",
      name: "Arjun M.",
      location: "Chennai",
      initial: "A",
    },
    {
      quote:
        "Simple ingredients, familiar taste and something everyone at home can enjoy.",
      name: "Deepa S.",
      location: "Mangaluru",
      initial: "D",
    },
    {
      quote:
        "It brings a little bit of home into our everyday meals. We genuinely enjoy having it around.",
      name: "Nandini K.",
      location: "Pune",
      initial: "N",
    },
  ],

  Moringa: [
    {
      quote:
        "Adding moringa to our routine has been surprisingly easy. I love how simple it is to use.",
      name: "Shreya M.",
      location: "Bengaluru",
      initial: "S",
    },
    {
      quote:
        "I was looking for a straightforward way to include traditional ingredients in everyday food.",
      name: "Rahul P.",
      location: "Mysuru",
      initial: "R",
    },
    {
      quote:
        "The quality is what stood out to me. It feels thoughtfully made rather than overly processed.",
      name: "Aditi K.",
      location: "Chennai",
      initial: "A",
    },
    {
      quote:
        "It has become one of those small everyday things that is easy to keep up with.",
      name: "Vivek R.",
      location: "Pune",
      initial: "V",
    },
    {
      quote:
        "I like knowing exactly what I am adding to my food. Simple, natural and practical.",
      name: "Megha S.",
      location: "Mangaluru",
      initial: "M",
    },
  ],

  "Protein Powder": [
    {
      quote:
        "Finally a protein option that feels simple and familiar enough for the whole family.",
      name: "Ishita R.",
      location: "Bengaluru",
      initial: "I",
    },
    {
      quote:
        "I wanted something easy to add to my day without making my routine complicated.",
      name: "Varun K.",
      location: "Mysuru",
      initial: "V",
    },
    {
      quote:
        "The taste is much more approachable than other products we have tried before.",
      name: "Pooja M.",
      location: "Chennai",
      initial: "P",
    },
    {
      quote:
        "It fits naturally into our mornings and the quality has been consistently good.",
      name: "Rohan S.",
      location: "Pune",
      initial: "R",
    },
    {
      quote:
        "A practical everyday option that does not feel like another complicated health product.",
      name: "Meera V.",
      location: "Mangaluru",
      initial: "M",
    },
  ],
};

const products: ProductKey[] = [
  "Kashaya",
  "Menthe Mudde",
  "Moringa",
  "Protein Powder",
];

export function Testimonials() {
  const [activeProduct, setActiveProduct] = useState<ProductKey>("Kashaya");
  const [paused, setPaused] = useState(false);

  const testimonials = testimonialsByProduct[activeProduct];

  /*
   * Duplicate cards so the CSS marquee loops seamlessly.
   * Two copies is enough — the animation translates exactly
   * one copy width, then resets to zero.
   */
  const cards = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.background} />

      <div className={styles.content}>
        {/* HEADER */}
        <header className={styles.header}>
          <span className={styles.headerLine} style={{ backgroundColor: "#eadbce" }} />

          <p className={styles.eyebrow} style={{ color: "#eadbce" }}>
            WHAT THEY&apos;RE SAYING
          </p>

          <h2 className={styles.title} style={{ color: "#f1c7a3" }}>
            <span style={{ color: "#f8d4b5" }}>Made for everyday life.</span>
            <strong style={{ color: "#f9d0ad" }}>Loved by families.</strong>
          </h2>
        </header>

        {/* PRODUCT SWITCHER */}
        <nav className={styles.productTabs} aria-label="Testimonials by product">
          {products.map((product) => {
            const isActive = product === activeProduct;
            return (
              <button
                key={product}
                type="button"
                className={`${styles.productTab} ${isActive ? styles.productTabActive : ""}`}
                onClick={() => setActiveProduct(product)}
                aria-pressed={isActive}
              >
                {product}
              </button>
            );
          })}
        </nav>

        <span className={styles.tabsUnderline} />

        {/* MARQUEE CAROUSEL */}
        <div
          className={styles.carouselViewport}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/*
           * key={activeProduct} forces a remount when the product changes,
           * which restarts the CSS animation cleanly from position 0.
           */}
          <div
            key={activeProduct}
            className={styles.track}
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {cards.map((testimonial, index) => (
              <article
                className={styles.card}
                key={`${activeProduct}-${index}`}
                aria-hidden={index >= testimonials.length}
              >
                <div className={styles.cardTop}>
                  <span className={styles.stars}>★★★★★</span>
                  <span className={styles.verified}>✓ VERIFIED</span>
                </div>

                <p className={styles.quote}>
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <span className={styles.cardLine} />

                <div className={styles.author}>
                  <div className={styles.avatar}>{testimonial.initial}</div>
                  <div className={styles.authorInfo}>
                    <p className={styles.name}>{testimonial.name}</p>
                    <p className={styles.location}>
                      Verified customer · {testimonial.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
