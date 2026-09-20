import { useMemo, useState } from "react";
import { Product } from "@/types/product";

export type SortKey = "best-selling" | "price-asc" | "price-desc" | "rating" | "name";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "best-selling", label: "Best Selling" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
  { key: "name", label: "Name A–Z" },
];

export function useProductSort(products: Product[]) {
  const [sort, setSort] = useState<SortKey>("best-selling");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        // "Best Selling" — falls back to review count as a stand-in
        // until real sales data exists in the backend.
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [products, sort]);

  return { sorted, sort, setSort };
}