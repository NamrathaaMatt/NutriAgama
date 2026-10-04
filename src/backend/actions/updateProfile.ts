"use server";

import { createClient } from "@/backend/supabase/server";

export type ActionResult = {
  error: string | null;
};

export async function updateProfile(input: {
  fullName?: string;
  phone?: string;
}): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your session expired. Log in again." };
  }

  if (input.fullName !== undefined && input.fullName.trim().length < 2) {
    return { error: "Enter your full name." };
  }

  if (input.phone && !/^\+?[0-9\s-]{10,15}$/.test(input.phone)) {
    return { error: "Enter a valid phone number." };
  }

  // Same place signUp() stores these values (user_metadata)
  const data: Record<string, string> = {};
  if (input.fullName !== undefined) data.full_name = input.fullName.trim();
  if (input.phone !== undefined) data.phone = input.phone.trim();

  const { error } = await supabase.auth.updateUser({ data });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}