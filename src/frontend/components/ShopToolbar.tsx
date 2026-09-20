"use client";

import { useState } from "react";
import { SortKey, SORT_OPTIONS } from "@/frontend/hooks/useProductSort";

type Props = {
  count: number;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
};

function SlidersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" fill="currentColor" />
      <circle cx="16" cy="12" r="2" fill="currentColor" />
      <circle cx="11" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

export default function ShopToolbar({
  count,
  sort,
  onSortChange,
  category,
  onCategoryChange,
  categories,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="toolbar">
      <span className="resultCount">
        Showing 1–{count} of {count} products
      </span>
      <div className="toolbarActions">
        <div className="filterWrap">
          <button
            className="filterBtn"
            type="button"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((o) => !o)}
          >
            Filter{category !== "all" ? `: ${category}` : ""}
            <SlidersIcon />
          </button>

          {filterOpen && (
            <div className="filterPanel">
              <button
                className={`filterOption ${category === "all" ? "filterOptionActive" : ""}`}
                type="button"
                onClick={() => {
                  onCategoryChange("all");
                  setFilterOpen(false);
                }}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  className={`filterOption ${category === c ? "filterOptionActive" : ""}`}
                  type="button"
                  onClick={() => {
                    onCategoryChange(c);
                    setFilterOpen(false);
                  }}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="toolbarDivider" aria-hidden="true" />

        <select
          className="sortSelect"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              Sort by: {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}