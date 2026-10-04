import type { StaticImageData } from "next/image";
import type { NavbarIconTone } from "@/frontend/components/navbar/navigation";

import kashayaBackground from "../assets/backgrounds/kashaya.png";
import kashayaBg2 from "../assets/backgrounds/kashayabg2.png";
import mentheMuddeBackground from "../assets/backgrounds/menthe-mudde.png";
import mentheMuddeBg2 from "../assets/backgrounds/menthe-muddebg2.png";
import moringaBackground from "../assets/backgrounds/moringa.png";
import moringaBg2 from "../assets/backgrounds/moringabg2.png";
import proteinBackground from "../assets/backgrounds/protein.png";
import proteinBg2 from "../assets/backgrounds/proteinbg2.png";

import kashayaProduct from "../assets/products/kashayaproduct.png";
import kashayaThumb from "../assets/products/Kashayaproduct1.webp";
import mentheMuddeProduct from "../assets/products/menthe-muddeproduct.png";
import mentheMuddeThumb from "../assets/products/menthe-muddeproduct1.webp";
import moringaProduct from "../assets/products/moringaproduct.png";
import moringaThumb from "../assets/products/moringaproduct1.webp";
import proteinProduct from "../assets/products/proteinproduct.png";
import proteinThumb from "../assets/products/proteinproduct1.webp";

import kashayaQuote from "../assets/quotes/kashayaquote.png";
import mentheMuddeQuote from "../assets/quotes/menthe-muddequote.png";
import moringaQuote from "../assets/quotes/moringaquote.png";
import proteinQuote from "../assets/quotes/proteinquote.png";

export type HomeSlide = {
  id: "kashaya" | "menthe-mudde" | "moringa" | "protein";

  background: StaticImageData;
  /** Section 2 background — the *bg2 variant */
  background2: StaticImageData;
  product: StaticImageData;
  /** Small card thumbnail shown in Section 2 before hover */
  productThumb: StaticImageData;
  quote: StaticImageData;

  productAlt: string;
  quoteAlt: string;
  productSlug: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string;
  weight: string;
  price: number;
  navbarTextTone: NavbarIconTone;
  navbarIconTone: NavbarIconTone;
};

export const homeSlides: HomeSlide[] = [
  {
    id: "kashaya",
    background: kashayaBackground,
    background2: kashayaBg2,
    product: kashayaProduct,
    productThumb: kashayaThumb,
    quote: kashayaQuote,
    productAlt: "Kashaya product",
    quoteAlt: "Kashaya quote",
    productSlug: "kashaya",
    name: "Kashaya",
    tagline: "18 herbs. One comforting ritual.",
    description:
      "A slow-roasted blend of traditional herbs, crafted for a warm, grounding cup whenever you need it.",
    benefits: "Immunity · Digestion · Calm",
    weight: "200 g",
    price: 499,
    navbarTextTone: "black",
    navbarIconTone: "white",
  },

  {
    id: "menthe-mudde",
    background: mentheMuddeBackground,
    background2: mentheMuddeBg2,
    product: mentheMuddeProduct,
    productThumb: mentheMuddeThumb,
    quote: mentheMuddeQuote,
    productAlt: "Menthe Mudde product",
    quoteAlt: "Menthe Mudde quote",
    productSlug: "menthe-mudde",
    name: "Menthe Mudde Mix",
    tagline: "Traditional nourishment, made simple.",
    description:
      "A thoughtfully prepared blend inspired by a comforting traditional staple, made to bring wholesome nourishment into everyday meals.",
    benefits: "Nourishment · Tradition · Everyday Wellness",
    weight: "250 g",
    price: 299,
    navbarTextTone: "black",
    navbarIconTone: "black",
  },

  {
    id: "moringa",
    background: moringaBackground,
    background2: moringaBg2,
    product: moringaProduct,
    productThumb: moringaThumb,
    quote: moringaQuote,
    productAlt: "Moringa product",
    quoteAlt: "Moringa quote",
    productSlug: "moringa",
    name: "Moringa",
    tagline: "Green goodness, made effortless.",
    description:
      "A naturally nourishing moringa blend made for an easy addition to your everyday routine.",
    benefits: "Plant-Based · Nutrient-Rich · Everyday Wellness",
    weight: "100 g",
    price: 349,
    navbarTextTone: "white",
    navbarIconTone: "white",
  },

  {
    id: "protein",
    background: proteinBackground,
    background2: proteinBg2,
    product: proteinProduct,
    productThumb: proteinThumb,
    quote: proteinQuote,
    productAlt: "Protein product",
    quoteAlt: "Protein product quote",
    productSlug: "protein-powder",
    name: "Protein Powder",
    tagline: "Everyday protein, naturally made.",
    description:
      "A wholesome blend of nuts and seeds crafted to make adding protein to your daily routine simple and delicious.",
    benefits: "Protein-Rich · Nuts & Seeds · Daily Nourishment",
    weight: "500 g",
    price: 1299,
    navbarTextTone: "white",
    navbarIconTone: "black",
  },
];
