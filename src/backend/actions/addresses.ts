"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/backend/supabase/server";

export type ActionResult = {
  error: string | null;
};

export type Address = {
  id: string;
  name: string;
  phone: string;
  address_line: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

export type AddressInput = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

async function getUserAndClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function addAddress(input: AddressInput): Promise<ActionResult> {
  const { supabase, user } = await getUserAndClient();
  if (!user) return { error: "Your session expired. Log in again." };

  const fullName = input.fullName.trim();
  const phone = input.phone.trim();
  const line1 = input.line1.trim();
  const line2 = input.line2.trim();
  const city = input.city.trim();
  const state = input.state.trim();
  const pincode = input.pincode.trim();

  if (fullName.length < 2) return { error: "Enter your full name." };
  if (!/^(\+91[\s-]?)?[6-9][0-9]{9}$/.test(phone))
    return { error: "Enter a valid 10-digit mobile number." };
  if (line1.length < 3) return { error: "Enter your address." };
  if (!city) return { error: "Enter your city." };
  if (!state) return { error: "Enter your state." };
  if (!/^[1-9][0-9]{5}$/.test(pincode))
    return { error: "Enter a valid 6-digit pincode." };

  const { count } = await supabase
    .from("addresses")
    .select("id", { count: "exact", head: true });

  // the first address is always the default
  const makeDefault = input.isDefault || (count ?? 0) === 0;

  if (makeDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    name: fullName,
    phone,
    address_line: line1,
    landmark: line2 || null,
    city,
    state,
    pincode,
    is_default: makeDefault,
  });

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/profile/addresses");
  return { error: null };
}

export async function setDefaultAddress(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserAndClient();
  if (!user) return { error: "Your session expired. Log in again." };

  await supabase
    .from("addresses")
    .update({ is_default: false, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile/addresses");
  return { error: null };
}

export async function deleteAddress(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserAndClient();
  if (!user) return { error: "Your session expired. Log in again." };

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  // if the default one was deleted, promote the newest remaining address
  const { data: remaining } = await supabase
    .from("addresses")
    .select("id, is_default")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (remaining && remaining.length > 0 && !remaining.some((a) => a.is_default)) {
    await supabase
      .from("addresses")
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq("id", remaining[0].id)
      .eq("user_id", user.id);
  }

  revalidatePath("/profile");
  revalidatePath("/profile/addresses");
  return { error: null };
}