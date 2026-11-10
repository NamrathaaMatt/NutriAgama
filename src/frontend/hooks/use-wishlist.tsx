"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/backend/supabase/client";
import { useToast } from "./use-toast";
import { useProducts } from "./use-products";

type WishlistEntry = {
  slug: string;
  variantId: string;
};

type WishlistContextType = {
  // One entry per saved size.
  items: WishlistEntry[];
  // One slug per saved size, so a product saved in two sizes appears twice.
  slugs: string[];
  loaded: boolean;
  // Without a variantId, these use the product's smallest size.
  isWishlisted: (slug: string, variantId?: string) => boolean;
  toggleWishlist: (slug: string, variantId?: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const UNIQUE_VIOLATION = "23505";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { showToast } = useToast();
  const { products } = useProducts();
  const router = useRouter();
  const supabase = createClient();

  // Sizes whose save is still running. Extra clicks on them are ignored.
  const pending = useRef<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    async function loadWishlist() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setItems([]);
          setLoaded(true);
        }
        return;
      }

      const { data, error } = await supabase
        .from("wishlist_items")
        .select("variant_id, products(slug)")
        .eq("user_id", user.id);

      if (!active) return;

      if (error) {
        console.error("Load wishlist error:", error.message);
        setLoaded(true);
        return;
      }

      const loaded: WishlistEntry[] = (data ?? [])
        .filter((row: any) => row.products?.slug && row.variant_id)
        .map((row: any) => ({ slug: row.products.slug, variantId: row.variant_id }));

      setItems(loaded);
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

  const defaultVariantId = (slug: string) =>
    products.find((p) => p.slug === slug)?.variants[0]?.id;

  const isWishlisted = (slug: string, variantId?: string) => {
    const id = variantId ?? defaultVariantId(slug);
    if (!id) return false;
    return items.some((i) => i.variantId === id);
  };

  const toggleWishlist = async (slug: string, variantIdArg?: string) => {
    const variantId = variantIdArg ?? defaultVariantId(slug);

    if (!variantId) {
      showToast("Something went wrong. Please try again.", "error");
      return;
    }

    if (pending.current.has(variantId)) return;
    pending.current.add(variantId);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const isCurrentlyIn = items.some((i) => i.variantId === variantId);

      if (isCurrentlyIn) {
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("variant_id", variantId);

        if (error) {
          console.error("Remove wishlist error:", error.message);
          showToast("Could not update your wishlist. Please try again.", "error");
          return;
        }

        setItems((current) => current.filter((i) => i.variantId !== variantId));
        showToast("Item removed from wishlist");
        return;
      }

      // product_id is filled in by the database trigger from the size.
      const { error } = await supabase.from("wishlist_items").insert({
        user_id: user.id,
        variant_id: variantId,
      });

      if (error) {
        if (error.code === UNIQUE_VIOLATION) {
          // Already saved in the database, so just make the screen agree.
          setItems((current) =>
            current.some((i) => i.variantId === variantId)
              ? current
              : [...current, { slug, variantId }]
          );
          return;
        }
        console.error("Add wishlist error:", error.message);
        showToast("Could not update your wishlist. Please try again.", "error");
        return;
      }

      setItems((current) =>
        current.some((i) => i.variantId === variantId)
          ? current
          : [...current, { slug, variantId }]
      );
      showToast("Item added to wishlist!");
    } finally {
      pending.current.delete(variantId);
    }
  };

  const slugs = items.map((i) => i.slug);

  return (
    <WishlistContext.Provider
      value={{ items, slugs, loaded, isWishlisted, toggleWishlist }}
    >
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