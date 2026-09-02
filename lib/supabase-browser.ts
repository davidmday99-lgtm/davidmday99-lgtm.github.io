import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient: SupabaseClient | undefined;

export function hasSupabaseConfig() {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('example-project') &&
    supabaseAnonKey !== 'example-anon-key',
  );
}

export function getSupabaseBrowserClient() {
  if (!hasSupabaseConfig() || !supabaseUrl || !supabaseAnonKey) {
    throw new Error('Google sign-in is not configured yet.');
  }

  browserClient ??= createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });

  return browserClient;
}
