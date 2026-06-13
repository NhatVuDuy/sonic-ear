import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, type SessionResult } from '@/store'
import { useAuthStore } from '@/store/auth'
import { supabase, isSupabaseReady, type GameSession } from '@/lib/supabase'
import { THEMES } from '@/theme'

// ── Helpers ───────────────────────────────────────────────────────────────────

type Stage = 'interval' | 'chord' | 'scale' | 'note' | 'piano'

const MODULE_META: Record<Stage, { emoji: string; label: string }> = {
  interval: { emoji: '🎼', label: 'Quãng' },
  chord:    { emoji: '🎹', label: 'Hợp âm' },
  scale:    { emoji: '🎵', label: 'Gam' },
  note:     { emoji: '🎙️', label: 'Nốt đơn' },
  piano:    { emoji: '🎸', label: 'Đàn tự do' },
}

function toDateKey(iso: string) { return iso.slice(0, 10) }

// ── Unified session entry ─────────────────────────────────────────────────────

interface Entry { date: string; stage: Stage; correct: number; wrong: number }

function fromLocal(history: SessionResult[]): Entry[] {
  return history.map(h => ({ date: toDateKey(h.date), stage: h.stage as Stage, correct: h.correct, wrong: h.wrong }))
}

function fromRemote(sessions: GameSession[]): Entry[] {
  return sessions.map(s => ({ date: toDateKey(s.created_at), stage: s.stage as Stage, correct: s.correct, wrong: s.wrong }))
}

// ── Heatmap ───────────────────────────────────────────────────────────────────

function Heatmap({ entries }: { entries: Entry[] }) {
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark

  // Build map: dateKey → total correct
  const map: Record<string, number> = {}
  entries.forEach(e => { map[e.date] = (map[e.date] ?? 0) + e.correct })

  // Last 7 weeks (49 days), starting from Monday
  const today = new Date()
  const days: { key: string; date: Date }[] = []
  for (let i = 48; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({ key: toDateKey(d.toISOString()), date: d })
  }

  // Pad from front so grid starts on Monday
  const firstDow = days[0].date.getDay() // 0=Sun
  const padStart = firstDow === 0 ? 6 : firstDow - 1 // days to pad

  const maxVal = Math.max(1, ...Object.values(map))

  const intensity = (val: number) => {
    if (!val) return 0
    const ratio = val / maxVal
    if (ratio < 0.25) return 1
    if (ratio < 0.5)  return 2
    if (ratio < 0.75) return 3
    return 4
  }

  const colors = isDark
    ? ['rgba(255,255,255,0.07)', '#4c9be8', '#3b82f6', '#2563eb', '#1d4ed8']
    : ['rgba(0,0,0,0.06)', '#bbdefb', '#64b5f6', '#2196f3', '#1565c0']

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

  return (
    <div>
      <div className="mb-1.5 flex gap-[3px] pl-8">
        {weekDays.map(d => (
          <div key={d} className="w-[14px] text-center font-mono text-[9px]" style={{ color: 'var(--t-dim)' }}>{d}</div>
        ))}
      </div>
      <div className="flex gap-[3px]">
        {/* Week labels */}
        <div className="flex flex-col gap-[3px] pr-1">
          {Array.from({ length: Math.ceil((padStart + days.length) / 7) }).map((_, wi) => (
            <div key={wi} className="h-[14px] text-right font-mono text-[9px] leading-[14px]" style={{ color: 'var(--t-dim)' }}>
              {wi % 2 === 0 ? `W${wi + 1}` : ''}
            </div>
          ))}
        </div>
        {/* Grid */}
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(7, 14px)' }}>
          {Array.from({ length: padStart }).map((_, i) => (
            <div key={`p${i}`} style={{ width: 14, height: 14 }} />
          ))}
          {days.map(({ key, date }) => {
            const val = map[key] ?? 0
            const lvl = intensity(val)
            return (
              <div
                key={key}
                title={`${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}: ${val} đúng`}
                style={{
                  width: 14, height: 14,
                  borderRadius: 3,
                  background: colors[lvl],
                  transition: 'opacity 0.15s',
                }}
              />
            )
          })}
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 justify-end">
        <span className="text-[9px]" style={{ color: 'var(--t-dim)' }}>Ít</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
        ))}
        <span className="text-[9px]" style={{ color: 'var(--t-dim)' }}>Nhiều</span>
      </div>
    </div>
  )
}

// ── Accuracy bar chart (last 14 days) ─────────────────────────────────────────

function AccuracyChart({ entries }: { entries: Entry[] }) {
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark

  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (13 - i))
    return toDateKey(d.toISOString())
  })

  const dayStats: Record<string, { correct: number; wrong: number }> = {}
  entries.forEach(e => {
    if (!dayStats[e.date]) dayStats[e.date] = { correct: 0, wrong: 0 }
    dayStats[e.date].correct += e.correct
    dayStats[e.date].wrong += e.wrong
  })

  const bars = days.map(key => {
    const s = dayStats[key]
    const total = s ? s.correct + s.wrong : 0
    const acc = total > 0 ? Math.round((s.correct / total) * 100) : null
    return { key, acc, total }
  })

  return (
    <div>
      <div className="flex items-end gap-[3px] h-24">
        {bars.map(({ key, acc }) => (
          <div key={key} className="flex flex-1 flex-col items-center gap-0.5">
            <div className="relative flex w-full flex-col justify-end" style={{ height: 80 }}>
              {acc !== null && (
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${acc}%`,
                    background: acc >= 80
                      ? 'var(--color-ok, #26de81)'
                      : acc >= 50
                      ? 'var(--accent)'
                      : 'var(--color-bad, #ff6b6b)',
                    opacity: 0.85,
                  }}
                />
              )}
            </div>
            <span className="font-mono text-[8px]" style={{ color: 'var(--t-dim)' }}>
              {key.slice(8)}
            </span>
          </div>
        ))}
      </div>
      {/* Y-axis labels */}
      <div className="flex justify-between mt-1">
        {[0, 25, 50, 75, 100].map(v => (
          <span key={v} className="font-mono text-[8px]" style={{ color: 'var(--t-dim)' }}>{v}%</span>
        ))}
      </div>
    </div>
  )
}

// ── Module breakdown ──────────────────────────────────────────────────────────

function ModuleBreakdown({ entries }: { entries: Entry[] }) {
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark

  const stats: Record<string, { correct: number; wrong: number }> = {}
  entries.forEach(e => {
    if (!stats[e.stage]) stats[e.stage] = { correct: 0, wrong: 0 }
    stats[e.stage].correct += e.correct
    stats[e.stage].wrong += e.wrong
  })

  return (
    <div className="grid grid-cols-5 gap-2">
      {(Object.keys(MODULE_META) as Stage[]).map(stage => {
        const { emoji, label } = MODULE_META[stage]
        const s = stats[stage]
        const total = s ? s.correct + s.wrong : 0
        const acc = total > 0 ? Math.round((s.correct / total) * 100) : null
        const accent = acc === null ? 'var(--t-dim)' : acc >= 80 ? '#26de81' : acc >= 50 ? 'var(--accent)' : '#ff6b6b'

        return (
          <div
            key={stage}
            className="flex flex-col items-center gap-1.5 rounded-2xl p-3"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)', border: '1.5px solid var(--t-opt-border)' }}
          >
            <span className="text-xl">{emoji}</span>
            <span className="font-mono text-[10px] font-bold text-center" style={{ color: 'var(--t-dim)' }}>{label}</span>
            <span className="font-display text-lg font-bold" style={{ color: accent }}>
              {acc !== null ? `${acc}%` : '—'}
            </span>
            {total > 0 && (
              <span className="font-mono text-[9px]" style={{ color: 'var(--t-dim)' }}>{s.correct}✓ {s.wrong}✗</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate()
  const { correct, wrong, xp, level, streak, history, themeId } = useStore()
  const { user, profile } = useAuthStore()
  const isDark = THEMES[themeId].isDark

  const [remoteSessions, setRemoteSessions] = useState<GameSession[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !isSupabaseReady()) return
    setLoading(true)
    supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data }) => {
        if (data) setRemoteSessions(data)
        setLoading(false)
      })
  }, [user])

  // Merge local + remote (dedupe by preferring remote)
  const entries: Entry[] = remoteSessions.length > 0
    ? fromRemote(remoteSessions)
    : fromLocal(history)

  const displayCorrect = profile?.correct ?? correct
  const displayWrong   = profile?.wrong ?? wrong
  const displayXp      = profile?.total_xp ?? xp
  const displayLevel   = profile?.level ?? level
  const total          = displayCorrect + displayWrong
  const acc            = total > 0 ? Math.round((displayCorrect / total) * 100) : 0

  const card = (children: React.ReactNode) => (
    <div className="rounded-3xl p-4" style={{
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.92)',
      border: '1.5px solid var(--t-opt-border)',
    }}>
      {children}
    </div>
  )

  const sectionTitle = (title: string) => (
    <h3 className="mb-3 font-mono text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--t-dim)' }}>
      {title}
    </h3>
  )

  return (
    <main className="flex flex-1 flex-col items-center p-4 pb-16 sm:p-6">
      <div className="w-full max-w-lg space-y-4">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--t-dim)' }}>
          ← Quay lại
        </button>

        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--t-text)' }}>
          📊 Thống kê
        </h2>

        {/* Overview stats */}
        {card(
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { value: displayCorrect.toLocaleString(), label: 'Đúng', color: '#26de81' },
              { value: `${acc}%`, label: 'Chính xác', color: 'var(--accent)' },
              { value: `🔥 ${streak}`, label: 'Streak', color: '#fb923c' },
              { value: `Lv.${displayLevel}`, label: `${displayXp} XP`, color: 'var(--accent)' },
            ].map(({ value, label, color }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-display text-xl font-bold" style={{ color }}>{value}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--t-dim)' }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Heatmap */}
        {card(
          <>
            {sectionTitle('Hoạt động — 7 tuần qua')}
            {loading
              ? <div className="text-center text-sm" style={{ color: 'var(--t-dim)' }}>Đang tải...</div>
              : entries.length === 0
              ? <div className="text-center text-sm" style={{ color: 'var(--t-dim)' }}>
                  Chưa có dữ liệu — hãy luyện tập để xem lịch hoạt động!
                </div>
              : <Heatmap entries={entries} />
            }
          </>
        )}

        {/* Daily accuracy chart */}
        {entries.length > 0 && card(
          <>
            {sectionTitle('Chính xác 14 ngày qua')}
            <AccuracyChart entries={entries} />
            <div className="mt-2 flex items-center gap-3 text-[9px]" style={{ color: 'var(--t-dim)' }}>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#26de81' }} />≥ 80%</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--accent)' }} />50–79%</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#ff6b6b' }} />{'< 50%'}</span>
            </div>
          </>
        )}

        {/* Module breakdown */}
        {card(
          <>
            {sectionTitle('Theo module')}
            <ModuleBreakdown entries={entries} />
          </>
        )}

        {!user && (
          <div className="rounded-2xl p-4 text-center text-sm" style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            border: '1.5px dashed var(--t-opt-border)',
            color: 'var(--t-dim)',
          }}>
            💡 Đăng nhập để lưu thống kê trên nhiều thiết bị
          </div>
        )}
      </div>
    </main>
  )
}
