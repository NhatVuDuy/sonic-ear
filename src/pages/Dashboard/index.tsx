import { useNavigate } from 'react-router-dom'
import { useStore, SessionResult, Stage } from '@/store'
import { useSRStore } from '@/store/sr'
import { Card, CardTitle } from '@/components/UI'

// ── Helpers ──────────────────────────────────────────────────────────────────

const STAGE_INFO: Record<Stage, { label: string; emoji: string }> = {
  interval:    { label: 'Quãng',     emoji: '🎯' },
  chord:       { label: 'Hợp âm',   emoji: '🎸' },
  scale:       { label: 'Điệu thức',emoji: '🎼' },
  note:        { label: 'Nốt đơn',  emoji: '🎵' },
  progression: { label: 'Tiến hành',emoji: '🎶' },
  rhythm:      { label: 'Tiết tấu', emoji: '🥁' },
  piano:       { label: 'Đàn',      emoji: '🎹' },
}

const SR_PREFIX: Record<string, { label: string; emoji: string }> = {
  'iv': { label: 'Quãng',      emoji: '🎯' },
  'ch': { label: 'Hợp âm',    emoji: '🎸' },
  'sc': { label: 'Điệu thức', emoji: '🎼' },
  'nt': { label: 'Nốt đơn',   emoji: '🎵' },
  'pg': { label: 'Tiến hành', emoji: '🎶' },
  'rh': { label: 'Tiết tấu',  emoji: '🥁' },
}

function toDateStr(iso: string) { return iso.slice(0, 10) }
function daysAgo(n: number) {
  const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

// ── Heatmap ──────────────────────────────────────────────────────────────────

function Heatmap({ history }: { history: SessionResult[] }) {
  const dateMap = new Map<string, number>()
  history.forEach(r => {
    const d = toDateStr(r.date)
    dateMap.set(d, (dateMap.get(d) || 0) + 1)
  })

  const cells = Array.from({ length: 35 }, (_, i) => {
    const key = daysAgo(34 - i)
    return { key, count: dateMap.get(key) || 0 }
  })
  const maxCount = Math.max(1, ...cells.map(c => c.count))

  const dayLabels = ['T2','T3','T4','T5','T6','T7','CN']

  return (
    <div>
      <div className="flex items-start gap-1">
        <div className="flex flex-col gap-1 pt-0.5 mr-0.5">
          {dayLabels.map(d => (
            <div key={d} className="h-[18px] font-mono text-[.55rem] t-dim flex items-center">{d}</div>
          ))}
        </div>
        <div className="grid gap-1" style={{ gridTemplateRows: 'repeat(7, 18px)', gridAutoFlow: 'column', gridAutoColumns: '18px' }}>
          {cells.map(({ key, count }) => (
            <div
              key={key}
              title={`${key}: ${count} buổi`}
              className="rounded-sm transition-all"
              style={{
                background: count === 0
                  ? 'var(--t-opt-border, rgba(0,0,0,0.08))'
                  : `color-mix(in srgb, var(--accent) ${Math.round(20 + 80 * count / maxCount)}%, transparent)`,
                opacity: count === 0 ? 0.4 : 1,
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="font-mono text-[.55rem] t-dim">Ít</span>
        {[0.15, 0.35, 0.6, 0.85, 1.0].map((o, i) => (
          <div key={i} className="h-[10px] w-[10px] rounded-sm" style={{
            background: `color-mix(in srgb, var(--accent) ${Math.round(o * 100)}%, transparent)`,
            opacity: o < 0.15 ? 0.4 : 1,
          }} />
        ))}
        <span className="font-mono text-[.55rem] t-dim">Nhiều</span>
      </div>
    </div>
  )
}

// ── Module Breakdown ──────────────────────────────────────────────────────────

function ModuleBreakdown({ history }: { history: SessionResult[] }) {
  const byStage = new Map<Stage, { correct: number; wrong: number }>()
  history.forEach(r => {
    const prev = byStage.get(r.stage) || { correct: 0, wrong: 0 }
    byStage.set(r.stage, { correct: prev.correct + r.correct, wrong: prev.wrong + r.wrong })
  })

  const stages = Object.keys(STAGE_INFO) as Stage[]
  const rows = stages.map(s => {
    const d = byStage.get(s) || { correct: 0, wrong: 0 }
    const total = d.correct + d.wrong
    const acc = total ? Math.round(d.correct / total * 100) : null
    return { s, ...d, total, acc }
  }).filter(r => r.total > 0)

  if (rows.length === 0) return <p className="font-mono text-[.75rem] t-dim text-center py-4">Chưa có dữ liệu — hãy luyện tập để xem thống kê</p>

  return (
    <div className="flex flex-col gap-2">
      {rows.map(({ s, correct, wrong, total, acc }) => (
        <div key={s} className="flex items-center gap-3">
          <div className="text-[1.1rem] w-7 text-center flex-shrink-0">{STAGE_INFO[s].emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[.72rem] t-lbl">{STAGE_INFO[s].label}</span>
              <span className="font-mono text-[.68rem] t-dim">{correct}/{total} · {acc ?? '—'}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--t-progressbar-track, #f3f4f6)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: acc !== null ? `${acc}%` : '0%',
                  background: acc !== null && acc >= 80
                    ? 'linear-gradient(90deg, #26de81, #099268)'
                    : acc !== null && acc >= 60
                    ? 'linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #ffd93d))'
                    : 'linear-gradient(90deg, #ff6b6b, #c92a2a)',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Weak Spots ────────────────────────────────────────────────────────────────

function WeakSpots() {
  const { cards } = useSRStore()

  const all = Object.entries(cards)
    .filter(([, c]) => c.correct + c.wrong >= 3 && c.ease < 1.9)
    .sort(([, a], [, b]) => a.ease - b.ease)
    .slice(0, 8)

  if (all.length === 0) return (
    <p className="font-mono text-[.75rem] t-dim text-center py-4">
      Chưa đủ dữ liệu — tiếp tục luyện tập để phát hiện điểm yếu
    </p>
  )

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {all.map(([key, card]) => {
        const [prefix] = key.split(':')
        const info = SR_PREFIX[prefix] || { label: key, emoji: '❓' }
        const label = key.split(':')[1]
        const acc = card.correct + card.wrong > 0
          ? Math.round(card.correct / (card.correct + card.wrong) * 100)
          : 0
        return (
          <div
            key={key}
            className="rounded-2xl p-3 text-center"
            style={{
              background: 'rgba(255,107,107,0.07)',
              border: '2px solid rgba(255,107,107,0.22)',
            }}
          >
            <div className="text-[1.2rem]">{info.emoji}</div>
            <div className="mt-1 font-mono text-[.65rem] font-bold t-lbl truncate">{label}</div>
            <div className="font-mono text-[.6rem] t-dim">{acc}% đúng</div>
            <div className="mt-0.5 font-mono text-[.55rem]" style={{ color: '#f87171' }}>
              {card.wrong} sai / {card.correct + card.wrong} lần
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { correct, wrong, streak, level, xp, history } = useStore()
  const navigate = useNavigate()
  const total = correct + wrong
  const acc = total ? Math.round(correct / total * 100) : null
  const sessions = history.length
  const daysPracticed = new Set(history.map(r => toDateStr(r.date))).size

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/practice')}
          className="rounded-xl px-3 py-1.5 font-mono text-[.72rem] transition-all hover:opacity-70"
          style={{ background: 'var(--t-opt-bg)', border: '2px solid var(--t-opt-border)', color: 'var(--t-dim)' }}
        >
          ← Luyện tập
        </button>
        <div>
          <div className="font-display text-[1.4rem] font-bold t-lbl">📊 Thống Kê</div>
          <div className="font-mono text-[.62rem] t-dim">Lv.{level} · {xp} XP · {sessions} buổi · {daysPracticed} ngày</div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {[
          { value: total.toLocaleString(), label: 'TỔng câu' },
          { value: correct.toLocaleString(), label: 'ĐÚNG' },
          { value: acc !== null ? `${acc}%` : '—', label: 'CHÍNH XÁC' },
          { value: streak.toString(), label: 'STREAK' },
        ].map(({ value, label }) => (
          <div key={label} className="rounded-2xl p-3 text-center" style={{
            background: 'var(--t-stat-bg, rgba(255,255,255,0.85))',
            border: '2px solid var(--t-stat-border, #f3f4f6)',
          }}>
            <div className="font-display text-xl font-bold" style={{ color: 'var(--accent-dark, var(--accent))' }}>{value}</div>
            <div className="mt-0.5 font-mono text-[.55rem] tracking-wider t-dim">{label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <Card>
        <CardTitle>📅 Lịch luyện tập — 5 tuần qua</CardTitle>
        {history.length > 0
          ? <Heatmap history={history} />
          : <p className="font-mono text-[.75rem] t-dim text-center py-4">Chưa có dữ liệu</p>
        }
      </Card>

      {/* Module breakdown */}
      <Card>
        <CardTitle>📈 Thống kê theo module</CardTitle>
        <ModuleBreakdown history={history} />
      </Card>

      {/* Weak spots */}
      <Card>
        <CardTitle>⚠️ Điểm cần cải thiện</CardTitle>
        <WeakSpots />
      </Card>

    </div>
  )
}
