import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useStore } from '@/store'
import { THEMES } from '@/theme'
import { supabase, isSupabaseReady, type LeaderboardRow } from '@/lib/supabase'

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function AccBadge({ correct, wrong }: { correct: number; wrong: number }) {
  const total = correct + wrong
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  return (
    <span className="rounded-lg px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ background: pct >= 80 ? 'rgba(76,175,130,0.15)' : 'rgba(138,125,106,0.12)', color: pct >= 80 ? '#4caf82' : 'var(--t-dim)' }}>
      {pct}%
    </span>
  )
}

export function LeaderboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [myRow, setMyRow] = useState<LeaderboardRow | null>(null)

  useEffect(() => {
    if (!isSupabaseReady()) { setLoading(false); return }

    supabase.from('leaderboard').select('*').order('rank').limit(100)
      .then(({ data }) => {
        if (data) {
          setRows(data)
          if (user) setMyRow(data.find(r => r.id === user.id) ?? null)
        }
        setLoading(false)
      })
  }, [user])

  return (
    <main className="flex flex-1 flex-col items-center p-4 pb-12 sm:p-6">
      <div className="w-full max-w-lg space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-sm" style={{ color: 'var(--t-dim)' }}>←</button>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--t-text)' }}>🏆 Bảng xếp hạng</h1>
        </div>

        {/* Top 3 podium */}
        {!loading && rows.length >= 3 && (
          <div className="flex items-end justify-center gap-2 py-2">
            {/* 2nd */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#9ca3af,#6b7280)' }}>
                {(rows[1].username ?? '?')[0].toUpperCase()}
              </div>
              <span className="text-[11px] font-semibold max-w-[72px] truncate text-center" style={{ color: 'var(--t-text)' }}>{rows[1].username}</span>
              <span className="text-[10px]" style={{ color: 'var(--t-dim)' }}>{rows[1].total_xp} XP</span>
              <div className="rounded-t-xl px-4 py-2 text-xl" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', minHeight: 48 }}>🥈</div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark, #ff9f43))' }}>
                {(rows[0].username ?? '?')[0].toUpperCase()}
              </div>
              <span className="text-[12px] font-bold max-w-[80px] truncate text-center" style={{ color: 'var(--t-text)' }}>{rows[0].username}</span>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--accent)' }}>{rows[0].total_xp} XP</span>
              <div className="rounded-t-xl px-4 py-3 text-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)', minHeight: 64 }}>🥇</div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#cd7c3b,#a0522d)' }}>
                {(rows[2].username ?? '?')[0].toUpperCase()}
              </div>
              <span className="text-[11px] font-semibold max-w-[72px] truncate text-center" style={{ color: 'var(--t-text)' }}>{rows[2].username}</span>
              <span className="text-[10px]" style={{ color: 'var(--t-dim)' }}>{rows[2].total_xp} XP</span>
              <div className="rounded-t-xl px-4 py-2 text-xl" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', minHeight: 40 }}>🥉</div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="rounded-3xl overflow-hidden" style={{ border: '1.5px solid var(--t-opt-border)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-2xl animate-spin">🎵</div>
            </div>
          ) : !isSupabaseReady() ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
              <span className="text-3xl">🔌</span>
              <p className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>Chưa kết nối Supabase</p>
              <p className="text-xs" style={{ color: 'var(--t-dim)' }}>Thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào .env.local</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <span className="text-3xl">🎹</span>
              <p className="text-sm" style={{ color: 'var(--t-dim)' }}>Chưa có người chơi nào — hãy là người đầu tiên!</p>
            </div>
          ) : (
            rows.map((r, i) => {
              const isMe = user?.id === r.id
              return (
                <div key={r.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{
                    borderBottom: i < rows.length - 1 ? '1px solid var(--t-opt-border)' : 'none',
                    background: isMe ? 'var(--accent)19' : 'transparent',
                  }}>
                  {/* Rank */}
                  <div className="w-7 text-center text-base shrink-0">
                    {MEDAL[r.rank] ?? <span className="text-xs font-bold" style={{ color: 'var(--t-dim)' }}>{r.rank}</span>}
                  </div>
                  {/* Avatar */}
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: isMe ? 'var(--accent)' : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }}>
                    {r.username[0].toUpperCase()}
                  </div>
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold" style={{ color: isMe ? 'var(--accent)' : 'var(--t-text)' }}>
                        {r.username}
                      </span>
                      {isMe && <span className="text-[10px] rounded-md px-1 py-0.5 font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>Bạn</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]" style={{ color: 'var(--t-dim)' }}>Lv.{r.level}</span>
                      <AccBadge correct={r.correct} wrong={r.wrong} />
                    </div>
                  </div>
                  {/* XP */}
                  <span className="text-sm font-bold shrink-0" style={{ color: 'var(--accent)' }}>{r.total_xp.toLocaleString()}</span>
                </div>
              )
            })
          )}
        </div>

        {/* My rank (if outside top 100) */}
        {!loading && user && !myRow && isSupabaseReady() && (
          <p className="text-center text-xs" style={{ color: 'var(--t-dim)' }}>
            Bạn chưa có trong top 100. Luyện thêm để leo hạng! 💪
          </p>
        )}
      </div>
    </main>
  )
}
