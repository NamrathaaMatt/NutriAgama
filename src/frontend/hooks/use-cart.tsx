"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/backend/supabase/client";
import { useToast } from "./use-toast";
import { useProducts } from "./use-products";

type CartItem = {
  slug: string;
  variantId: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  loaded: boolean;
  totalItems: number;
  // Without a variantId, the smallest in-stock size is added.
  addToCart: (slug: string, quantity?: number, variantId?: string) => Promise<boolean>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

const OUT_OF_STOCK_MESSAGE = "Sorry, this product is out of stock";

function isStockError(message: string) {
  return message.includes("out of stock");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { showToast } = useToast();
  const { products, refreshProducts } = useProducts();
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
        .select("quantity, variant_id, products(slug)")
        .eq("user_id", user.id);

      if (!active) return;

      if (error) {
        console.error("Load cart error:", error.message);
        setLoaded(true);
        return;
      }

      const loadedItems = (data ?? [])
        .filter((row: any) => row.products?.slug && row.variant_id)
        .map((row: any) => ({
          slug: row.products.slug,
          variantId: row.variant_id,
          quantity: row.quantity,
        }));

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

  // Shows the right toast for a failed write. On a stock error it also
  // reloads the products so stock tags match the database.
  const handleWriteError = async (context: string, message: string, fallback: string) => {
    if (isStockError(message)) {
      // Expected situation, so warn instead of error (keeps the dev overlay quiet).
      console.warn(`${context}:`, message);
      showToast(OUT_OF_STOCK_MESSAGE, "error");
      await refreshProducts();
      return;
    }
    console.error(`${context}:`, message);
    showToast(fallback, "error");
  };

  const addToCart = async (
    slug: string,
    quantity: number = 1,
    variantId?: string
  ): Promise<boolean> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return false;
    }

    const product = products.find((p) => p.slug === slug);
    const variant = variantId
      ? product?.variants.find((v) => v.id === variantId)
      : (product?.variants.find((v) => v.inStock) ?? product?.variants[0]);

    if (!product || !variant) {
      showToast("Something went wrong. Please try again.", "error");
      return false;
    }

    if (!variant.inStock) {
      showToast(OUT_OF_STOCK_MESSAGE, "error");
      await refreshProducts();
      return false;
    }

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("variant_id", variant.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);

      if (error) {
        await handleWriteError(
          "Update cart error",
          error.message,
          "Could not add to cart. Please try again."
        );
        return false;
      }
    } else {
      // product_id is filled in by the database trigger from the variant.
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        variant_id: variant.id,
        quantity,
      });

      if (error) {
        await handleWriteError(
          "Insert cart error",
          error.message,
          "Could not add to cart. Please try again."
        );
        return false;
      }
    }

    setItems((current) => {
      const next = [...current];
      const index = next.findIndex((i) => i.variantId === variant.id);
      if (index === -1) {
        next.push({ slug, variantId: variant.id, quantity });
      } else {
        next[index] = { ...next[index], quantity: next[index].quantity + quantity };
      }
      return next;
    });
    showToast("Item added to cart!");
    return true;
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (quantity < 1) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("variant_id", variantId);

      if (error) {
        console.error("Remove cart item error:", error.message);
        showToast("Could not update your cart. Please try again.", "error");
        return;
      }

      setItems((current) => current.filter((i) => i.variantId !== variantId));
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("variant_id", variantId);

    if (error) {
      await handleWriteError(
        "Update quantity error",
        error.message,
        "Could not update your cart. Please try again."
      );
      return;
    }

    setItems((current) =>
      current.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = async (variantId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("variant_id", variantId);

    if (error) {
      console.error("Remove from cart error:", error.message);
      showToast("Could not remove the item. Please try again.", "error");
      return;
    }

    setItems((current) => current.filter((i) => i.variantId !== variantId));
  };

  const clearCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id);

    if (error) {
      console.error("Clear cart error:", error.message);
      showToast("Could not clear your cart. Please try again.", "error");
      return;
    }

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