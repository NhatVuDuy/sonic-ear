import { useEffect } from 'react'
import { useStore, Stage } from '@/store'
import { IntervalModule } from '@/modules/Interval'
import { ChordModule } from '@/modules/Chord'
import { ScaleModule } from '@/modules/Scale'
import { NoteModule } from '@/modules/Note'
import { FreePianoModule } from '@/modules/FreePiano'
import { ProgressBar, StatBox } from '@/components/UI'

// Kids theme: no sidebar, single-column layout, bright stage cards.
const MODULE_THEMES: Record<Stage, {
  accent: string
  glow:   string
  subtle: string
  label:  string
  emoji:  string
}> = {
  interval: { accent: '#ff6b6b', glow: 'rgba(255,107,107,0.45)', subtle: 'rgba(255,107,107,0.07)', label: 'Quãng Nhạc', emoji: '🎯' },
  chord:    { accent: '#ff9f43', glow: 'rgba(255,159,67,0.45)',  subtle: 'rgba(255,159,67,0.07)',  label: 'Hợp Âm',    emoji: '🎸' },
  scale:    { accent: '#26de81', glow: 'rgba(38,222,129,0.45)',  subtle: 'rgba(38,222,129,0.07)',  label: 'Điệu Thức', emoji: '🎼' },
  note:     { accent: '#4d96ff', glow: 'rgba(77,150,255,0.45)',  subtle: 'rgba(77,150,255,0.07)',  label: 'Nốt Đơn',   emoji: '🎵' },
  piano:    { accent: '#a29bfe', glow: 'rgba(162,155,254,0.45)', subtle: 'rgba(162,155,254,0.07)', label: 'Đàn Tự Do', emoji: '🎹' },
}

const STAGE_ORDER: Stage[] = ['interval', 'chord', 'scale', 'note', 'piano']

export function PracticePage() {
  const { correct, wrong, streak, xp, level, currentStage, setStage } = useStore()
  const total = correct + wrong
  const acc = total ? Math.round(correct / total * 100) + '%' : '—'
  const need = level * 100
  const theme = MODULE_THEMES[currentStage]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        document.querySelector<HTMLButtonElement>('[data-playbtn]')?.click()
      }
      if (e.key >= '1' && e.key <= '8') {
        const opts = document.querySelectorAll<HTMLButtonElement>('.ob-key:not([disabled])')
        opts[parseInt(e.key) - 1]?.click()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const cssVars = { '--accent': theme.accent, '--accent-glow': theme.glow } as React.CSSProperties

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 110px)', ...cssVars }}>

      {/* ── Gamification bar ──────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6"
        style={{ background: 'rgba(255,253,245,0.92)', borderBottom: '2px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
      >
        {/* Stars */}
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[.72rem] font-bold"
          style={{ background: 'rgba(255,211,61,0.2)', color: '#b45309' }}>
          ⭐ {correct} sao
        </div>

        {/* Streak — only shown when active */}
        {streak > 1 && (
          <div
            className="flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-[.72rem] font-bold animate-bounce-in"
            style={{ background: 'rgba(255,107,107,0.15)', color: '#dc2626' }}
          >
            🔥 {streak} liên tiếp!
          </div>
        )}

        {/* Level + XP */}
        <div className="ml-auto flex items-center gap-2.5">
          <div className="font-display text-[.85rem] font-bold" style={{ color: theme.accent }}>
            Lv.{level}
          </div>
          <div className="hidden sm:block w-28">
            <ProgressBar value={xp} max={need} />
          </div>
          <div className="font-mono text-[.62rem]" style={{ color: '#aaa' }}>{xp}/{need} XP</div>
        </div>
      </div>

      {/* ── Stage selector — large emoji cards ────────────────────────── */}
      <div className="px-4 pt-4 pb-2 sm:px-6" style={{ background: 'rgba(255,253,245,0.75)' }}>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {STAGE_ORDER.map(id => {
            const t = MODULE_THEMES[id]
            const active = id === currentStage
            return (
              <button
                key={id}
                onClick={() => setStage(id)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition-all duration-200 cursor-pointer active:scale-95 hover:scale-[1.04]"
                style={active ? {
                  background: t.accent,
                  color: 'white',
                  boxShadow: `0 4px 18px ${t.glow}, 0 2px 0 rgba(0,0,0,0.10)`,
                  minWidth: '88px',
                } : {
                  background: 'white',
                  color: '#6b7280',
                  border: '2px solid #e5e7eb',
                  minWidth: '88px',
                }}
              >
                <span className="text-[1.5rem] leading-none">{t.emoji}</span>
                <span className="font-mono text-[0.6rem] tracking-wider font-bold leading-tight text-center">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Quick stats ───────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 py-2 sm:px-6"
        style={{ background: 'rgba(255,253,245,0.6)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      >
        <StatBox value={correct} label="ĐÚNG" />
        <StatBox value={wrong}   label="SAI" />
        <StatBox value={acc}     label="%" />
      </div>

      {/* ── Module content — full width, no sidebar ───────────────────── */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6"
        style={{
          background: `radial-gradient(ellipse 80% 40% at 50% 0%, ${theme.subtle} 0%, transparent 70%)`,
        }}
      >
        {currentStage === 'interval' && <IntervalModule />}
        {currentStage === 'chord'    && <ChordModule />}
        {currentStage === 'scale'    && <ScaleModule />}
        {currentStage === 'note'     && <NoteModule />}
        {currentStage === 'piano'    && <FreePianoModule />}
      </div>
    </div>
  )
}
