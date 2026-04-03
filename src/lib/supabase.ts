import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://ztoaqdvwnzmfvhuodqhj.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_uMD9fyYbkGEUTRwY42P95Q_0EKAIz1Z';

export const DEFAULT_ADMIN_EMAIL =
  import.meta.env.VITE_DEFAULT_ADMIN_EMAIL ?? 'info@david-kozak.com';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
