"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/backend/supabase/client";
import { useToast } from "./use-toast";
import { useProducts } from "./use-products";

type CartItem = {
  slug: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  loaded: boolean;
  totalItems: number;
  addToCart: (slug: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (slug: string, quantity: number) => Promise<void>;
  removeFromCart: (slug: string) => Promise<void>;
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
  const { refreshProducts } = useProducts();
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

  // Shows the right toast for a failed write. On a stock error it also
  // reloads the products so "In stock" tags match the database.
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

  // Returns the signed-in user and the product id for a slug, or null.
  const getUserAndProductId = async (slug: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, productId: null };

    const { data: product, error } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    if (error || !product) {
      console.error("Product lookup failed:", error?.message);
      return { user, productId: null };
    }

    return { user, productId: product.id };
  };

  const addToCart = async (slug: string, quantity: number = 1): Promise<boolean> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return false;
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, in_stock")
      .eq("slug", slug)
      .single();

    if (productError || !product) {
      console.error("Product lookup failed:", productError?.message);
      showToast("Something went wrong. Please try again.", "error");
      return false;
    }

    if (product.in_stock === false) {
      showToast(OUT_OF_STOCK_MESSAGE, "error");
      await refreshProducts();
      return false;
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
        await handleWriteError(
          "Update cart error",
          error.message,
          "Could not add to cart. Please try again."
        );
        return false;
      }
    } else {
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
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
      const index = next.findIndex((i) => i.slug === slug);
      if (index === -1) {
        next.push({ slug, quantity });
      } else {
        next[index] = { slug, quantity: next[index].quantity + quantity };
      }
      return next;
    });
    showToast("Item added to cart!");
    return true;
  };

  const updateQuantity = async (slug: string, quantity: number) => {
    const { user, productId } = await getUserAndProductId(slug);

    if (!user) {
      router.push("/login");
      return;
    }
    if (!productId) return;

    if (quantity < 1) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        console.error("Remove cart item error:", error.message);
        showToast("Could not update your cart. Please try again.", "error");
        return;
      }

      setItems((current) => current.filter((i) => i.slug !== slug));
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      await handleWriteError(
        "Update quantity error",
        error.message,
        "Could not update your cart. Please try again."
      );
      return;
    }

    setItems((current) => {
      const next = [...current];
      const index = next.findIndex((i) => i.slug === slug);
      if (index !== -1) next[index] = { slug, quantity };
      return next;
    });
  };

  const removeFromCart = async (slug: string) => {
    const { user, productId } = await getUserAndProductId(slug);

    if (!user || !productId) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Remove from cart error:", error.message);
      showToast("Could not remove the item. Please try again.", "error");
      return;
    }

    setItems((current) => current.filter((i) => i.slug !== slug));
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