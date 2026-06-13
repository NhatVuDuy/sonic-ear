import { useState, useCallback, useEffect } from 'react'
import { INTERVALS, Interval, shuffle, pick, NOTE_NAMES, NOTE_DISPLAY, shiftNote } from '@/theory'
import { audio } from '@/audio/engine'
import { useStore } from '@/store'
import { useSRStore, srWeightedPick } from '@/store/sr'
import { Card, CardTitle, PlayBtn, FeedbackBar, OptionBtn, ModuleTabs, NoteBubble } from '@/components/UI'
import { Piano } from '@/components/Piano'

type Mode = 'basic' | 'medium' | 'all'

interface Q { iv: Interval; n1: string; n2: string }

function getPool(mode: Mode): Interval[] {
  if (mode === 'basic')  return INTERVALS.filter(i => [2,4,5,7,12].includes(i.s))
  if (mode === 'medium') return INTERVALS.filter(i => i.s <= 9)
  return INTERVALS
}

export function IntervalModule() {
  const { onCorrect, onWrong } = useStore()
  const { record: srRecord } = useSRStore()
  const [mode, setMode] = useState<Mode>('basic')
  const [q, setQ] = useState<Q | null>(null)
  const [opts, setOpts] = useState<Interval[]>([])
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const newQ = useCallback((m: Mode = mode) => {
    const pool = getPool(m)
    const iv = srWeightedPick(pool, iv => `iv:${iv.s}`)
    const ri = Math.floor(Math.random() * 9)
    const n1 = NOTE_NAMES[ri] + '4'
    const n2 = shiftNote(ri, iv.s, 4)
    const wrong = shuffle(pool.filter(x => x.s !== iv.s)).slice(0, 5)
    setQ({ iv, n1, n2 })
    setOpts(shuffle([...wrong, iv]))
    setAnswered(false)
    setSelected(null)
    setTimeout(() => play(n1, n2), 480)
  }, [mode])

  const play = (n1: string, n2: string) => {
    setIsPlaying(true)
    audio.playNote(n1, 1.0, 0.8, 0)
    audio.playNote(n2, 1.0, 0.8, 0.55)
    setTimeout(() => setIsPlaying(false), 1400)
  }

  const answer = (s: number) => {
    if (answered || !q) return
    setAnswered(true)
    setSelected(s)
    const ok = s === q.iv.s
    srRecord(`iv:${q.iv.s}`, ok)
    if (ok) onCorrect(12)
    else onWrong()
  }

  // Init on first render
  useEffect(() => { newQ() }, []) // eslint-disable-line

  if (!q) return null

  const ok = answered && selected === q.iv.s

  return (
    <div className="flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">
      <div>
        <div className="font-display italic text-[1rem] t-dim">Nhận diện Quãng</div>
        <ModuleTabs
          options={[
            { value: 'basic' as Mode,  label: 'Cơ bản' },
            { value: 'medium' as Mode, label: 'Trung cấp' },
            { value: 'all' as Mode,    label: 'Tất cả 13' },
          ]}
          value={mode}
          onChange={m => { setMode(m); newQ(m) }}
        />
      </div>

      <Card>
        <div className="flex items-center justify-center gap-5 py-4">
          <PlayBtn onClick={() => play(q.n1, q.n2)} isPlaying={isPlaying} />
          <div className="text-center">
            <div className="flex items-center gap-3 justify-center">
              <NoteBubble>{answered ? NOTE_DISPLAY[NOTE_NAMES.indexOf(q.n1.slice(0,-1) as any)] : '?'}</NoteBubble>
              <span className="t-dim">→</span>
              <NoteBubble>{answered ? NOTE_DISPLAY[NOTE_NAMES.indexOf(q.n2.replace(/\d/,'') as any)] : '?'}</NoteBubble>
            </div>
            <p className="mt-2 hidden sm:block font-mono text-[0.7rem] t-dim">Space = phát lại · 1–{opts.length} = đáp án</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {opts.map(o => {
            const state = !answered ? 'idle'
              : o.s === q.iv.s ? 'reveal'
              : o.s === selected ? 'wrong'
              : 'idle'
            return (
              <OptionBtn key={o.s} state={state} onClick={() => answer(o.s)} disabled={answered}>
                <div className="text-sm t-lbl">{o.abbr}</div>
                <div className="mt-0.5 text-[0.68rem]">{o.vn}</div>
                {answered && o.s === q.iv.s && o.mnemonic && (
                  <div className="mt-1 text-[0.6rem] opacity-60 italic">{o.mnemonic}</div>
                )}
              </OptionBtn>
            )
          })}
        </div>
      </Card>

      <FeedbackBar state={!answered ? 'idle' : ok ? 'correct' : 'wrong'}>
        {!answered
          ? 'Nhấn ▶ để nghe, rồi chọn đáp án'
          : ok
            ? <>✓ Đúng! <b>{q.iv.vn}</b> <span className="cursor-pointer underline opacity-70 ml-2" onClick={() => newQ()}>Câu tiếp →</span></>
            : <>✗ Sai. Đáp án: <b>{q.iv.vn}</b> <span className="cursor-pointer underline opacity-70 ml-2" onClick={() => newQ()}>Tiếp →</span></>
        }
      </FeedbackBar>

      <Card>
        <CardTitle>Bàn phím — Oct 3–5</CardTitle>
        <Piano startOctave={3} numOctaves={3} highlighted={answered ? [q.n1, q.n2] : []} />
      </Card>
    </div>
  )
}
