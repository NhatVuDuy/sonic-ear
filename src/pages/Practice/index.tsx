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

const STAGES: { id: Stage; num: string; label: string; emoji: string }[] = [
  { id: 'interval', num: '1', label: 'QUÃNG NHẠC', emoji: '↕' },
  { id: 'chord',    num: '2', label: 'HỢP ÂM',    emoji: '🎵' },
  { id: 'scale',    num: '3', label: 'ĐIỆU THỨC', emoji: '🎼' },
  { id: 'note',     num: '4', label: 'NỐT ĐƠN',   emoji: '♩' },
  { id: 'piano',    num: '★', label: 'ĐÀN TỰ DO', emoji: '🎹' },
]

const INFO: Record<Stage, string> = {
  interval: '<b style="color:#c084fc">Quãng nhạc</b> = khoảng cách cao độ.<br><br><b>P5</b> → "Star Wars"<br><b>P4</b> → "Here Comes the Bride"<br><b>M3</b> → "When the Saints"<br><b>m3</b> → "Smoke on the Water"<br><b>P8</b> → "Somewhere Over the Rainbow"',
  chord:    '<b style="color:#c084fc">Hợp âm</b> — nốt vang cùng nhau.<br><br><b>Major:</b> vui, sáng<br><b>Minor:</b> buồn, trầm<br><b>Dom7:</b> căng, muốn giải quyết<br><b>Maj7:</b> mơ màng, jazz<br><b>Dim:</b> u ám, bất an',
  scale:    '<b style="color:#c084fc">Điệu thức</b> = công thức khoảng cách nốt.<br><br><b>Major</b>: W-W-H-W-W-W-H (sáng)<br><b>Minor</b>: buồn, trầm<br><b>Harmonic Minor</b>: bí ẩn<br><b>Blues</b>: "xé lòng"<br><b>Pentatonic</b>: pop/rock',
  note:     '<b style="color:#c084fc">Cảm âm tuyệt đối vs tương đối</b><br><br><b>Tương đối</b>: nhận nốt dựa trên nốt tham chiếu.<br><br><b>Tuyệt đối</b>: nghe ra tên nốt ngay — bẩm sinh hoặc luyện rất lâu.',
  piano:    '<b style="color:#c084fc">Đàn tự do</b><br><br>Nhấn phím để chơi và lắng nghe sự khác biệt giữa Major và Minor.',
}

function demoScale(type: string) {
  const ns = buildScaleNotes(0, SCALES[type].steps, 4)
  audio.playScale(ns, 0.2)
}

export function PracticePage() {
  const { correct, wrong, streak, score, xp, level, currentStage, setStage } = useStore()
  const total = correct + wrong
  const acc = total ? Math.round(correct / total * 100) + '%' : '—'
  const need = level * 100

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

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 110px)' }}>

      {/* Stage tabs — floating pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.07] px-3 py-2.5 sm:px-6"
        style={{ background: 'rgba(6,4,20,0.7)', backdropFilter: 'blur(12px)' }}
      >
        {STAGES.map(s => {
          const active = s.id === currentStage
          return (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[.68rem] tracking-wider transition-all duration-200 cursor-pointer select-none ${
                active
                  ? 'text-white shadow-[0_0_16px_rgba(168,85,247,0.45)]'
                  : 'border border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
              style={active ? {
                background: 'linear-gradient(135deg,#7c3aed,#a855f7,#c026d3)',
                border: 'none',
              } : {}}
            >
              <span className="text-[.75rem]">{s.emoji}</span>
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Mobile stats bar */}
      <div className="md:hidden flex items-center gap-3 border-b border-white/[0.07] px-4 py-2.5" style={{ background: 'rgba(15,10,40,0.6)' }}>
        <div className="flex flex-1 gap-2">
          <StatBox value={correct} label="ĐÚNG" />
          <StatBox value={wrong} label="SAI" />
          <StatBox value={acc} label="%" />
        </div>
        <div className="w-20 flex-shrink-0">
          <div className="mb-1 flex justify-between font-mono text-[.58rem] text-slate-500">
            <span>Lv.{level}</span><span>{xp}/{need}</span>
          </div>
          <ProgressBar value={xp} max={need} />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* Sidebar — desktop only */}
        <div
          className="hidden md:flex w-72 min-w-[240px] flex-col gap-4 border-r border-white/[0.07] p-5"
          style={{ background: 'rgba(10,6,32,0.65)', backdropFilter: 'blur(16px)' }}
        >
          {/* Progress section */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-violet-500/60 via-cyan-400/50 to-pink-500/60" />
            <div className="mb-3 font-display text-[.82rem] font-semibold tracking-wide text-violet-300">
              ✦ Tiến độ hôm nay
            </div>
            <div className="flex gap-2">
              <StatBox value={correct} label="ĐÚNG" />
              <StatBox value={wrong} label="SAI" />
              <StatBox value={acc} label="CHÍNH XÁC" />
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between font-mono text-[.62rem] text-slate-500">
                <span className="text-violet-400">Level {level}</span>
                <span>{xp} / {need} XP</span>
              </div>
              <ProgressBar value={xp} max={need} />
            </div>
            {streak > 1 && (
              <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-orange-500/10 border border-orange-400/20 px-2.5 py-1.5">
                <span className="text-base">🔥</span>
                <span className="font-mono text-[.64rem] text-orange-300">{streak} đúng liên tiếp!</span>
              </div>
            )}
          </div>

          {/* Theory info */}
          <Card>
            <CardTitle>Lý thuyết</CardTitle>
            <div
              className="text-[.82rem] leading-relaxed text-slate-400"
              dangerouslySetInnerHTML={{ __html: INFO[currentStage] }}
            />
          </Card>

          {/* Reference piano */}
          <Card>
            <CardTitle>Bàn phím tham chiếu</CardTitle>
            <Piano startOctave={3} numOctaves={3} small />
            <div className="mt-2.5 flex gap-1.5">
              {['major', 'minor', 'blues'].map(t => (
                <Btn key={t} size="sm" className="flex-1" onClick={() => demoScale(t)}>
                  ▶ {t.charAt(0).toUpperCase() + t.slice(1)}
                </Btn>
              ))}
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
