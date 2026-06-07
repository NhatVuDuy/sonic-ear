import { ReactNode } from 'react'

// ─── Card ────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-xl border border-white/[0.10] bg-[#201b3e]/90 p-5 ${className}`}>
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#818cf8]/30 to-transparent" />
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <div className="font-display mb-3 text-sm tracking-wide text-[#818cf8]">{children}</div>
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
    gold:    'bg-gradient-to-r from-[#818cf8] via-[#c7d2fe] to-[#818cf8] text-[#0b0918] font-medium shadow-[0_4px_18px_rgba(129,140,248,.28)] hover:shadow-[0_6px_28px_rgba(129,140,248,.45)] hover:-translate-y-px',
    outline: 'bg-transparent text-[#818cf8] border border-[rgba(129,140,248,.3)] hover:bg-[rgba(129,140,248,.08)] hover:border-[#818cf8]',
    ghost:   'bg-white/[0.04] text-[#8880b4] border border-white/[0.07] hover:bg-white/[0.09] hover:text-[#ddd8f5]',
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
      className={`flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-[#818cf8] to-[#c7d2fe] text-[#0b0918] shadow-[0_0_0_0_rgba(129,140,248,.35)] transition-all duration-300 hover:scale-[1.07] hover:shadow-[0_0_0_10px_rgba(129,140,248,.1)] ${isPlaying ? 'animate-pulse-gold' : ''}`}
    >
      <span className="ml-1 text-2xl">▶</span>
    </button>
  )
}

// ─── Feedback Bar ─────────────────────────────────────────
type FbState = 'idle' | 'correct' | 'wrong'
export function FeedbackBar({ state, children }: { state: FbState; children: ReactNode }) {
  const cls = {
    idle:    'bg-[rgba(20,17,45,.65)] border-[rgba(129,140,248,.15)] text-[#b0acd8]',
    correct: 'bg-[rgba(52,211,153,.09)] border-[rgba(52,211,153,.35)] text-[#34d399]',
    wrong:   'bg-[rgba(248,113,113,.09)] border-[rgba(248,113,113,.35)] text-[#f87171]',
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
    idle:   'border-[rgba(129,140,248,.14)] bg-[rgba(20,17,45,.92)] text-[#ddd8f5] hover:border-[#818cf8] hover:text-[#818cf8] hover:bg-[rgba(129,140,248,.06)]',
    correct:'border-[#34d399] bg-[rgba(52,211,153,.14)] text-[#34d399]',
    wrong:  'border-[#f87171] bg-[rgba(248,113,113,.14)] text-[#f87171]',
    reveal: 'border-[rgba(52,211,153,.4)] bg-[rgba(52,211,153,.07)] text-[#34d399]',
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
              ? 'border-[rgba(129,140,248,.28)] bg-[rgba(129,140,248,.1)] text-[#818cf8]'
              : 'border-white/[0.07] bg-white/[0.04] text-[#8880b4] hover:text-[#ddd8f5]'
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
    <div className="flex-1 rounded-xl border border-[rgba(129,140,248,.1)] bg-[rgba(20,17,45,.88)] p-3 text-center">
      <div className="font-display text-2xl text-[#818cf8]">{value}</div>
      <div className="mt-0.5 font-mono text-[0.65rem] tracking-[.14em] text-[#a8a4cc]">{label}</div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#4338ca] to-[#818cf8] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ─── Note Bubble ─────────────────────────────────────────
export function NoteBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[rgba(129,140,248,.28)] bg-[rgba(129,140,248,.06)] font-display text-sm font-bold text-[#818cf8]">
      {children}
    </div>
  )
}
