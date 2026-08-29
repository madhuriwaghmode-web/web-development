import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  // Deliberately loud in the console (not to the user) — a misconfigured backend should
  // never fail silently in a healthcare app.
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local ' +
      '(see .env.example) — authentication will not work until this is set.'
  )
}

// A stub client is intentionally NOT created when unconfigured — every authService call
// checks isSupabaseConfigured first and fails with a clear message instead of a cryptic
// network error against an empty URL.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null
