"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/backend/supabase/client";
import { useToast } from "./use-toast";

type WishlistContextType = {
  slugs: string[];
  loaded: boolean;
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const UNIQUE_VIOLATION = "23505";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  // Slugs whose save is still running. Extra clicks on them are ignored.
  const pending = useRef<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    async function loadWishlist() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setSlugs([]);
          setLoaded(true);
        }
        return;
      }

      const { data, error } = await supabase
        .from("wishlist_items")
        .select("products(slug)")
        .eq("user_id", user.id);

      if (!active) return;

      if (error) {
        console.error("Load wishlist error:", error.message);
        setLoaded(true);
        return;
      }

      const loadedSlugs = (data ?? [])
        .map((row: any) => row.products?.slug)
        .filter(Boolean);

      setSlugs(loadedSlugs);
      setLoaded(true);
    }

    loadWishlist();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadWishlist();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isWishlisted = (slug: string) => slugs.includes(slug);

  const toggleWishlist = async (slug: string) => {
    if (pending.current.has(slug)) return;
    pending.current.add(slug);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .single();

      if (productError || !product) {
        console.error("Product lookup failed:", productError?.message);
        showToast("Something went wrong. Please try again.", "error");
        return;
      }

      const isCurrentlyIn = slugs.includes(slug);

      if (isCurrentlyIn) {
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);

        if (error) {
          console.error("Remove wishlist error:", error.message);
          showToast("Could not update your wishlist. Please try again.", "error");
          return;
        }

        setSlugs((current) => current.filter((s) => s !== slug));
        showToast("Item removed from wishlist");
        return;
      }

      const { error } = await supabase.from("wishlist_items").insert({
        user_id: user.id,
        product_id: product.id,
      });

      if (error) {
        if (error.code === UNIQUE_VIOLATION) {
          // Already saved in the database, so just make the screen agree.
          setSlugs((current) => (current.includes(slug) ? current : [...current, slug]));
          return;
        }
        console.error("Add wishlist error:", error.message);
        showToast("Could not update your wishlist. Please try again.", "error");
        return;
      }

      setSlugs((current) => (current.includes(slug) ? current : [...current, slug]));
      showToast("Item added to wishlist!");
    } finally {
      pending.current.delete(slug);
    }
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