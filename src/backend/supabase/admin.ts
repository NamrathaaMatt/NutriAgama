import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role (admin) Supabase client — SERVER ONLY.
 *
 * Used by the payment API routes (/api/orders, /api/payment/*) because:
 *  - webhook requests have no user session, and
 *  - guest checkout has no session either,
 * so the anon key + RLS would reject the writes. The service-role key
 * bypasses RLS and must NEVER be exposed to the client (no NEXT_PUBLIC_ prefix).
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (see .env.example).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_URL). " +
        "Add SUPABASE_SERVICE_ROLE_KEY to .env.local — see .env.example."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
