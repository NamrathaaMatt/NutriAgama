import { redirect } from "next/navigation";
import { createClient } from "@/backend/supabase/server";
import ProfileView from "@/frontend/components/profile/ProfileView";

export const metadata = {
  title: "Your profile | WIN-DIA Foods",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const meta = user.user_metadata ?? {};

  const { count: addressCount } = await supabase
    .from("addresses")
    .select("id", { count: "exact", head: true });

  // TODO: orders and wishlist counts once those tables exist
  const counts = { orders: 0, wishlist: 0, addresses: addressCount ?? 0 };

  return (
    <ProfileView
      user={{
        fullName: meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "Guest",
        email: user.email ?? "",
        emailVerified: Boolean(user.email_confirmed_at),
        phone: meta.phone ?? null,
        createdAt: user.created_at,
      }}
      counts={counts}
    />
  );
}
