import { useState, useCallback, useEffect } from 'react'
import { CHORDS, ChordDef, shuffle, pick, NOTE_NAMES, NOTE_DISPLAY, shiftNote } from '@/theory'
import { audio } from '@/audio/engine'
import { useStore } from '@/store'
import { useSRStore, srWeightedPick } from '@/store/sr'
import { Card, CardTitle, PlayBtn, FeedbackBar, OptionBtn, ModuleTabs, Btn } from '@/components/UI'
import { Piano } from '@/components/Piano'

type Mode = 'basic' | 'triads' | 'all'
interface Q { ck: string; ch: ChordDef; ri: number; cns: string[] }

function getPool(mode: Mode) {
  if (mode === 'basic')  return ['major','minor']
  if (mode === 'triads') return ['major','minor','dim','aug']
  return Object.keys(CHORDS)
}

export function ChordModule() {
  const { onCorrect, onWrong } = useStore()
  const { record: srRecord } = useSRStore()
  const [mode, setMode] = useState<Mode>('basic')
  const [q, setQ] = useState<Q | null>(null)
  const [opts, setOpts] = useState<string[]>([])
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const newQ = useCallback((m: Mode = mode) => {
    const pool = getPool(m)
    const ck = srWeightedPick(pool, k => `ch:${k}`)
    const ch = CHORDS[ck]
    const ri = Math.floor(Math.random() * 12)
    const cns = ch.sem.map(s => shiftNote(ri, s, 4))
    const wrong = shuffle(pool.filter(k => k !== ck)).slice(0, Math.min(5, pool.length - 1))
    setQ({ ck, ch, ri, cns })
    setOpts(shuffle([...wrong, ck]))
    setAnswered(false)
    setSelected(null)
    setTimeout(() => playChord(cns, false), 480)
  }, [mode])

  const playChord = (cns: string[], arp: boolean) => {
    setIsPlaying(true)
    audio.playNotes(cns, arp)
    setTimeout(() => setIsPlaying(false), arp ? cns.length * 220 + 600 : 1400)
  }

  const answer = (k: string) => {
    if (answered || !q) return
    setAnswered(true)
    setSelected(k)
    const ok = k === q.ck
    srRecord(`ch:${q.ck}`, ok)
    if (ok) onCorrect(15)
    else onWrong()
  }

  useEffect(() => { newQ() }, []) // eslint-disable-line
  if (!q) return null
  const ok = answered && selected === q.ck

  return (
    <div className="flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">
      <div>
        <div className="font-display italic text-[1rem] t-dim">Nhận diện Hợp âm</div>
        <ModuleTabs options={[{value:'basic' as Mode,label:'Major/Minor'},{value:'triads' as Mode,label:'Tam âm'},{value:'all' as Mode,label:'Tất cả'}]} value={mode} onChange={m=>{setMode(m);newQ(m)}} />
      </div>
      <Card>
        <div className="flex items-center justify-center gap-5 py-3">
          <PlayBtn onClick={() => playChord(q.cns, false)} isPlaying={isPlaying} />
          <div className="flex-1 text-center">
            <div className="font-display text-4xl t-lbl">{answered ? NOTE_DISPLAY[q.ri] : '?'}</div>
            <div className="mt-2 flex gap-2 justify-center">
              <Btn size="sm" onClick={() => playChord(q.cns, false)}>🎹 Đồng thời</Btn>
              <Btn size="sm" onClick={() => playChord(q.cns, true)}>🎵 Arpeggio</Btn>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {opts.map(k => {
            const state = !answered?'idle': k===q.ck?'reveal': k===selected?'wrong':'idle'
            return <OptionBtn key={k} state={state} onClick={()=>answer(k)} disabled={answered}>
              <div className="text-[.85rem] t-lbl">{CHORDS[k].name}</div>
              <div className="mt-0.5 text-[.68rem]">{CHORDS[k].vn}</div>
            </OptionBtn>
          })}
        </div>
      </Card>
      <FeedbackBar state={!answered?'idle':ok?'correct':'wrong'}>
        {!answered?'Nghe và chọn loại hợp âm'
          :ok?<>✓ Đúng! <b>{NOTE_DISPLAY[q.ri]} {q.ch.name}</b><span className="cursor-pointer underline opacity-70 ml-2" onClick={()=>newQ()}>Tiếp →</span></>
          :<>✗ Sai. Đáp án: <b>{NOTE_DISPLAY[q.ri]} {q.ch.name}</b><span className="cursor-pointer underline opacity-70 ml-2" onClick={()=>newQ()}>Tiếp →</span></>}
      </FeedbackBar>
      <Card><CardTitle>Bàn phím — Oct 3–5</CardTitle>
        <Piano startOctave={3} numOctaves={3} highlighted={answered?q.cns:[]} /></Card>
    </div>
  )
}
