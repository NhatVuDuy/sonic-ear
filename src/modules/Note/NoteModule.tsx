import { useState, useCallback, useEffect } from 'react'
import { NOTE_NAMES, NOTE_DISPLAY, shuffle } from '@/theory'
import { audio } from '@/audio/engine'
import { useStore } from '@/store'
import { Card, CardTitle, PlayBtn, FeedbackBar, OptionBtn } from '@/components/UI'
import { Piano } from '@/components/Piano'

interface Q { ni: number; ns: string; correct: string }

export function NoteModule() {
  const { onCorrect, onWrong } = useStore()
  const [q, setQ] = useState<Q | null>(null)
  const [opts, setOpts] = useState<string[]>([])
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const newQ = useCallback(() => {
    const ni = Math.floor(Math.random() * 12)
    const ns = NOTE_NAMES[ni] + '4'
    const correct = NOTE_DISPLAY[ni]
    const wrong = shuffle(NOTE_DISPLAY.filter((_,i)=>i!==ni)).slice(0,7)
    setQ({ ni, ns, correct })
    setOpts(shuffle([...wrong, correct]))
    setAnswered(false)
    setSelected(null)
    setTimeout(() => play(ns), 420)
  }, [])

  const play = (ns: string) => {
    setIsPlaying(true)
    audio.playNote(ns, 2.0, 0.85, 0)
    setTimeout(() => setIsPlaying(false), 1200)
  }

  const answer = (n: string) => {
    if (answered || !q) return
    setAnswered(true)
    setSelected(n)
    if (n === q.correct) onCorrect(8)
    else onWrong()
  }

  useEffect(() => { newQ() }, []) // eslint-disable-line
  if (!q) return null
  const ok = answered && selected === q.correct

  return (
    <div className="flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">
      <div>
        <div className="font-display italic text-[1rem] text-[#a8a4cc]">Nhận diện Nốt đơn</div>
        <p className="mt-1 text-[.82rem] text-[#a8a4cc]">Nghe một nốt và chọn tên nốt đúng</p>
      </div>
      <Card className="text-center">
        <div className="flex flex-col items-center gap-3 py-3">
          <PlayBtn onClick={() => play(q.ns)} isPlaying={isPlaying} />
          <div className="font-display text-[4.5rem] leading-none" style={{ color: answered ? (ok ? 'var(--color-ok)' : 'var(--color-bad)') : 'rgba(129,140,248,.35)' }}>
            {answered ? q.correct : '?'}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {opts.map(n => {
            const state = !answered?'idle': n===q.correct?'reveal': n===selected?'wrong':'idle'
            return <OptionBtn key={n} state={state} onClick={()=>answer(n)} disabled={answered}>
              <div className="font-display text-[1.05rem] text-[#c7d2fe]">{n}</div>
            </OptionBtn>
          })}
        </div>
      </Card>
      <FeedbackBar state={!answered?'idle':ok?'correct':'wrong'}>
        {!answered?'Nghe và chọn tên nốt'
          :ok?<>✓ Đúng! Nốt <b>{q.correct}</b><span className="cursor-pointer underline opacity-70 ml-2" onClick={newQ}>Tiếp →</span></>
          :<>✗ Sai. Đây là nốt <b>{q.correct}</b><span className="cursor-pointer underline opacity-70 ml-2" onClick={newQ}>Tiếp →</span></>}
      </FeedbackBar>
      <Card><CardTitle>Bàn phím — nhấn để so sánh</CardTitle>
        <Piano startOctave={3} numOctaves={3} highlighted={answered?[q.ns]:[]} /></Card>
    </div>
  )
}
