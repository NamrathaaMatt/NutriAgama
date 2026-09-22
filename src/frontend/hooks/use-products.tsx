"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/backend/supabase/client";
import { Product, Review } from "@/types/product";

type ReviewRow = {
  name: string;
  rating: number;
  title: string | null;
  comment: string;
  review_date: string | null;
};

type ProductRow = {
  slug: string;
  name: string;
  tagline: string | null;
  category: string | null;
  description: string | null;
  long_description: string | null;
  price: number;
  mrp: number | null;
  net_weight: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  image: string;
  hover_image: string | null;
  badges: string[] | null;
  rating: number | null;
  review_count: number | null;
  reviews: ReviewRow[];
};

type ProductsContextType = {
  products: Product[];
  loaded: boolean;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

function toProduct(row: ProductRow): Product {
  const reviews: Review[] = [];
  for (let i = 0; i < row.reviews.length; i++) {
    const r = row.reviews[i];
    reviews.push({
      name: r.name,
      rating: Number(r.rating),
      comment: r.comment,
      title: r.title ?? undefined,
      date: r.review_date ?? undefined,
    });
  }

  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    category: row.category ?? "",
    description: row.description ?? "",
    long_description: row.long_description ?? "",
    price: Number(row.price),
    mrp: Number(row.mrp ?? row.price),
    netWeight: row.net_weight ?? "",
    ingredients: row.ingredients ?? "",
    howToUse: row.how_to_use ?? "",
    image: row.image,
    hoverImage: row.hover_image ?? undefined,
    badges: row.badges ?? [],
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    reviews,
  };
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, reviews(*)")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load products:", error.message);
      }

      if (data) {
        const list: Product[] = [];
        for (let i = 0; i < data.length; i++) {
          list.push(toProduct(data[i] as ProductRow));
        }
        setProducts(list);
      }

      setLoaded(true);
    };

    load();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loaded }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductsProvider");
  }
  return context;
}