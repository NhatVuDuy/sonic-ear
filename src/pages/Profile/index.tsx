import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useStore } from '@/store'
import { THEMES } from '@/theme'
import { supabase, isSupabaseReady, type GameSession } from '@/lib/supabase'

const MODULE_LABELS: Record<string, string> = {
  interval: 'Quãng', chord: 'Hợp âm', scale: 'Gam', note: 'Nốt đơn', piano: 'Đàn tự do',
}

function StatCard({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl px-4 py-3" style={{ background: 'var(--t-stat-bg)' }}>
      <span className="font-display text-2xl font-bold" style={{ color: color || 'var(--accent)' }}>{value}</span>
      <span className="text-xs" style={{ color: 'var(--t-dim)' }}>{label}</span>
    </div>
  )
}

function AccuracyRing({ correct, wrong }: { correct: number; wrong: number }) {
  const total = correct + wrong
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const r = 36, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--t-progressbar-track)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--accent)" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-xl font-bold" style={{ color: 'var(--accent)' }}>{pct}%</span>
        <span className="text-[9px]" style={{ color: 'var(--t-dim)' }}>accuracy</span>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, profile, signOut, setUsername } = useAuthStore()
  const { xp, level, correct, wrong, streak } = useStore()
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark

  const [sessions, setSessions] = useState<GameSession[]>([])
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState('')
  const [nameLoading, setNameLoading] = useState(false)

  // Use remote profile stats if available, else fall back to local
  const displayXp = profile?.total_xp ?? xp
  const displayLevel = profile?.level ?? level
  const displayCorrect = profile?.correct ?? correct
  const displayWrong = profile?.wrong ?? wrong

  useEffect(() => {
    if (!user || !isSupabaseReady()) return
    supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => { if (data) setSessions(data) })
  }, [user])

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🎵</div>
        <p className="text-lg font-semibold" style={{ color: 'var(--t-text)' }}>Đăng nhập để xem hồ sơ</p>
        <button
          onClick={() => useAuthStore.getState().openAuth()}
          className="rounded-2xl px-6 py-3 text-sm font-bold text-white"
          style={{ background: 'var(--accent)' }}
        >
          Đăng nhập
        </button>
      </main>
    )
  }

  const saveName = async () => {
    setNameError(''); setNameLoading(true)
    const err = await setUsername(nameInput)
    setNameLoading(false)
    if (err) setNameError(err)
    else setEditingName(false)
  }

  return (
    <main className="flex flex-1 flex-col items-center p-4 pb-12 sm:p-6">
      <div className="w-full max-w-lg space-y-5">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--t-dim)' }}>
          ← Quay lại
        </button>

        {/* Profile card */}
        <div className="rounded-3xl p-5 shadow-lg" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.92)', border: '1.5px solid var(--t-opt-border)' }}>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white"
              style={{ background: 'var(--accent)' }}>
              {(profile?.username ?? user.email ?? '?')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="flex-1 rounded-xl border px-2 py-1 text-sm outline-none"
                    style={{ background: 'transparent', border: '1.5px solid var(--accent)', color: 'var(--t-text)' }}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
                  />
                  <button onClick={saveName} disabled={nameLoading}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-white disabled:opacity-50"
                    style={{ background: 'var(--accent)' }}>
                    {nameLoading ? '…' : 'Lưu'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold text-lg" style={{ color: 'var(--t-text)' }}>
                    {profile?.username ?? 'Chưa có tên'}
                  </span>
                  <button onClick={() => { setNameInput(profile?.username ?? ''); setEditingName(true) }}
                    className="text-xs opacity-50 hover:opacity-100" style={{ color: 'var(--t-dim)' }}>✏️</button>
                </div>
              )}
              {nameError && <p className="mt-1 text-xs" style={{ color: '#c94c4c' }}>{nameError}</p>}
              <p className="text-xs truncate" style={{ color: 'var(--t-dim)' }}>{user.email}</p>
            </div>
            <button onClick={signOut} className="rounded-xl px-3 py-1.5 text-xs font-semibold hover:opacity-70"
              style={{ border: '1.5px solid var(--t-opt-border)', color: 'var(--t-dim)' }}>
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex items-center gap-4 rounded-3xl p-4" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.92)', border: '1.5px solid var(--t-opt-border)' }}>
            <AccuracyRing correct={displayCorrect} wrong={displayWrong} />
            <div className="grid grid-cols-2 flex-1 gap-2">
              <StatCard value={displayCorrect} label="Đúng" color="var(--color-ok, #4caf82)" />
              <StatCard value={displayWrong} label="Sai" color="var(--color-bad, #c94c4c)" />
              <StatCard value={`Lv.${displayLevel}`} label="Cấp độ" />
              <StatCard value={displayXp} label="XP" />
            </div>
          </div>
        </div>

        {/* Recent sessions */}
        {sessions.length > 0 && (
          <div className="rounded-3xl p-4 shadow" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.92)', border: '1.5px solid var(--t-opt-border)' }}>
            <h3 className="mb-3 text-sm font-bold" style={{ color: 'var(--t-text)' }}>Lịch sử luyện tập</h3>
            <div className="space-y-2">
              {sessions.map(s => {
                const total = s.correct + s.wrong
                const acc = total > 0 ? Math.round((s.correct / total) * 100) : 0
                const date = new Date(s.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'var(--t-stat-bg)' }}>
                    <span className="w-6 text-base" title={MODULE_LABELS[s.stage]}>
                      {s.stage === 'interval' ? '🎼' : s.stage === 'chord' ? '🎹' : s.stage === 'scale' ? '🎵' : s.stage === 'note' ? '🎙️' : '🎸'}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs font-semibold" style={{ color: 'var(--t-text)' }}>{MODULE_LABELS[s.stage] ?? s.stage}</span>
                      <div className="text-[10px]" style={{ color: 'var(--t-dim)' }}>{s.correct}✓ {s.wrong}✗ · {acc}%</div>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--t-dim)' }}>{date}</span>
                    <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: 'var(--accent)' }}>+{s.xp_earned} XP</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
