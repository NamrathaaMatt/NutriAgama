"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createClient } from "@/backend/supabase/client";
import { Product, Review, Variant } from "@/types/product";

type ReviewRow = {
  name: string;
  rating: number;
  title: string | null;
  comment: string;
  review_date: string | null;
};

type VariantRow = {
  id: string;
  label: string;
  price: number;
  mrp: number | null;
  in_stock: boolean | null;
  sort_order: number | null;
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
  back_image: string | null;
  badges: string[] | null;
  rating: number | null;
  review_count: number | null;
  in_stock: boolean | null;
  reviews: ReviewRow[];
  product_variants: VariantRow[] | null;
};

type ProductsContextType = {
  products: Product[];
  loaded: boolean;
  refreshProducts: () => Promise<void>;
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

  const variantRows = [...(row.product_variants ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const variants: Variant[] = variantRows.map((v) => ({
    id: v.id,
    label: v.label,
    price: Number(v.price),
    mrp: Number(v.mrp ?? v.price),
    inStock: v.in_stock ?? true,
  }));

  // The smallest size is shown on cards. With no variants, fall back to the product row.
  const first = variants[0];

  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    category: row.category ?? "",
    description: row.description ?? "",
    long_description: row.long_description ?? "",
    price: first ? first.price : Number(row.price),
    mrp: first ? first.mrp : Number(row.mrp ?? row.price),
    netWeight: first ? first.label : row.net_weight ?? "",
    ingredients: row.ingredients ?? "",
    howToUse: row.how_to_use ?? "",
    image: row.image,
    hoverImage: row.hover_image ?? undefined,
    backImage: row.back_image ?? undefined,
    badges: row.badges ?? [],
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    inStock: variants.length > 0 ? variants.some((v) => v.inStock) : row.in_stock ?? true,
    reviews,
    variants,
  };
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Reloads products from Supabase. It never sets `loaded` back to false,
  // so pages don't flash blank while refreshing.
  const refreshProducts = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, reviews(*), product_variants(*)")
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
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return (
    <ProductsContext.Provider value={{ products, loaded, refreshProducts }}>
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