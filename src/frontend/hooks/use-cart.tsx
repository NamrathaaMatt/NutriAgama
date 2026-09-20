"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  const addToCart = (slug: string, quantity: number = 1) => {
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

  const updateQuantity = (slug: string, quantity: number) => {
    setItems((current) => {
      if (quantity < 1) return current.filter((i) => i.slug !== slug);
      const next = [...current];
      const index = next.findIndex((i) => i.slug === slug);
      if (index !== -1) next[index] = { slug, quantity };
      return next;
    });
  };

  const removeFromCart = (slug: string) => {
    setItems((current) => current.filter((i) => i.slug !== slug));
  };

  const clearCart = () => setItems([]);

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