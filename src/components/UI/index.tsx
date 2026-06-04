import { ReactNode } from 'react'

// ─── Card ────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-xl border border-white/[0.08] bg-[#161310]/90 p-5 ${className}`}>
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <div className="font-display mb-3 text-sm tracking-wide text-[#c9a84c]">{children}</div>
}

// ─── Buttons ─────────────────────────────────────────────
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
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-mono tracking-wider transition-all duration-200 cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed'
  const sz   = size === 'sm' ? 'px-3 py-1.5 text-[0.68rem]' : 'px-4 py-2.5 text-[0.76rem]'
  const variants: Record<BtnVariant, string> = {
    gold:    'bg-gradient-to-r from-[#c9a84c] via-[#e8c96d] to-[#c9a84c] text-[#0d0b08] font-medium shadow-[0_4px_18px_rgba(201,168,76,.28)] hover:shadow-[0_6px_28px_rgba(201,168,76,.45)] hover:-translate-y-px',
    outline: 'bg-transparent text-[#c9a84c] border border-[rgba(201,168,76,.3)] hover:bg-[rgba(201,168,76,.08)] hover:border-[#c9a84c]',
    ghost:   'bg-white/[0.04] text-[#8a7d6a] border border-white/[0.07] hover:bg-white/[0.09] hover:text-[#e8dcc8]',
  }
  return (
    <button className={`${base} ${sz} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

// ─── Play Button ─────────────────────────────────────────
export function PlayBtn({ onClick, isPlaying }: { onClick: () => void; isPlaying?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-[#c9a84c] to-[#e8c96d] text-[#0d0b08] shadow-[0_0_0_0_rgba(201,168,76,.35)] transition-all duration-300 hover:scale-[1.07] hover:shadow-[0_0_0_10px_rgba(201,168,76,.1)] ${isPlaying ? 'animate-pulse-gold' : ''}`}
    >
      <span className="ml-1 text-2xl">▶</span>
    </button>
  )
}

// ─── Feedback Bar ─────────────────────────────────────────
type FbState = 'idle' | 'correct' | 'wrong'
export function FeedbackBar({ state, children }: { state: FbState; children: ReactNode }) {
  const cls = {
    idle:    'bg-[rgba(22,18,13,.65)] border-[rgba(201,168,76,.1)] text-[#8a7d6a]',
    correct: 'bg-[rgba(76,175,130,.09)] border-[rgba(76,175,130,.35)] text-[#4caf82]',
    wrong:   'bg-[rgba(201,76,76,.09)] border-[rgba(201,76,76,.35)] text-[#c94c4c]',
  }[state]
  return (
    <div className={`flex h-12 items-center justify-center gap-2 rounded-xl border font-display text-base transition-all duration-300 ${cls}`}>
      {children}
    </div>
  )
}

// ─── Option Button ────────────────────────────────────────
type OptState = 'idle' | 'correct' | 'wrong' | 'reveal'
export function OptionBtn({
  children, onClick, state = 'idle', disabled
}: { children: ReactNode; onClick?: () => void; state?: OptState; disabled?: boolean }) {
  const cls = {
    idle:   'border-[rgba(201,168,76,.14)] bg-[rgba(22,18,13,.92)] text-[#e8dcc8] hover:border-[#c9a84c] hover:text-[#c9a84c] hover:bg-[rgba(201,168,76,.06)]',
    correct:'border-[#4caf82] bg-[rgba(76,175,130,.14)] text-[#4caf82]',
    wrong:  'border-[#c94c4c] bg-[rgba(201,76,76,.14)] text-[#c94c4c]',
    reveal: 'border-[rgba(76,175,130,.4)] bg-[rgba(76,175,130,.07)] text-[#4caf82]',
  }[state]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border p-2.5 text-center font-mono text-[0.72rem] tracking-wider transition-all duration-150 disabled:cursor-not-allowed ${cls}`}
    >
      {children}
    </button>
  )
}

// ─── Module Tabs ──────────────────────────────────────────
export function ModuleTabs<T extends string>({
  options, value, onChange
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full border px-3 py-1 font-mono text-[0.7rem] tracking-wider transition-all duration-200 ${
            o.value === value
              ? 'border-[rgba(201,168,76,.28)] bg-[rgba(201,168,76,.1)] text-[#c9a84c]'
              : 'border-white/[0.07] bg-white/[0.04] text-[#8a7d6a] hover:text-[#e8dcc8]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── Stat Box ─────────────────────────────────────────────
export function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-xl border border-[rgba(201,168,76,.1)] bg-[rgba(22,18,13,.88)] p-3 text-center">
      <div className="font-display text-2xl text-[#c9a84c]">{value}</div>
      <div className="mt-0.5 font-mono text-[0.6rem] tracking-[.14em] text-[#8a7d6a]">{label}</div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#7a6230] to-[#c9a84c] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ─── Note Bubble ─────────────────────────────────────────
export function NoteBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[rgba(201,168,76,.28)] bg-[rgba(201,168,76,.06)] font-display text-sm font-bold text-[#c9a84c]">
      {children}
    </div>
  )
}
