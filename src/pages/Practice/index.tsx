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

const STAGES: { id: Stage; num: string; label: string }[] = [
  { id: 'interval', num: '1', label: 'QUÃNG NHẠC' },
  { id: 'chord',    num: '2', label: 'HỢP ÂM' },
  { id: 'scale',    num: '3', label: 'ĐIỆU THỨC' },
  { id: 'note',     num: '4', label: 'NỐT ĐƠN' },
  { id: 'piano',    num: '★', label: 'ĐÀN TỰ DO' },
]

const INFO: Record<Stage, string> = {
  interval: '<b style="color:#c9a84c">Quãng nhạc</b> = khoảng cách cao độ.<br><br><b>P5</b> → "Star Wars"<br><b>P4</b> → "Here Comes the Bride"<br><b>M3</b> → "When the Saints"<br><b>m3</b> → "Smoke on the Water"<br><b>P8</b> → "Somewhere Over the Rainbow"',
  chord:    '<b style="color:#c9a84c">Hợp âm</b> — nốt vang cùng nhau.<br><br><b>Major:</b> vui, sáng<br><b>Minor:</b> buồn, trầm<br><b>Dom7:</b> căng, muốn giải quyết<br><b>Maj7:</b> mơ màng, jazz<br><b>Dim:</b> u ám, bất an',
  scale:    '<b style="color:#c9a84c">Điệu thức</b> = công thức khoảng cách nốt.<br><br><b>Major</b>: W-W-H-W-W-W-H (sáng)<br><b>Minor</b>: buồn, trầm<br><b>Harmonic Minor</b>: bí ẩn<br><b>Blues</b>: "xé lòng"<br><b>Pentatonic</b>: pop/rock',
  note:     '<b style="color:#c9a84c">Cảm âm tuyệt đối vs tương đối</b><br><br><b>Tương đối</b>: nhận nốt dựa trên nốt tham chiếu.<br><br><b>Tuyệt đối</b>: nghe ra tên nốt ngay — bẩm sinh hoặc luyện rất lâu.',
  piano:    '<b style="color:#c9a84c">Đàn tự do</b><br><br>Nhấn phím để chơi và lắng nghe sự khác biệt giữa Major và Minor.',
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

  // Keyboard shortcuts
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
      {/* Stage tabs */}
      <div className="flex overflow-x-auto border-b border-white/[0.08] bg-[rgba(13,11,8,.55)] px-2 sm:px-8">
        {STAGES.map(s => (
          <button
            key={s.id}
            onClick={() => setStage(s.id)}
            className={`flex-shrink-0 border-b-2 px-3 sm:px-5 py-3 font-mono text-[.7rem] sm:text-[.75rem] tracking-[.08em] sm:tracking-[.12em] transition-all duration-300 cursor-pointer select-none ${
              s.id === currentStage
                ? 'border-[#c9a84c] text-[#c9a84c]'
                : 'border-transparent text-[#8a7d6a] hover:text-[#c9a84c]'
            }`}
          >
            <span className={`mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[.58rem] text-[#0d0b08] ${s.id===currentStage?'bg-[#c9a84c]':'bg-[#7a6230]'}`}>{s.num}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Mobile stats bar */}
      <div className="md:hidden flex items-center gap-3 border-b border-white/[0.08] bg-[rgba(18,15,11,.65)] px-4 py-2">
        <div className="flex flex-1 gap-2">
          <StatBox value={correct} label="ĐÚNG" />
          <StatBox value={wrong} label="SAI" />
          <StatBox value={acc} label="%" />
        </div>
        <div className="w-20 flex-shrink-0">
          <div className="mb-1 flex justify-between font-mono text-[.58rem] text-[#8a7d6a]">
            <span>Lv.{level}</span><span>{xp}/{need}</span>
          </div>
          <ProgressBar value={xp} max={need} />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left panel — desktop only */}
        <div className="hidden md:flex w-72 min-w-[240px] flex-col gap-4 border-r border-white/[0.08] bg-[rgba(18,15,11,.65)] p-5">
          <div>
            <div className="font-display mb-2 italic text-[#8a7d6a]">Tiến độ hôm nay</div>
            <div className="flex gap-2">
              <StatBox value={correct} label="ĐÚNG" />
              <StatBox value={wrong} label="SAI" />
              <StatBox value={acc} label="CHÍNH XÁC" />
            </div>
            <div className="mt-2.5">
              <div className="mb-1 flex justify-between font-mono text-[.64rem] text-[#8a7d6a]">
                <span>Level {level}</span>
                <span>{xp} / {need} XP</span>
              </div>
              <ProgressBar value={xp} max={need} />
            </div>
          </div>

          <Card>
            <CardTitle>Lý thuyết</CardTitle>
            <div
              className="text-[.83rem] leading-relaxed text-[#8a7d6a]"
              dangerouslySetInnerHTML={{ __html: INFO[currentStage] }}
            />
          </Card>

          <Card>
            <CardTitle>Bàn phím tham chiếu</CardTitle>
            <Piano startOctave={3} numOctaves={3} small />
            <div className="mt-2.5 flex gap-1.5">
              {['major','minor','blues'].map(t => (
                <Btn key={t} size="sm" className="flex-1" onClick={() => demoScale(t)}>
                  ▶ {t.charAt(0).toUpperCase()+t.slice(1)}
                </Btn>
              ))}
            </div>
          </Card>
        </div>

        {/* Right panel */}
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
