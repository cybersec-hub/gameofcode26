import { supabase, supabaseConfigured } from './supabase'

/**
 * Persistence for check-ins. IMPORTANT (data protection):
 *  - We store only the numeric indicators + the derived score/emotion label.
 *  - We NEVER store camera frames or images. Facial analysis is on-device only.
 *  - With Supabase, every row is protected by Row-Level Security so a user can
 *    only ever read/write their own rows (see supabase/schema.sql).
 */

const LOCAL_KEY = 'tr_checkins_v1'

export async function saveCheckIn(entry) {
  if (supabaseConfigured) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const row = { ...entry, user_id: user?.id }
    const { data, error } = await supabase.from('check_ins').insert(row).select().single()
    if (error) throw error
    return data
  }
  // Local demo fallback
  const all = readLocal()
  const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...entry }
  all.unshift(row)
  localStorage.setItem(LOCAL_KEY, JSON.stringify(all))
  return row
}

export async function listCheckIns(limit = 30) {
  if (supabaseConfigured) {
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  }
  return readLocal().slice(0, limit)
}

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}

/** Generate plausible historical logs for demo / ModelPerformance charts. */
export function seedDemoHistory(days = 7) {
  const all = readLocal()
  if (all.length >= days) return
  const now = Date.now()
  for (let i = days - 1; i >= 0; i--) {
    const wobble = (n) => Math.max(0.05, Math.min(0.95, n + (Math.random() - 0.5) * 0.2))
    all.push({
      id: crypto.randomUUID(),
      created_at: new Date(now - i * 86400000).toISOString(),
      indicators: {
        mood: wobble(0.55), stress: wobble(0.5), sleep: wobble(0.6),
        energy: wobble(0.55), motivation: wobble(0.55), appetite: wobble(0.6),
        social: wobble(0.5), focus: wobble(0.58),
      },
      score: Math.round(55 + Math.random() * 25),
      emotion: ['happy', 'neutral', 'sad', 'neutral', 'happy'][i % 5],
    })
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))))
}
