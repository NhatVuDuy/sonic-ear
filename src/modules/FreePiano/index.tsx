import { SCALES, CHORDS, buildScaleNotes, shiftNote } from '@/theory'
import { audio } from '@/audio/engine'
import { useState } from 'react'
import { Card, CardTitle, Btn } from '@/components/UI'
import { Piano } from '@/components/Piano'

export function FreePianoModule() {
  const [highlighted, setHighlighted] = useState<string[]>([])

  const hl = (notes: string[], ms = 2200) => {
    setHighlighted(notes)
    setTimeout(() => setHighlighted([]), ms)
  }

  const playScale = (key: string) => {
    const sc = SCALES[key]
    const ns = buildScaleNotes(0, sc.steps, 4)
    audio.playScale(ns, 0.2)
    hl(ns, ns.length * 220 + 800)
  }

  const playChord = (key: string) => {
    const ch = CHORDS[key]
    const ns = ch.sem.map(s => shiftNote(0, s, 4))
    audio.playNotes(ns, false)
    hl(ns, 2200)
  }

  return (
    <div className="flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">
      <div>
        <div className="font-display italic text-[1rem] text-[#a89880]">Piano Tự do</div>
        <p className="mt-1 text-[.82rem] text-[#a89880]">Nhấn phím để chơi · Scroll ngang để xem thêm</p>
      </div>
      <Card>
        <Piano startOctave={3} numOctaves={3} highlighted={highlighted} />
        <div className="mt-3">
          <div className="mb-2 font-mono text-[.68rem] uppercase tracking-widest text-[#a89880]">Nghe Gam</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SCALES).map(([k, s]) => (
              <Btn key={k} size="sm" onClick={() => playScale(k)}>▶ {s.name}</Btn>
            ))}
          </div>
        </div>
      </Card>
      <Card>
        <CardTitle>Hợp âm từ C</CardTitle>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CHORDS).map(([k, c]) => (
            <Btn key={k} size="sm" variant="outline" onClick={() => playChord(k)}>C {c.name}</Btn>
          ))}
        </div>
      </Card>
    </div>
  )
}
