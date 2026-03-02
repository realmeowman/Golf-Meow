import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Use SUPABASE_URL / SUPABASE_ANON_KEY (server-only, read at runtime)
// NOT NEXT_PUBLIC_* which gets cached at build time
function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL and SUPABASE_ANON_KEY in .env.local. Add them (same values as NEXT_PUBLIC_*)."
    );
  }
  return createClient(url, key);
}

export const supabase = getSupabase();
