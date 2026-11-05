"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/* Create the client lazily so an invalid placeholder URL (or a missing
   credential) never crashes a static build or server-side render. The
   client is only instantiated the first time a data function actually
   needs it, and only in the browser. */
let cachedClient: SupabaseClient | null = null;
let clientAttempted = false;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!clientAttempted) {
    clientAttempted = true;
    try {
      cachedClient = createClient(supabaseUrl!, supabaseAnonKey!);
    } catch {
      cachedClient = null;
    }
  }
  return cachedClient;
}

export const supabase: SupabaseClient | null = getSupabase();
