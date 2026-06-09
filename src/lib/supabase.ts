import { createClient } from '@supabase/supabase-js'

// ─── Domain types ─────────────────────────────────────────────────────────
export interface Profile {
  id: string
  username: string | null
  total_xp: number
  level: number
  correct: number
  wrong: number
  updated_at: string
  created_at: string
}

export interface GameSession {
  id: string
  user_id: string
  stage: string
  correct: number
  wrong: number
  xp_earned: number
  duration_ms: number
  created_at: string
}

export interface LeaderboardRow {
  id: string
  username: string
  total_xp: number
  level: number
  correct: number
  wrong: number
  updated_at: string
  rank: number
}

// ─── Client (no generic — avoids "never" inference issues) ────────────────
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder'
)

export const isSupabaseReady = () => !!url && !!key && !url.includes('placeholder')
