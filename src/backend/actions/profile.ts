"use server";

import { createClient } from "@/backend/supabase/server";

export type ActionResult = {
  error: string | null;
};

export async function saveWellnessPreferences(
  goals: string[],
  productInterests: string[]
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to save preferences." };
  }

  const { error } = await supabase
    .from("wellness_preferences")
    .update({
      goals,
      product_interests: productInterests,
    })
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}