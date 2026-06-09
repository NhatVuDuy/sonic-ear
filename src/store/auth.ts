import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseReady, type Profile } from '@/lib/supabase'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean           // initial session check
  authModalOpen: boolean
  usernameModalOpen: boolean // shown after Google OAuth if no username yet

  init: () => void
  openAuth: () => void
  closeAuth: () => void
  signUp: (email: string, password: string, username: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  setUsername: (username: string) => Promise<string | null>
  syncStats: (stats: { total_xp: number; level: number; correct: number; wrong: number }) => Promise<void>
  pushSession: (s: { stage: string; correct: number; wrong: number; xp_earned: number; duration_ms: number }) => Promise<void>
}

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data ?? null
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  authModalOpen: false,
  usernameModalOpen: false,

  init() {
    if (!isSupabaseReady()) { set({ loading: false }); return }

    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user ?? null
      const profile = user ? await loadProfile(user.id) : null
      set({ user, profile, loading: false })
    })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      const profile = user ? await loadProfile(user.id) : null
      // Show username modal for new Google users who don't have a username yet
      const showUsername = !!user && !profile?.username
      set({ user, profile, usernameModalOpen: showUsername, authModalOpen: false })
    })
  },

  openAuth: () => set({ authModalOpen: true }),
  closeAuth: () => set({ authModalOpen: false }),

  async signUp(email, password, username) {
    const trimmed = username.trim()
    if (!trimmed) return 'Vui lòng nhập tên hiển thị'
    if (trimmed.length < 2) return 'Tên phải có ít nhất 2 ký tự'

    // Check username availability
    const { data: existing } = await supabase
      .from('profiles').select('id').eq('username', trimmed).maybeSingle()
    if (existing) return 'Tên này đã được dùng, chọn tên khác nhé'

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return error.message

    // Trigger auto-creates the profile row; we set the username here
    await new Promise(r => setTimeout(r, 800))
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ username: trimmed }).eq('id', user.id)
      const profile = await loadProfile(user.id)
      set({ profile })
    }
    return null
  },

  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? error.message : null
  },

  async signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  },

  async signOut() {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },

  async setUsername(username) {
    const { user } = get()
    if (!user) return 'Chưa đăng nhập'
    const trimmed = username.trim()
    if (trimmed.length < 2) return 'Tên phải có ít nhất 2 ký tự'

    const { data: existing } = await supabase
      .from('profiles').select('id').eq('username', trimmed).maybeSingle()
    if (existing && existing.id !== user.id) return 'Tên này đã được dùng'

    const { error } = await supabase
      .from('profiles').update({ username: trimmed }).eq('id', user.id)
    if (error) return error.message

    const profile = await loadProfile(user.id)
    set({ profile, usernameModalOpen: false })
    return null
  },

  async syncStats(stats) {
    const { user } = get()
    if (!user || !isSupabaseReady()) return
    await supabase.from('profiles').update({
      total_xp: stats.total_xp,
      level: stats.level,
      correct: stats.correct,
      wrong: stats.wrong,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
  },

  async pushSession(s) {
    const { user } = get()
    if (!user || !isSupabaseReady()) return
    await supabase.from('game_sessions').insert({ ...s, user_id: user.id })
  },
}))
