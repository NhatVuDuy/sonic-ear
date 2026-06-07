import { useEffect } from 'react'
import { useStore, Stage } from '@/store'
import { IntervalModule } from '@/modules/Interval'
import { ChordModule } from '@/modules/Chord'
import { ScaleModule } from '@/modules/Scale'
import { NoteModule } from '@/modules/Note'
import { FreePianoModule } from '@/modules/FreePiano'
import { Piano } from '@/components/Piano'
import { Card, CardTitle, StatBox, ProgressBar, Btn } from '@/components/UI'
import { SCALES, buildScaleNotes } from '@/theory'
import { audio } from '@/audio/engine'

// Each module has one accent color that permeates every element in that section.
// The color is injected as CSS custom properties on the wrapper div.
const MODULE_THEMES: Record<Stage, {
  accent: string   // solid color
  glow:   string   // rgba for glow/shadow
  subtle: string   // very transparent tint for bg
  label:  string   // display name
  emoji:  string
  info:   string   // theory text (with accent-colored bold)
}> = {
  interval: {
    accent: '#f43f5e',
    glow:   'rgba(244,63,94,0.42)',
    subtle: 'rgba(244,63,94,0.07)',
    label:  'QUÃNG NHẠC',
    emoji:  '↕',
    info:   '<b style="color:#fda4af">Quãng nhạc</b> = khoảng cách cao độ.<br><br><b>P5</b> → "Star Wars"<br><b>P4</b> → "Here Comes the Bride"<br><b>M3</b> → "When the Saints"<br><b>m3</b> → "Smoke on the Water"<br><b>P8</b> → "Somewhere Over the Rainbow"',
  },
  chord: {
    accent: '#f97316',
    glow:   'rgba(249,115,22,0.42)',
    subtle: 'rgba(249,115,22,0.07)',
    label:  'HỢP ÂM',
    emoji:  '♪',
    info:   '<b style="color:#fdba74">Hợp âm</b> — nốt vang cùng nhau.<br><br><b>Major:</b> vui, sáng<br><b>Minor:</b> buồn, trầm<br><b>Dom7:</b> căng, muốn giải quyết<br><b>Maj7:</b> mơ màng, jazz<br><b>Dim:</b> u ám, bất an',
  },
  scale: {
    accent: '#10b981',
    glow:   'rgba(16,185,129,0.42)',
    subtle: 'rgba(16,185,129,0.07)',
    label:  'ĐIỆU THỨC',
    emoji:  '🎼',
    info:   '<b style="color:#6ee7b7">Điệu thức</b> = công thức khoảng cách nốt.<br><br><b>Major</b>: W-W-H-W-W-W-H (sáng)<br><b>Minor</b>: buồn, trầm<br><b>Harmonic Minor</b>: bí ẩn<br><b>Blues</b>: "xé lòng"<br><b>Pentatonic</b>: pop/rock',
  },
  note: {
    accent: '#38bdf8',
    glow:   'rgba(56,189,248,0.42)',
    subtle: 'rgba(56,189,248,0.07)',
    label:  'NỐT ĐƠN',
    emoji:  '♩',
    info:   '<b style="color:#7dd3fc">Cảm âm tuyệt đối vs tương đối</b><br><br><b>Tương đối</b>: nhận nốt dựa trên nốt tham chiếu.<br><br><b>Tuyệt đối</b>: nghe ra tên nốt ngay — bẩm sinh hoặc luyện rất lâu.',
  },
  piano: {
    accent: '#a855f7',
    glow:   'rgba(168,85,247,0.42)',
    subtle: 'rgba(168,85,247,0.07)',
    label:  'ĐÀN TỰ DO',
    emoji:  '🎹',
    info:   '<b style="color:#d8b4fe">Đàn tự do</b><br><br>Nhấn phím để chơi và lắng nghe sự khác biệt giữa Major và Minor.',
  },
}

const STAGE_ORDER: Stage[] = ['interval', 'chord', 'scale', 'note', 'piano']

function demoScale(type: string) {
  const ns = buildScaleNotes(0, SCALES[type].steps, 4)
  audio.playScale(ns, 0.2)
}

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
        const pb = document.querySelector<HTMLButtonElement>('[data-playbtn]')
        pb?.click()
      }
      if (e.key >= '1' && e.key <= '8') {
        const i = parseInt(e.key) - 1
        const opts = document.querySelectorAll<HTMLButtonElement>('.ob-key:not([disabled])')
        opts[i]?.click()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Inject CSS vars for the current module — every child reads var(--accent)
  const cssVars = {
    '--accent':      theme.accent,
    '--accent-glow': theme.glow,
  } as React.CSSProperties

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 110px)', ...cssVars }}>

      {/* ── Stage tabs ─────────────────────────────────────── */}
      <div
        className="flex items-center overflow-x-auto border-b px-3 py-0 sm:px-5"
        style={{ background: 'rgba(12,9,16,0.85)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {STAGE_ORDER.map(id => {
          const t = MODULE_THEMES[id]
          const active = id === currentStage
          return (
            <button
              key={id}
              onClick={() => setStage(id)}
              className="relative flex flex-shrink-0 items-center gap-1.5 px-4 py-3.5 font-mono text-[.68rem] tracking-wider transition-all duration-200 cursor-pointer select-none"
              style={active ? { color: t.accent } : { color: '#475569' }}
            >
              <span className="text-[.8rem]">{t.emoji}</span>
              {t.label}
              {/* Accent bottom border on active */}
              {active && (
                <span
                  className="absolute inset-x-0 bottom-0 h-[2px] rounded-t-full"
                  style={{ background: t.accent }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Mobile stats bar ──────────────────────────────── */}
      <div className="md:hidden flex items-center gap-3 border-b px-4 py-2.5" style={{ background: 'rgba(12,9,16,0.7)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex flex-1 gap-2">
          <StatBox value={correct} label="ĐÚNG" />
          <StatBox value={wrong} label="SAI" />
          <StatBox value={acc} label="%" />
        </div>
        <div className="w-20 flex-shrink-0">
          <div className="mb-1.5 flex justify-between font-mono text-[.56rem] text-slate-600">
            <span>Lv.{level}</span><span>{xp}/{need}</span>
          </div>
          <ProgressBar value={xp} max={need} />
        </div>
      </div>

      {/* ── Main layout ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* Sidebar — desktop only */}
        <aside
          className="hidden md:flex w-[260px] min-w-[220px] flex-col gap-4 p-5"
          style={{
            background: 'rgba(10,7,15,0.75)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            /* Left accent strip */
            borderLeft: `3px solid ${theme.accent}`,
          }}
        >
          {/* Progress card */}
          <div className="relative overflow-hidden rounded-2xl p-4" style={{
            background: `radial-gradient(ellipse at 0% 0%, ${theme.subtle} 0%, rgba(255,255,255,0.02) 60%)`,
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div className="mb-2.5 font-mono text-[.62rem] tracking-[.14em]" style={{ color: theme.accent }}>
              ✦ TIẾN ĐỘ HÔM NAY
            </div>
            <div className="flex gap-2">
              <StatBox value={correct} label="ĐÚNG" />
              <StatBox value={wrong} label="SAI" />
              <StatBox value={acc} label="ACC" />
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between font-mono text-[.6rem]" style={{ color: '#475569' }}>
                <span style={{ color: theme.accent }}>Level {level}</span>
                <span>{xp} / {need} XP</span>
              </div>
              <ProgressBar value={xp} max={need} />
            </div>
            {streak > 1 && (
              <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-400/15 px-2.5 py-1.5">
                <span>🔥</span>
                <span className="font-mono text-[.62rem] text-amber-400">{streak} đúng liên tiếp</span>
              </div>
            )}
          </div>

          {/* Theory */}
          <Card>
            <CardTitle>Lý thuyết</CardTitle>
            <div
              className="text-[.81rem] leading-relaxed text-slate-500"
              dangerouslySetInnerHTML={{ __html: theme.info }}
            />
          </Card>

          {/* Reference piano */}
          <Card>
            <CardTitle>Bàn phím tham chiếu</CardTitle>
            <Piano startOctave={3} numOctaves={3} small />
            <div className="mt-2.5 flex gap-1.5">
              {['major', 'minor', 'blues'].map(t => (
                <Btn key={t} size="sm" className="flex-1" onClick={() => demoScale(t)}>
                  ▶ {t[0].toUpperCase() + t.slice(1)}
                </Btn>
              ))}
            </div>
          </Card>
        </aside>

        {/* Main content — subtle accent glow at top */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6"
          style={{
            background: `radial-gradient(ellipse 70% 35% at 50% 0%, ${theme.subtle} 0%, transparent 70%)`,
          }}
        >
          {currentStage === 'interval' && <IntervalModule />}
          {currentStage === 'chord'    && <ChordModule />}
          {currentStage === 'scale'    && <ScaleModule />}
          {currentStage === 'note'     && <NoteModule />}
          {currentStage === 'piano'    && <FreePianoModule />}
        </div>
      </div>
    </div>
  )
}
