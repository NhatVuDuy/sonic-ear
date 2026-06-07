import { ReactNode } from 'react'

// ─── Card — glass morphism với gradient border ────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-violet-500/60 via-cyan-400/50 to-pink-500/60" />
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 font-display text-[.85rem] font-semibold tracking-wide text-violet-300">
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
    gold:    'bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_28px_rgba(168,85,247,0.6)] hover:-translate-y-px',
    outline: 'bg-transparent text-violet-300 border border-violet-400/40 hover:bg-violet-500/10 hover:border-violet-400/70',
    ghost:   'bg-white/[0.06] text-slate-300 border border-white/10 hover:bg-white/[0.12] hover:text-white',
  }
  return (
    <button className={`${base} ${sz} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

// ─── Play Button — lớn, gradient, glow ───────────────────
export function PlayBtn({ onClick, isPlaying }: { onClick: () => void; isPlaying?: boolean }) {
  return (
    <button
      data-playbtn
      onClick={onClick}
      className={`flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-purple-600 to-fuchsia-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_45px_rgba(168,85,247,0.7)] active:scale-95 ${isPlaying ? 'animate-pulse-play' : ''}`}
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

// ─── Option Button — card-like, mới hơn ──────────────────
type OptState = 'idle' | 'correct' | 'wrong' | 'reveal'
export function OptionBtn({
  children, onClick, state = 'idle', disabled
}: { children: ReactNode; onClick?: () => void; state?: OptState; disabled?: boolean }) {
  const cls = {
    idle:   'border-white/10 bg-white/[0.05] text-slate-200 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-100 hover:-translate-y-px',
    correct:'border-emerald-400/60 bg-emerald-500/10 text-emerald-300',
    wrong:  'border-rose-400/60 bg-rose-500/10 text-rose-300',
    reveal: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300',
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

// ─── Module Tabs — pill style ─────────────────────────────
export function ModuleTabs<T extends string>({
  options, value, onChange
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] tracking-wider transition-all duration-200 ${
            o.value === value
              ? 'bg-violet-500/20 border border-violet-400/40 text-violet-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              : 'border border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:border-white/20'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── Stat Box — gradient value ────────────────────────────
export function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
      <div className="font-display text-2xl grad-text">{value}</div>
      <div className="mt-0.5 font-mono text-[0.62rem] tracking-[.14em] text-slate-500">{label}</div>
    </div>
  )
}

// ─── Progress Bar — rainbow gradient ─────────────────────
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ─── Note Bubble — glow ring ──────────────────────────────
export function NoteBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-violet-400/50 bg-violet-500/10 font-display text-base font-bold text-violet-300 shadow-[0_0_14px_rgba(168,85,247,0.3)]">
      {children}
    </div>
  )
}
