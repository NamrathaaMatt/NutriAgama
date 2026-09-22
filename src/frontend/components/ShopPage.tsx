"use client";

import { useMemo, useRef } from "react";
import "@/frontend/styles/shop.css";
import { useProducts } from "@/frontend/hooks/use-products";
import { useProductSort } from "@/frontend/hooks/useProductSort";
import { useCategoryFilter } from "@/frontend/hooks/useCategoryFilter";
import ShopHero from "./ShopHero";
import ShopToolbar from "./ShopToolbar";
import ProductGrid from "./ProductGrid";
import ShopFooter from "./ShopFooter";

export default function ShopPage() {
  const { products, loaded } = useProducts();
  const { filtered, category, setCategory } = useCategoryFilter(products);
  const { sorted, sort, setSort } = useProductSort(filtered);
  const productsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const handleShopNow = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!loaded) {
    return <div className="page" />;
  }

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