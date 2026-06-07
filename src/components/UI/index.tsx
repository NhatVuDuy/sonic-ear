import { ReactNode } from 'react'

// ─── Card — glass morphism, full-spectrum top border ─────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl" style={{
        background: 'linear-gradient(90deg,#f472b6,#fb923c,#facc15,#34d399,#22d3ee,#a78bfa)',
      }} />
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 font-display text-[.85rem] font-semibold tracking-wide grad-text-cool">
      {children}
    </div>
  )
}

// ─── Buttons ──────────────────────────────────────────────
type BtnVariant = 'gold' | 'outline' | 'ghost'
interface BtnProps {
  children: ReactNode
  onClick?: () => void
  variant?: BtnVariant
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md'
}
export function Btn({ children, onClick, variant = 'ghost', disabled, className = '', size = 'md' }: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-full font-mono tracking-wider transition-all duration-200 cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed'
  const sz = size === 'sm' ? 'px-3.5 py-1.5 text-[0.68rem]' : 'px-5 py-2.5 text-[0.76rem]'
  const variants: Record<BtnVariant, string> = {
    gold:    'text-white font-medium hover:-translate-y-px',
    outline: 'bg-transparent text-pink-300 border border-pink-400/40 hover:bg-pink-500/10 hover:border-pink-400/70',
    ghost:   'bg-white/[0.06] text-slate-300 border border-white/10 hover:bg-white/[0.12] hover:text-white',
  }
  const goldStyle = variant === 'gold' ? {
    background: 'linear-gradient(135deg,#f472b6,#fb923c,#facc15)',
    boxShadow: '0 4px 20px rgba(244,114,182,0.4)',
  } : {}
  return (
    <button
      className={`${base} ${sz} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={goldStyle}
    >
      {children}
    </button>
  )
}

// ─── Play Button — rainbow gradient + double-ring pulse ───
export function PlayBtn({ onClick, isPlaying }: { onClick: () => void; isPlaying?: boolean }) {
  return (
    <button
      data-playbtn
      onClick={onClick}
      className={`flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95 ${isPlaying ? 'animate-pulse-play' : ''}`}
      style={{
        background: 'linear-gradient(135deg,#f472b6,#fb923c,#facc15,#34d399,#22d3ee,#a78bfa)',
        boxShadow: isPlaying ? undefined : '0 0 30px rgba(244,114,182,0.45)',
      }}
    >
      <span className="ml-1 text-3xl drop-shadow">▶</span>
    </button>
  )
}

// ─── Feedback Bar ─────────────────────────────────────────
type FbState = 'idle' | 'correct' | 'wrong'
export function FeedbackBar({ state, children }: { state: FbState; children: ReactNode }) {
  const cls = {
    idle:    'bg-white/[0.03] border-white/10 text-slate-400',
    correct: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-300',
    wrong:   'bg-rose-500/10 border-rose-400/40 text-rose-300',
  }[state]
  return (
    <div className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 font-display text-base transition-all duration-300 ${cls}`}>
      {children}
    </div>
  )
}

// ─── Option Button — rainbow accent on hover ──────────────
type OptState = 'idle' | 'correct' | 'wrong' | 'reveal'
export function OptionBtn({
  children, onClick, state = 'idle', disabled
}: { children: ReactNode; onClick?: () => void; state?: OptState; disabled?: boolean }) {
  const cls = {
    idle:    'border-white/10 bg-white/[0.05] text-slate-200 hover:border-pink-400/60 hover:bg-pink-500/10 hover:text-pink-100 hover:-translate-y-px',
    correct: 'border-emerald-400/60 bg-emerald-500/10 text-emerald-300',
    wrong:   'border-rose-400/60 bg-rose-500/10 text-rose-300',
    reveal:  'border-emerald-400/50 bg-emerald-500/10 text-emerald-300',
  }[state]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`ob-key rounded-2xl border p-3 text-center font-mono text-[0.72rem] tracking-wider transition-all duration-150 disabled:cursor-not-allowed ${cls}`}
    >
      {children}
    </button>
  )
}

// ─── Module Tabs — each tab gets its own rainbow color ────
const TAB_COLORS = [
  { bg: 'linear-gradient(135deg,#f472b6,#fb7185)', glow: '0 0 14px rgba(244,114,182,0.5)' },
  { bg: 'linear-gradient(135deg,#fb923c,#fbbf24)', glow: '0 0 14px rgba(251,146,60,0.5)' },
  { bg: 'linear-gradient(135deg,#facc15,#a3e635)', glow: '0 0 14px rgba(250,204,21,0.5)' },
  { bg: 'linear-gradient(135deg,#34d399,#22d3ee)', glow: '0 0 14px rgba(52,211,153,0.5)' },
  { bg: 'linear-gradient(135deg,#a78bfa,#e879f9)', glow: '0 0 14px rgba(167,139,250,0.5)' },
]
export function ModuleTabs<T extends string>({
  options, value, onChange
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {options.map((o, i) => {
        const color = TAB_COLORS[i % TAB_COLORS.length]
        const active = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className="rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] tracking-wider transition-all duration-200"
            style={active ? {
              background: color.bg,
              color: '#fff',
              boxShadow: color.glow,
              border: 'none',
            } : {
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Stat Box ─────────────────────────────────────────────
export function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
      <div className="font-display text-2xl grad-text">{value}</div>
      <div className="mt-0.5 font-mono text-[0.62rem] tracking-[.14em] text-slate-500">{label}</div>
    </div>
  )
}

// ─── Progress Bar — full 6-stop rainbow ───────────────────
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg,#f472b6,#fb923c,#facc15,#34d399,#22d3ee,#a78bfa)',
        }}
      />
    </div>
  )
}

// ─── Note Bubble — rainbow fill + glow ───────────────────
export function NoteBubble({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-full font-display text-base font-bold text-white"
      style={{
        background: 'linear-gradient(135deg,#f472b6,#fb923c,#facc15,#34d399,#22d3ee,#a78bfa)',
        boxShadow: '0 0 20px rgba(244,114,182,0.4), 0 0 40px rgba(96,165,250,0.2)',
      }}
    >
      {children}
    </div>
  )
}
