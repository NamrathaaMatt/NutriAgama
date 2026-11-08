export type Review = {
  name: string;
  rating: number;
  comment: string;
  title?: string;
  date?: string;
};

export type Variant = {
  id: string;
  label: string;
  price: number;
  mrp: number;
  inStock: boolean;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  // price, mrp and netWeight show the smallest size. inStock is true if any size is in stock.
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  image: string;
  hoverImage?: string;
  backImage?: string;
  description: string;
  ingredients: string;
  netWeight: string;
  badges: string[];
  howToUse: string;
  long_description: string;
  reviews: Review[];
  variants: Variant[];
};