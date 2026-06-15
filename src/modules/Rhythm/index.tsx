import { useState, useCallback, useEffect } from 'react'
import { audio } from '@/audio/engine'
import { useStore } from '@/store'
import { useSRStore, srWeightedPick } from '@/store/sr'
import { Card, PlayBtn, FeedbackBar, OptionBtn, ModuleTabs } from '@/components/UI'

type Mode = 'basic' | 'medium' | 'all'

interface Beat {
  dur: number     // duration in quarter-note units
  accent: boolean
}

interface RhythmPattern {
  name: string
  vn: string
  beats: Beat[]
}

const BPM = 76
const QUARTER = 60 / BPM  // seconds per quarter note

const PATTERNS: Record<string, RhythmPattern> = {
  '4q': {
    name: '4/4 — ♩ ♩ ♩ ♩',
    vn: 'Bốn phách đều',
    beats: [
      { dur: 1, accent: true  },
      { dur: 1, accent: false },
      { dur: 1, accent: false },
      { dur: 1, accent: false },
    ],
  },
  '3q': {
    name: '3/4 — ♩ ♩ ♩',
    vn: 'Ba phách (Waltz)',
    beats: [
      { dur: 1, accent: true  },
      { dur: 1, accent: false },
      { dur: 1, accent: false },
    ],
  },
  '2q': {
    name: '2/4 — ♩ ♩',
    vn: 'Hai phách (March)',
    beats: [
      { dur: 1, accent: true  },
      { dur: 1, accent: false },
    ],
  },
  '4q-e2': {
    name: '4/4 — ♩ ♪♪ ♩ ♩',
    vn: 'Hai móc đơn (phách 2)',
    beats: [
      { dur: 1,   accent: true  },
      { dur: 0.5, accent: false },
      { dur: 0.5, accent: false },
      { dur: 1,   accent: false },
      { dur: 1,   accent: false },
    ],
  },
  '4e-q': {
    name: '4/4 — ♪♪♪♪ ♩ ♩',
    vn: 'Bốn móc đơn liền',
    beats: [
      { dur: 0.5, accent: true  },
      { dur: 0.5, accent: false },
      { dur: 0.5, accent: false },
      { dur: 0.5, accent: false },
      { dur: 1,   accent: false },
      { dur: 1,   accent: false },
    ],
  },
  '4dot': {
    name: '4/4 — ♩ ♩ ♩. ♪',
    vn: 'Nốt chấm (phách 3)',
    beats: [
      { dur: 1,   accent: true  },
      { dur: 1,   accent: false },
      { dur: 1.5, accent: false },
      { dur: 0.5, accent: false },
    ],
  },
  '4sync': {
    name: '4/4 — ♩ ♪♪ ♪♪ ♩',
    vn: 'Biến tấu (phách 2+3)',
    beats: [
      { dur: 1,   accent: true  },
      { dur: 0.5, accent: false },
      { dur: 0.5, accent: false },
      { dur: 0.5, accent: false },
      { dur: 0.5, accent: false },
      { dur: 1,   accent: false },
    ],
  },
}

function getPool(mode: Mode): string[] {
  if (mode === 'basic')  return ['4q', '3q']
  if (mode === 'medium') return ['4q', '3q', '2q', '4q-e2']
  return Object.keys(PATTERNS)
}

function NoteBox({ dur, accent, revealed }: { dur: number; accent: boolean; revealed: boolean }) {
  const width = Math.round(dur * 48)
  const symbol = dur >= 1.5 ? '♩.' : dur >= 1 ? '♩' : '♪'
  return (
    <div
      className="flex items-center justify-center rounded-lg flex-shrink-0 transition-all"
      style={{
        width: `${width}px`,
        height: '44px',
        background: accent && revealed
          ? 'var(--accent)'
          : accent
          ? 'color-mix(in srgb, var(--accent) 30%, var(--t-opt-bg, white))'
          : 'var(--t-opt-bg, rgba(255,255,255,0.06))',
        border: `2px solid ${accent ? 'var(--accent)' : 'var(--t-opt-border, #e5e7eb)'}`,
        color: accent && revealed ? 'white' : 'var(--t-dim, #6b7280)',
        fontSize: dur < 1 ? '0.95rem' : '1.1rem',
        fontWeight: 'bold',
      }}
    >
      {symbol}
    </div>
  )
}

interface Q { pk: string; pd: RhythmPattern }

export function RhythmModule() {
  const { onCorrect, onWrong } = useStore()
  const { record: srRecord } = useSRStore()
  const [mode, setMode] = useState<Mode>('basic')
  const [q, setQ] = useState<Q | null>(null)
  const [opts, setOpts] = useState<string[]>([])
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playCount, setPlayCount] = useState(0)

  const newQ = useCallback((m: Mode = mode) => {
    const pool = getPool(m)
    const pk = srWeightedPick(pool, k => `rh:${k}`)
    const pd = PATTERNS[pk]
    const wrong = pool.filter(k => k !== pk).sort(() => Math.random() - 0.5)
    setQ({ pk, pd })
    setOpts([...wrong, pk].sort(() => Math.random() - 0.5))
    setAnswered(false)
    setSelected(null)
    setPlayCount(0)
    setTimeout(() => playPattern(pd.beats), 500)
  }, [mode])

  const playPattern = (beats: Beat[]) => {
    audio.warmUp()
    setIsPlaying(true)
    let offset = 0
    beats.forEach(beat => {
      const ns = beat.accent ? 'C5' : 'C4'
      const vel = beat.accent ? 0.88 : beat.dur < 1 ? 0.48 : 0.62
      audio.playNote(ns, 0.055, vel, offset * QUARTER)
      offset += beat.dur
    })
    const total = beats.reduce((s, b) => s + b.dur, 0)
    setTimeout(() => setIsPlaying(false), total * QUARTER * 1000 + 180)
    setPlayCount(c => c + 1)
  }

  const answer = (k: string) => {
    if (answered || !q) return
    setAnswered(true)
    setSelected(k)
    const ok = k === q.pk
    srRecord(`rh:${q.pk}`, ok)
    if (ok) onCorrect(14)
    else onWrong()
  }

  useEffect(() => { newQ() }, []) // eslint-disable-line
  if (!q) return null
  const ok = answered && selected === q.pk

  return (
    <div className="flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">
      <div>
        <div className="font-display italic text-[1rem] t-dim">Nhận diện Tiết tấu</div>
        <ModuleTabs
          options={[
            { value: 'basic' as Mode,  label: 'Cơ bản' },
            { value: 'medium' as Mode, label: 'Trung cấp' },
            { value: 'all' as Mode,    label: 'Nâng cao' },
          ]}
          value={mode}
          onChange={m => { setMode(m); newQ(m) }}
        />
      </div>

      <Card>
        <div className="flex items-center justify-center gap-5 py-3">
          <PlayBtn onClick={() => playPattern(q.pd.beats)} isPlaying={isPlaying} />
          <div className="flex-1 text-center">
            <div className="flex gap-1.5 items-center justify-center flex-wrap">
              {q.pd.beats.map((beat, i) => (
                <NoteBox key={i} dur={beat.dur} accent={beat.accent} revealed={answered} />
              ))}
            </div>
            {playCount < 2 && !answered && (
              <p className="mt-2 font-mono text-[0.68rem] t-dim">Nghe kỹ rồi mới chọn · Nhấn lại để nghe thêm</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {opts.map(k => {
            const state = !answered ? 'idle' : k === q.pk ? 'reveal' : k === selected ? 'wrong' : 'idle'
            return (
              <OptionBtn key={k} state={state} onClick={() => answer(k)} disabled={answered}>
                <div className="font-mono text-[.75rem] t-lbl">{PATTERNS[k].name}</div>
                <div className="mt-0.5 text-[.65rem]">{PATTERNS[k].vn}</div>
              </OptionBtn>
            )
          })}
        </div>
      </Card>

      <FeedbackBar state={!answered ? 'idle' : ok ? 'correct' : 'wrong'}>
        {!answered
          ? 'Nghe và nhận diện tiết tấu'
          : ok
            ? <><b>{q.pd.name}</b> ✓<span className="cursor-pointer underline opacity-70 ml-2" onClick={() => newQ()}>Tiếp →</span></>
            : <>Đáp án: <b>{q.pd.name}</b><span className="cursor-pointer underline opacity-70 ml-2" onClick={() => newQ()}>Tiếp →</span></>
        }
      </FeedbackBar>
    </div>
  )
}
