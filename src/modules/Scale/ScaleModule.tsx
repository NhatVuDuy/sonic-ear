import { useState, useCallback, useEffect } from 'react'
import { SCALES, ScaleDef, buildScaleNotes, shuffle, pick, NOTE_NAMES, NOTE_DISPLAY } from '@/theory'
import { audio } from '@/audio/engine'
import { useStore } from '@/store'
import { Card, CardTitle, PlayBtn, FeedbackBar, OptionBtn, ModuleTabs } from '@/components/UI'
import { Piano } from '@/components/Piano'

type Mode = 'basic' | 'medium' | 'all'
interface Q { sk: string; sc: ScaleDef; ri: number; sns: string[] }

function getPool(mode: Mode) {
  if (mode === 'basic')  return ['major','minor']
  if (mode === 'medium') return ['major','minor','harmMinor','pentatonic']
  return Object.keys(SCALES)
}

export function ScaleModule() {
  const { onCorrect, onWrong } = useStore()
  const [mode, setMode] = useState<Mode>('basic')
  const [q, setQ] = useState<Q | null>(null)
  const [opts, setOpts] = useState<string[]>([])
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const newQ = useCallback((m: Mode = mode) => {
    const pool = getPool(m)
    const sk = pick(pool)
    const sc = SCALES[sk]
    const ri = Math.floor(Math.random() * 12)
    const sns = buildScaleNotes(ri, sc.steps, 4)
    const wrong = shuffle(pool.filter(k=>k!==sk)).slice(0,3)
    setQ({ sk, sc, ri, sns })
    setOpts(shuffle([...wrong, sk]))
    setAnswered(false)
    setSelected(null)
    setTimeout(() => playScale(sns), 480)
  }, [mode])

  const playScale = (sns: string[]) => {
    setIsPlaying(true)
    audio.playScale(sns, 0.2)
    setTimeout(() => setIsPlaying(false), (sns.length * 2 - 1) * 220 + 400)
  }

  const answer = (k: string) => {
    if (answered || !q) return
    setAnswered(true)
    setSelected(k)
    if (k === q.sk) onCorrect(18)
    else onWrong()
  }

  useEffect(() => { newQ() }, []) // eslint-disable-line
  if (!q) return null
  const ok = answered && selected === q.sk

  return (
    <div className="flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">
      <div>
        <div className="font-display italic text-[1rem] text-[#a8a4cc]">Nhận diện Điệu thức / Gam</div>
        <ModuleTabs options={[{value:'basic' as Mode,label:'Cơ bản'},{value:'medium' as Mode,label:'Trung cấp'},{value:'all' as Mode,label:'Nâng cao'}]} value={mode} onChange={m=>{setMode(m);newQ(m)}} />
      </div>
      <Card>
        <div className="flex items-center justify-center gap-5 py-3">
          <PlayBtn onClick={() => playScale(q.sns)} isPlaying={isPlaying} />
          <div className="flex-1 text-center">
            <div className="flex gap-1.5 flex-wrap justify-center">
              {['I','II','III','IV','V','VI','VII'].map((d,i) => (
                <div key={d} className={`flex h-8 w-8 items-center justify-center rounded-md border font-mono text-[.62rem] ${i===0?'border-[#818cf8] bg-[rgba(129,140,248,.17)] text-[#818cf8]':'border-[rgba(129,140,248,.12)] bg-[rgba(129,140,248,.07)] text-[#a8a4cc]'}`}>
                  {answered && q.sns[i] ? NOTE_DISPLAY[NOTE_NAMES.indexOf(q.sns[i].replace(/\d/,'') as any)] : d}
                </div>
              ))}
            </div>
            <p className="mt-2 font-mono text-[0.7rem] text-[#a8a4cc]">Nghe lên và xuống</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {opts.map(k => {
            const state = !answered?'idle': k===q.sk?'reveal': k===selected?'wrong':'idle'
            return <OptionBtn key={k} state={state} onClick={()=>answer(k)} disabled={answered}>
              <div className="text-[.85rem] text-[#c7d2fe]">{SCALES[k].name}</div>
              <div className="mt-0.5 text-[.68rem]">{SCALES[k].vn}</div>
            </OptionBtn>
          })}
        </div>
      </Card>
      <FeedbackBar state={!answered?'idle':ok?'correct':'wrong'}>
        {!answered?'Nghe và chọn điệu thức'
          :ok?<>✓ Xuất sắc! <b>{NOTE_DISPLAY[q.ri]} {q.sc.vn}</b><span className="cursor-pointer underline opacity-70 ml-2" onClick={()=>newQ()}>Tiếp →</span></>
          :<>✗ Sai. Đáp án: <b>{NOTE_DISPLAY[q.ri]} {q.sc.vn}</b><span className="cursor-pointer underline opacity-70 ml-2" onClick={()=>newQ()}>Tiếp →</span></>}
      </FeedbackBar>
      <Card><CardTitle>Bàn phím — Oct 3–5</CardTitle>
        <Piano startOctave={3} numOctaves={3} highlighted={answered?q.sns:[]} /></Card>
    </div>
  )
}
