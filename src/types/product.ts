export type Review = {
  name: string;
  rating: number;
  comment: string;
  title?: string;
  date?: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  image: string;
  hoverImage?: string;
  description: string;
  ingredients: string;
  netWeight: string;
  badges: string[];
  howToUse: string;
  long_description: string;
  reviews: Review[];
};