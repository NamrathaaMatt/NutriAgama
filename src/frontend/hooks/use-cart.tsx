"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/backend/supabase/client";
import { useToast } from "./use-toast";

type CartItem = {
  slug: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  loaded: boolean;
  totalItems: number;
  addToCart: (slug: string, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let active = true;

    async function loadCart() {
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
        .from("cart_items")
        .select("quantity, products(slug)")
        .eq("user_id", user.id);

      if (!active) return;

      if (error) {
        console.error("Load cart error:", error.message);
        setLoaded(true);
        return;
      }

      const loadedItems = (data ?? [])
        .filter((row: any) => row.products?.slug)
        .map((row: any) => ({ slug: row.products.slug, quantity: row.quantity }));

      setItems(loadedItems);
      setLoaded(true);
    }

    loadCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadCart();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = async (slug: string, quantity: number = 1) => {
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

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);

      if (error) {
        console.error("Update cart error:", error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        quantity,
      });

      if (error) {
        console.error("Insert cart error:", error.message);
        return;
      }
    }

    setItems((current) => {
      const next = [...current];
      const index = next.findIndex((i) => i.slug === slug);
      if (index === -1) {
        next.push({ slug, quantity });
      } else {
        next[index] = { slug, quantity: next[index].quantity + quantity };
      }
      return next;
    });
    showToast("Item added to cart!");
  };

  const updateQuantity = async (slug: string, quantity: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!product) return;

    if (quantity < 1) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      setItems((current) => current.filter((i) => i.slug !== slug));
      return;
    }

    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", product.id);

    setItems((current) => {
      const next = [...current];
      const index = next.findIndex((i) => i.slug === slug);
      if (index !== -1) next[index] = { slug, quantity };
      return next;
    });
  };

  const removeFromCart = async (slug: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!product) return;

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", product.id);

    setItems((current) => current.filter((i) => i.slug !== slug));
  };

  const clearCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loaded, totalItems, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}