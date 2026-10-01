import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function sanitizeEnv(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/^["']|["']$/g, '');
}

const rawUrl = sanitizeEnv(import.meta.env.VITE_SUPABASE_URL);
const rawAnonKey = sanitizeEnv(import.meta.env.VITE_SUPABASE_ANON_KEY);

function isValidHttpUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

let client: SupabaseClient<any> | null = null;

if (rawUrl && rawAnonKey && isValidHttpUrl(rawUrl)) {
  try {
    client = createClient<any>(rawUrl, rawAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.error('[LIA CMS] Failed to initialize Supabase client:', err);
    client = null;
  }
} else if (import.meta.env.DEV) {
  console.warn(
    '[LIA CMS] Supabase credentials not found or invalid.\n' +
    'The website will use local fallback mode.'
  );
}

export const supabase = client;
export const isSupabaseConfigured = client !== null;
export default supabase;
