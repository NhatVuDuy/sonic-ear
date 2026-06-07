import { ReactNode } from 'react'

// All colored elements read --accent / --accent-glow CSS vars
// injected by the Practice page wrapper, one value per module.

// ─── Card ────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 backdrop-blur-sm ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Top accent line — module color */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
        style={{ background: 'var(--accent, #a855f7)', opacity: 0.7 }} />
      {/* Subtle corner glow */}
      <div className="pointer-events-none absolute -top-8 left-0 h-16 w-32 rounded-full"
        style={{ background: 'var(--accent, #a855f7)', opacity: 0.06, filter: 'blur(20px)' }} />
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 font-display text-[.85rem] font-semibold tracking-wide"
      style={{ color: 'var(--accent, #c084fc)' }}>
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

  if (variant === 'gold') {
    return (
      <button
        className={`${base} ${sz} text-white font-medium hover:-translate-y-px ${className}`}
        onClick={onClick}
        disabled={disabled}
        style={{
          background: 'var(--accent, #a855f7)',
          boxShadow: '0 4px 18px var(--accent-glow, rgba(168,85,247,0.4))',
        }}
      >
        {children}
      </button>
    )
  }
  if (variant === 'outline') {
    return (
      <button
        className={`${base} ${sz} bg-transparent hover:-translate-y-px ${className}`}
        onClick={onClick}
        disabled={disabled}
        style={{
          color: 'var(--accent, #c084fc)',
          border: '1px solid color-mix(in srgb, var(--accent, #a855f7) 40%, transparent)',
        }}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      className={`${base} ${sz} bg-white/[0.05] text-slate-300 border border-white/[0.08] hover:bg-white/[0.10] hover:text-white ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// ─── Play Button — solid accent fill, ripple pulse ────────
export function PlayBtn({ onClick, isPlaying }: { onClick: () => void; isPlaying?: boolean }) {
  return (
    <button
      data-playbtn
      onClick={onClick}
      className={`flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 hover:brightness-110 active:scale-95 ${isPlaying ? 'animate-pulse-play' : ''}`}
      style={{
        background: 'var(--accent, #a855f7)',
        boxShadow: '0 0 32px var(--accent-glow, rgba(168,85,247,0.5))',
      }}
    >
      <span className="ml-1 text-3xl drop-shadow-lg">▶</span>
    </button>
  )
}

// ─── Feedback Bar ─────────────────────────────────────────
type FbState = 'idle' | 'correct' | 'wrong'
export function FeedbackBar({ state, children }: { state: FbState; children: ReactNode }) {
  // Correct/wrong use universal green/red — not accent — for clear semantic meaning
  const cls = {
    idle:    'bg-white/[0.02] border-white/[0.07] text-slate-500',
    correct: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    wrong:   'bg-rose-500/10 border-rose-500/30 text-rose-400',
  }[state]
  return (
    <div className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 font-display text-base transition-all duration-300 ${cls}`}>
      {children}
    </div>
  )
}

// ─── Option Button ────────────────────────────────────────
type OptState = 'idle' | 'correct' | 'wrong' | 'reveal'
export function OptionBtn({
  children, onClick, state = 'idle', disabled
}: { children: ReactNode; onClick?: () => void; state?: OptState; disabled?: boolean }) {
  if (state === 'idle') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="ob-key rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 text-center font-mono text-[0.72rem] tracking-wider text-slate-300 transition-all duration-150 disabled:cursor-not-allowed hover:-translate-y-px"
        style={{
          '--hover-border': 'var(--accent, #a855f7)',
        } as React.CSSProperties}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = 'color-mix(in srgb, var(--accent, #a855f7) 50%, transparent)'
          el.style.color = 'var(--accent, #c084fc)'
          el.style.background = 'color-mix(in srgb, var(--accent, #a855f7) 8%, transparent)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = ''
          el.style.color = ''
          el.style.background = ''
        }}
      >
        {children}
      </button>
    )
  }
  const cls = {
    correct: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    wrong:   'border-rose-500/40 bg-rose-500/10 text-rose-400',
    reveal:  'border-emerald-500/35 bg-emerald-500/10 text-emerald-400',
  }[state]
  return (
    <button
      disabled={disabled}
      className={`ob-key rounded-2xl border p-3 text-center font-mono text-[0.72rem] tracking-wider transition-all duration-150 disabled:cursor-not-allowed ${cls}`}
    >
      {children}
    </button>
  )
}

// ─── Module Tabs — all tabs same accent when active ────────
export function ModuleTabs<T extends string>({
  options, value, onChange
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {options.map(o => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className="rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] tracking-wider transition-all duration-200"
            style={active ? {
              background: 'var(--accent, #a855f7)',
              color: '#fff',
              boxShadow: '0 0 12px var(--accent-glow, rgba(168,85,247,0.4))',
              border: 'none',
            } : {
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#64748b',
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
    <div className="flex-1 rounded-2xl p-3 text-center" style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div className="font-display text-2xl font-semibold" style={{ color: 'var(--accent, #a855f7)' }}>
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[0.6rem] tracking-[.14em] text-slate-600">{label}</div>
    </div>
  )
}

// ─── Progress Bar — accent color fill ─────────────────────
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: 'var(--accent, #a855f7)' }}
      />
    </div>
  )
}

// ─── Note Bubble — accent fill ────────────────────────────
export function NoteBubble({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-full font-display text-base font-bold text-white"
      style={{
        background: 'var(--accent, #a855f7)',
        boxShadow: '0 0 24px var(--accent-glow, rgba(168,85,247,0.45))',
      }}
    >
      {children}
    </div>
  )
}
