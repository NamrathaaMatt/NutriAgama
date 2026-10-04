"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/backend/supabase/client";
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
  const router = useRouter();
  const supabase = createClient();

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
        return;
      }

      setSlugs((current) => current.filter((s) => s !== slug));
      showToast("Item removed from wishlist");
    } else {
      const { error } = await supabase.from("wishlist_items").insert({
        user_id: user.id,
        product_id: product.id,
      });

      if (error) {
        console.error("Add wishlist error:", error.message);
        return;
      }

      setSlugs((current) => [...current, slug]);
      showToast("Item added to wishlist!");
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