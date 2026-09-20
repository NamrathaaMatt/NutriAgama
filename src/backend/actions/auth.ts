"use server";

import { createClient } from "@/backend/supabase/server";
import { redirect } from "next/navigation";

export type AuthResult = {
  error: string | null;
};

// ------------------------------------------------------------
// SIGNUP
// ------------------------------------------------------------
export async function signUp(formData: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        phone: formData.phone,
      },
    },
  });

  if (error) {
    // Supabase returns this specific message when the email is already registered
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  return { error: null };
}

// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------
export async function logIn(formData: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return { error: "Incorrect email or password." };
    }
    return { error: error.message };
  }

  return { error: null };
}

// ------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------
export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ------------------------------------------------------------
// PASSWORD RESET — request email
// ------------------------------------------------------------
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

// ------------------------------------------------------------
// PASSWORD RESET — set new password (user already has a valid
// recovery session at this point, from clicking the email link)
// ------------------------------------------------------------
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}