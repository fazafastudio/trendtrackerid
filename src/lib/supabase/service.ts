// =============================================
// TrendTracker ID - Supabase Service Role Client
// Description: Bypasses RLS. Server-side ONLY.
//              Never import this in client components.
// =============================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/src/types/database";

let _client: SupabaseClient<Database> | null = null;

/**
 * Returns a singleton Supabase client authenticated with the
 * service role key. This client bypasses RLS entirely and should
 * only be used in trusted server-side contexts (route handlers,
 * scripts, cron jobs).
 *
 * Throws if SUPABASE_SERVICE_ROLE_KEY is missing.
 */
export function createServiceRoleClient(): SupabaseClient<Database> {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "Missing env: NEXT_PUBLIC_SUPABASE_URL"
    );
  }
  if (!key) {
    throw new Error(
      "Missing env: SUPABASE_SERVICE_ROLE_KEY — get it from Supabase Dashboard → Settings → API"
    );
  }

  _client = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _client;
}