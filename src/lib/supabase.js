import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The app runs in a "local-only demo" mode if Supabase is not configured,
// so judges can try it without a backend. With credentials set, all
// check-ins persist to Postgres under Row-Level Security (see supabase/schema.sql).
export const supabaseConfigured = Boolean(url && anonKey)

export const supabase = supabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
