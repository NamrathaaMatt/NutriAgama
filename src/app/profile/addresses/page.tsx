import { redirect } from "next/navigation";
import { createClient } from "@/backend/supabase/server";
import AddressesView from "@/frontend/components/profile/AddressesView";
import type { Address } from "@/backend/actions/addresses";

export const metadata = {
  title: "Your addresses | NUTRI-AGMA",
};

export default async function AddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("addresses")
    .select("id, name, phone, address_line, landmark, city, state, pincode, is_default")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const meta = user.user_metadata ?? {};

  return (
    <AddressesView
      addresses={(data ?? []) as Address[]}
      defaultName={meta.full_name ?? meta.name ?? ""}
      defaultPhone={meta.phone ?? ""}
    />
  );
}
