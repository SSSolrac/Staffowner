import { createClient } from '@supabase/supabase-js';

const resolveSupabaseUrl = () => {
  const env = import.meta.env as Record<string, string | undefined>;
  return env.VITE_SUPABASE_URL;
};

const resolveSupabaseAnonKey = () => {
  const env = import.meta.env as Record<string, string | undefined>;
  return env.VITE_SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? env.VITE_SUPABASE_KEY;
};

const supabaseUrl = resolveSupabaseUrl();
const supabaseAnonKey = resolveSupabaseAnonKey();

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [
    !supabaseUrl ? 'VITE_SUPABASE_URL' : null,
    !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY)' : null,
  ].filter(Boolean);

  throw new Error(`Missing Supabase env vars: ${missing.join(', ')}.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

