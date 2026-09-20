"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./use-toast";

type WishlistContextType = {
  slugs: string[];
  loaded: boolean;
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
const { showToast } = useToast();
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setSlugs(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("wishlist", JSON.stringify(slugs));
  }, [slugs, loaded]);

  const isWishlisted = (slug: string) => slugs.includes(slug);

  const toggleWishlist = (slug: string) => {
  const isCurrentlyIn = slugs.includes(slug);
  showToast(isCurrentlyIn ? "Item removed from wishlist" : "Item added to wishlist!");
  setSlugs((current) =>
    isCurrentlyIn ? current.filter((s) => s !== slug) : [...current, slug]
  );
};

  return (
    <WishlistContext.Provider value={{ slugs, loaded, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
}