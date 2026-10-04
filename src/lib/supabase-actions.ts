"use client";

import { createClient } from "@/backend/supabase/client";

export async function addToCart(productSlug: string, quantity: number = 1) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { requiresLogin: true } as const;
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .single();

  if (productError || !product) {
    console.error("Product lookup failed:", productError?.message);
    return { error: true } as const;
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
      return { error: true } as const;
    }
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: product.id,
      quantity,
    });

    if (error) {
      console.error("Insert cart error:", error.message);
      return { error: true } as const;
    }
  }

  return { success: true } as const;
}

export async function toggleWishlist(productSlug: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { requiresLogin: true } as const;
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .single();

  if (productError || !product) {
    console.error("Product lookup failed:", productError?.message);
    return { error: true } as const;
  }

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", existing.id);

    if (error) {
      console.error("Remove from wishlist error:", error.message);
      return { error: true } as const;
    }

    return { success: true, wishlisted: false } as const;
  }

  const { error } = await supabase.from("wishlist_items").insert({
    user_id: user.id,
    product_id: product.id,
  });

  if (error) {
    console.error("Add to wishlist error:", error.message);
    return { error: true } as const;
  }

  return { success: true, wishlisted: true } as const;
}