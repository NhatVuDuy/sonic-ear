import { ReactNode } from 'react'

// All accent-colored elements use --accent / --accent-dark / --accent-glow CSS vars.
// Structural colors (bg, text, borders) use --t-* theme vars set by applyTheme().

// ─── Card ─────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 ${className}`}
      style={{
        background: 'var(--t-card-bg, rgba(255,255,255,0.92))',
        border: '2px solid color-mix(in srgb, var(--accent, #ff6b6b) 22%, transparent)',
        boxShadow: '0 4px 24px var(--t-card-shadow, rgba(255,107,107,0.08)), 0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[4px] rounded-t-3xl"
        style={{ background: 'var(--accent, #ff6b6b)' }} />
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 font-display text-[1rem] font-bold"
      style={{ color: 'var(--accent-dark, var(--accent, #c92a2a))' }}>
      {children}
    </div>
  )
}

// ─── Buttons ──────────────────────────────────────────────────────────────
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
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-full font-mono tracking-wider transition-all duration-200 cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed active:scale-95'
  const sz = size === 'sm' ? 'px-4 py-2 text-[0.7rem]' : 'px-6 py-3 text-[0.8rem]'

  if (variant === 'gold') {
    return (
      <button
        className={`${base} ${sz} text-white font-bold hover:scale-105 ${className}`}
        onClick={onClick}
        disabled={disabled}
        style={{
          background: 'var(--accent, #ff6b6b)',
          boxShadow: '0 4px 16px var(--accent-glow, rgba(255,107,107,0.4)), 0 2px 0 rgba(0,0,0,0.10)',
        }}
      >
        {children}
      </button>
    )
  }
  if (variant === 'outline') {
    return (
      <button
        className={`${base} ${sz} hover:scale-105 ${className}`}
        onClick={onClick}
        disabled={disabled}
        style={{
          background: 'var(--t-opt-bg, white)',
          color: 'var(--accent, #ff6b6b)',
          border: '2px solid var(--accent, #ff6b6b)',
        }}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      className={`${base} ${sz} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'var(--t-opt-bg, white)',
        border: '2px solid var(--t-opt-border, #e5e7eb)',
        color: 'var(--t-opt-text, #6b7280)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent, #ff6b6b)'
        e.currentTarget.style.color = 'var(--accent-dark, var(--accent, #c92a2a))'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.color = ''
      }}
    >
      {children}
    </button>
  )
}

// ─── Play Button ──────────────────────────────────────────────────────────
export function PlayBtn({ onClick, isPlaying }: { onClick: () => void; isPlaying?: boolean }) {
  return (
    <button
      data-playbtn
      onClick={onClick}
      className={`flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95 ${isPlaying ? 'animate-pulse-kids' : 'animate-float'}`}
      style={{
        background: 'linear-gradient(135deg, var(--accent, #ff6b6b), color-mix(in srgb, var(--accent, #ff6b6b) 65%, #ff9f43))',
        boxShadow: '0 6px 24px var(--accent-glow, rgba(255,107,107,0.5)), 0 3px 0 rgba(0,0,0,0.10)',
      } as React.CSSProperties}
    >
      <span className="ml-1 text-4xl drop-shadow">▶</span>
    </button>
  )
}

// ─── Feedback Bar ─────────────────────────────────────────────────────────
type FbState = 'idle' | 'correct' | 'wrong'
export function FeedbackBar({ state, children }: { state: FbState; children: ReactNode }) {
  const s = state === 'idle'
    ? { background: 'var(--t-fb-idle-bg, rgba(255,255,255,0.7))', border: 'var(--t-fb-idle-border, 2px dashed #e5e7eb)', color: 'var(--t-fb-idle-text, #9ca3af)' }
    : state === 'correct'
    ? { background: 'rgba(38,222,129,0.12)',  border: '2px solid rgba(38,222,129,0.5)',   color: '#059669' }
    : { background: 'rgba(255,107,107,0.10)', border: '2px solid rgba(255,107,107,0.4)', color: '#dc2626' }

  return (
    <div className="flex min-h-16 items-center justify-center gap-2 rounded-3xl px-4 font-display text-base transition-all duration-300"
      style={s}>
      {children}
    </div>
  )
}

// ─── Option Button ────────────────────────────────────────────────────────
type OptState = 'idle' | 'correct' | 'wrong' | 'reveal'
export function OptionBtn({
  children, onClick, state = 'idle', disabled
}: { children: ReactNode; onClick?: () => void; state?: OptState; disabled?: boolean }) {
  if (state === 'idle') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="ob-key rounded-2xl p-4 text-center font-mono text-[0.8rem] tracking-wider transition-all duration-150 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-95"
        style={{
          background: 'var(--t-opt-bg, white)',
          border: '2px solid var(--t-opt-border, #e5e7eb)',
          color: 'var(--t-opt-text, #6b7280)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = 'var(--accent-dark, var(--accent, #c92a2a))'
          el.style.color = 'var(--accent-dark, var(--accent, #c92a2a))'
          el.style.background = 'color-mix(in srgb, var(--accent, #ff6b6b) 8%, var(--t-opt-bg, white))'
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
  const s = {
    correct: { background: 'rgba(38,222,129,0.15)',  border: '2px solid #26de81',             color: '#059669' },
    wrong:   { background: 'rgba(255,107,107,0.12)', border: '2px solid #ff6b6b',             color: '#dc2626' },
    reveal:  { background: 'rgba(38,222,129,0.12)',  border: '2px solid rgba(38,222,129,0.6)', color: '#059669' },
  }[state]
  return (
    <button
      disabled={disabled}
      className="ob-key rounded-2xl p-4 text-center font-mono text-[0.8rem] tracking-wider transition-all duration-150 disabled:cursor-not-allowed"
      style={s}
    >
      {children}
    </button>
  )
}

// ─── Module Tabs ──────────────────────────────────────────────────────────
export function ModuleTabs<T extends string>({
  options, value, onChange
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map(o => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className="rounded-full px-4 py-2 font-mono text-[0.72rem] tracking-wider font-bold transition-all duration-200 active:scale-95"
            style={active ? {
              background: 'var(--accent, #ff6b6b)',
              color: '#fff',
              boxShadow: '0 4px 12px var(--accent-glow, rgba(255,107,107,0.4))',
              border: 'none',
            } : {
              border: '2px solid var(--t-tab-border, #e5e7eb)',
              background: 'var(--t-tab-bg, white)',
              color: 'var(--t-tab-text, #6b7280)',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Stat Box ─────────────────────────────────────────────────────────────
export function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-2xl p-3 text-center" style={{
      background: 'var(--t-stat-bg, rgba(255,255,255,0.85))',
      border: '2px solid var(--t-stat-border, #f3f4f6)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div className="font-display text-2xl font-bold" style={{ color: 'var(--accent-dark, var(--accent, #c92a2a))' }}>
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[0.6rem] tracking-[.12em]" style={{ color: 'var(--t-stat-lbl, #9ca3af)' }}>{label}</div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-3 overflow-hidden rounded-full" style={{ background: 'var(--t-progressbar-track, #f3f4f6)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--accent, #ff6b6b), color-mix(in srgb, var(--accent, #ff6b6b) 55%, #ffd93d))',
        }}
      />
    </div>
  )
}

// ─── Note Bubble ──────────────────────────────────────────────────────────
export function NoteBubble({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-full font-display text-lg font-bold text-white animate-bounce-in"
      style={{
        background: 'linear-gradient(135deg, var(--accent, #ff6b6b), color-mix(in srgb, var(--accent, #ff6b6b) 60%, #ff9f43))',
        boxShadow: '0 4px 20px var(--accent-glow, rgba(255,107,107,0.45)), 0 2px 0 rgba(0,0,0,0.08)',
      }}
    >
      {children}
    </div>
  )
}
