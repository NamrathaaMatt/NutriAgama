"use client";

import { useMemo, useRef } from "react";
import "@/frontend/styles/shop.css";
import { mockProducts } from "./mock-products";
import { useProductSort } from "@/frontend/hooks/useProductSort";
import { useCategoryFilter } from "@/frontend/hooks/useCategoryFilter";
import ShopHero from "./ShopHero";
import ShopToolbar from "./ShopToolbar";
import ProductGrid from "./ProductGrid";
import ShopFooter from "./ShopFooter";

export default function ShopPage() {
  const { filtered, category, setCategory } = useCategoryFilter(mockProducts);
  const { sorted, sort, setSort } = useProductSort(filtered);
  const productsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(mockProducts.map((p) => p.category))),
    []
  );

  const handleShopNow = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page">
      <ShopHero onShopNow={handleShopNow} />

      <div ref={productsRef}>
        <ShopToolbar
          count={sorted.length}
          sort={sort}
          onSortChange={setSort}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
        />
        <ProductGrid key={category} products={sorted} />
      </div>

      <ShopFooter />
    </div>
  );
}