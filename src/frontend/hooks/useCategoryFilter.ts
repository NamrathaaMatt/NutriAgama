import { useMemo, useState } from "react";
import { Product } from "@/types/product";

export function useCategoryFilter(products: Product[]) {
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return { filtered, category, setCategory };
}