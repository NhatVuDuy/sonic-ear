import { useEffect } from 'react'
import { useStore, Stage } from '@/store'
import { THEMES } from '@/theme'
import { IntervalModule } from '@/modules/Interval'
import { ChordModule } from '@/modules/Chord'
import { ScaleModule } from '@/modules/Scale'
import { NoteModule } from '@/modules/Note'
import { FreePianoModule } from '@/modules/FreePiano'
import { ProgressBar, StatBox } from '@/components/UI'
import { AdBanner } from '@/components/AdBanner'

const STAGE_ORDER: Stage[] = ['interval', 'chord', 'scale', 'note', 'piano']

export function PracticePage() {
  const { correct, wrong, streak, xp, level, currentStage, setStage, themeId } = useStore()
  const total = correct + wrong
  const acc = total ? Math.round(correct / total * 100) + '%' : '—'
  const need = level * 100
  const theme = THEMES[themeId]
  const ma = theme.moduleAccents[currentStage]

  const cssVars = {
    '--accent':      ma.accent,
    '--accent-dark': ma.accentDark,
    '--accent-glow': ma.glow,
  } as React.CSSProperties

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

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 110px)', ...cssVars }}>

      {/* ── Gamification bar ────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6"
        style={{
          background: 'var(--t-gamebar-bg)',
          borderBottom: 'var(--t-gamebar-border)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        }}
      >
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[.72rem] font-bold"
          style={{ background: 'var(--t-stars-bg)', color: 'var(--t-stars-text)' }}
        >
          ⭐ {correct} sao
        </div>

        {streak > 1 && (
          <div
            className="flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-[.72rem] font-bold animate-bounce-in"
            style={{ background: 'rgba(255,107,107,0.15)', color: '#dc2626' }}
          >
            🔥 {streak} liên tiếp!
          </div>
        )}

        <div className="ml-auto flex items-center gap-2.5">
          <div className="font-display text-[.85rem] font-bold" style={{ color: 'var(--accent-dark, var(--accent))' }}>
            Lv.{level}
          </div>
          <div className="hidden sm:block w-28">
            <ProgressBar value={xp} max={need} />
          </div>
          <div className="font-mono text-[.62rem]" style={{ color: 'var(--t-xp-text, #666)' }}>{xp}/{need} XP</div>
        </div>
      </div>

      {/* ── Stage selector ──────────────────────────────────────────── */}
      <div
        className="px-4 pt-4 pb-2 sm:px-6"
        style={{ background: 'var(--t-stage-bar-bg)' }}
      >
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {STAGE_ORDER.map(id => {
            const a = theme.moduleAccents[id]
            const active = id === currentStage
            return (
              <button
                key={id}
                onClick={() => setStage(id)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition-all duration-200 cursor-pointer active:scale-95 hover:scale-[1.04]"
                style={active ? {
                  background: a.accent,
                  color: 'white',
                  boxShadow: `0 4px 18px ${a.glow}, 0 2px 0 rgba(0,0,0,0.10)`,
                  minWidth: '88px',
                } : {
                  background: 'var(--t-stage-btn-bg)',
                  color: 'var(--t-stage-btn-color)',
                  border: 'var(--t-stage-btn-border)',
                  minWidth: '88px',
                }}
              >
                <span className="text-[1.5rem] leading-none">{a.emoji}</span>
                <span className="font-mono text-[0.6rem] tracking-wider font-bold leading-tight text-center">{a.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Quick stats ─────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 py-2 sm:px-6"
        style={{
          background: 'var(--t-stats-bar-bg)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <StatBox value={correct} label="ĐÚNG" />
        <StatBox value={wrong}   label="SAI" />
        <StatBox value={acc}     label="%" />
      </div>

      {/* ── Module content ─────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6"
        style={{
          background: `radial-gradient(ellipse 80% 40% at 50% 0%, ${ma.subtle} 0%, transparent 70%)`,
        }}
      >
        {currentStage === 'interval' && <IntervalModule />}
        {currentStage === 'chord'    && <ChordModule />}
        {currentStage === 'scale'    && <ScaleModule />}
        {currentStage === 'note'     && <NoteModule />}
        {currentStage === 'piano'    && <FreePianoModule />}
      </div>

      {/* ── Bottom banner ad ───────────────────────────────────────── */}
      <div className="flex justify-center px-4 py-2">
        <AdBanner size="banner" />
      </div>
    </div>
  )
}
