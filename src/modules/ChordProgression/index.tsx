import { useState, useCallback, useEffect } from 'react'
import { CHORDS, ChordDef, NOTE_NAMES, NOTE_DISPLAY, shiftNote } from '@/theory'
import { audio } from '@/audio/engine'
import { useStore } from '@/store'
import { useSRStore, srWeightedPick } from '@/store/sr'
import { Card, CardTitle, PlayBtn, FeedbackBar, OptionBtn, ModuleTabs, Btn } from '@/components/UI'
import { Piano } from '@/components/Piano'

type Mode = 'basic' | 'medium' | 'all'

interface Degree {
  label: string
  semitones: number
  type: keyof typeof CHORDS
}

interface ProgressionDef {
  name: string
  vn: string
  degrees: Degree[]
}

const PROGRESSIONS: Record<string, ProgressionDef> = {
  'I-IV-V-I': {
    name: 'I – IV – V – I',
    vn: 'Tiến hành cơ bản',
    degrees: [
      { label: 'I',    semitones: 0,  type: 'major' },
      { label: 'IV',   semitones: 5,  type: 'major' },
      { label: 'V',    semitones: 7,  type: 'major' },
      { label: 'I',    semitones: 0,  type: 'major' },
    ],
  },
  'I-V-vi-IV': {
    name: 'I – V – vi – IV',
    vn: 'Pop 4 hợp âm',
    degrees: [
      { label: 'I',    semitones: 0,  type: 'major' },
      { label: 'V',    semitones: 7,  type: 'major' },
      { label: 'vi',   semitones: 9,  type: 'minor' },
      { label: 'IV',   semitones: 5,  type: 'major' },
    ],
  },
  'ii-V-I': {
    name: 'ii – V⁷ – I',
    vn: 'Tiến hành Jazz',
    degrees: [
      { label: 'ii',   semitones: 2,  type: 'minor' },
      { label: 'V⁷',  semitones: 7,  type: 'dom7' },
      { label: 'I',    semitones: 0,  type: 'major' },
    ],
  },
  'I-vi-IV-V': {
    name: 'I – vi – IV – V',
    vn: 'Thập niên 50',
    degrees: [
      { label: 'I',    semitones: 0,  type: 'major' },
      { label: 'vi',   semitones: 9,  type: 'minor' },
      { label: 'IV',   semitones: 5,  type: 'major' },
      { label: 'V',    semitones: 7,  type: 'major' },
    ],
  },
  'i-VII-VI-VII': {
    name: 'i – ♭VII – ♭VI – ♭VII',
    vn: 'Rock Thứ',
    degrees: [
      { label: 'i',    semitones: 0,  type: 'minor' },
      { label: '♭VII', semitones: 10, type: 'major' },
      { label: '♭VI',  semitones: 8,  type: 'major' },
      { label: '♭VII', semitones: 10, type: 'major' },
    ],
  },
  'I-IV-I-V': {
    name: 'I⁷ – IV⁷ – I⁷ – V⁷',
    vn: 'Blues',
    degrees: [
      { label: 'I⁷',  semitones: 0,  type: 'dom7' },
      { label: 'IV⁷', semitones: 5,  type: 'dom7' },
      { label: 'I⁷',  semitones: 0,  type: 'dom7' },
      { label: 'V⁷',  semitones: 7,  type: 'dom7' },
    ],
  },
}

function getPool(mode: Mode) {
  if (mode === 'basic')  return ['I-IV-V-I', 'I-V-vi-IV']
  if (mode === 'medium') return ['I-IV-V-I', 'I-V-vi-IV', 'ii-V-I', 'I-vi-IV-V']
  return Object.keys(PROGRESSIONS)
}

function buildChords(pd: ProgressionDef, ri: number): string[][] {
  return pd.degrees.map(deg => {
    const ch: ChordDef = CHORDS[deg.type]
    const rootIdx = (ri + deg.semitones) % 12
    return ch.sem.map(s => shiftNote(rootIdx, s, 4))
  })
}

interface Q { pk: string; pd: ProgressionDef; ri: number; chords: string[][] }

const CHORD_STEP = 1.5

export function ChordProgressionModule() {
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
    const pk = srWeightedPick(pool, k => `pg:${k}`)
    const pd = PROGRESSIONS[pk]
    const ri = Math.floor(Math.random() * 12)
    const chords = buildChords(pd, ri)
    const wrong = pool.filter(k => k !== pk)
    setQ({ pk, pd, ri, chords })
    setOpts([...wrong, pk].sort(() => Math.random() - 0.5))
    setAnswered(false)
    setSelected(null)
    setTimeout(() => playChords(chords, false), 600)
  }, [mode])

  const playChords = (chords: string[][], arp: boolean) => {
    audio.warmUp()
    setIsPlaying(true)
    chords.forEach((cns, i) => {
      if (arp) {
        cns.forEach((ns, j) => audio.playNote(ns, 1.0, 0.66, i * CHORD_STEP + j * 0.18))
      } else {
        cns.forEach(ns => audio.playNote(ns, 1.1, 0.68, i * CHORD_STEP))
      }
    })
    const totalMs = ((chords.length - 1) * CHORD_STEP + 1.8) * 1000
    setTimeout(() => setIsPlaying(false), totalMs)
  }

  const answer = (k: string) => {
    if (answered || !q) return
    setAnswered(true)
    setSelected(k)
    const ok = k === q.pk
    srRecord(`pg:${q.pk}`, ok)
    if (ok) onCorrect(22)
    else onWrong()
  }

  useEffect(() => { newQ() }, []) // eslint-disable-line
  if (!q) return null
  const ok = answered && selected === q.pk

  const rootNotes = answered ? q.chords.map(c => c[0]) : []

  return (
    <div className="flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">
      <div>
        <div className="font-display italic text-[1rem] t-dim">Nhận diện Tiến hành Hợp âm</div>
        <ModuleTabs
          options={[
            { value: 'basic' as Mode,  label: 'Cơ bản' },
            { value: 'medium' as Mode, label: 'Trung cấp' },
            { value: 'all' as Mode,    label: 'Tất cả' },
          ]}
          value={mode}
          onChange={m => { setMode(m); newQ(m) }}
        />
      </div>

      <Card>
        <div className="flex items-center justify-center gap-4 py-3">
          <PlayBtn onClick={() => playChords(q.chords, false)} isPlaying={isPlaying} />
          <div className="flex-1">
            <div className="flex gap-1.5 flex-wrap justify-center">
              {q.pd.degrees.map((deg, i) => {
                const chordDef = CHORDS[deg.type]
                const rootIdx = (q.ri + deg.semitones) % 12
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center rounded-lg px-2.5 py-2 min-w-[52px]"
                    style={{
                      borderWidth: 1,
                      borderStyle: 'solid',
                      borderColor: i === 0 ? 'var(--accent)' : 'var(--t-opt-border, #e5e7eb)',
                      background: i === 0
                        ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                        : 'var(--t-opt-bg, white)',
                    }}
                  >
                    <div className="font-mono text-[.65rem] font-bold" style={{ color: 'var(--accent)' }}>
                      {deg.label}
                    </div>
                    <div className="font-display text-[1rem] leading-tight t-lbl">
                      {answered ? NOTE_DISPLAY[rootIdx] : '?'}
                    </div>
                    {answered && (
                      <div className="font-mono text-[.55rem] t-dim">{chordDef.name}</div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-2 flex justify-center gap-2">
              <Btn size="sm" onClick={() => playChords(q.chords, false)}>🎹 Block</Btn>
              <Btn size="sm" onClick={() => playChords(q.chords, true)}>🎵 Arpeggio</Btn>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {opts.map(k => {
            const state = !answered ? 'idle' : k === q.pk ? 'reveal' : k === selected ? 'wrong' : 'idle'
            return (
              <OptionBtn key={k} state={state} onClick={() => answer(k)} disabled={answered}>
                <div className="text-[.85rem] t-lbl font-mono">{PROGRESSIONS[k].name}</div>
                <div className="mt-0.5 text-[.68rem]">{PROGRESSIONS[k].vn}</div>
              </OptionBtn>
            )
          })}
        </div>
      </Card>

      <FeedbackBar state={!answered ? 'idle' : ok ? 'correct' : 'wrong'}>
        {!answered
          ? 'Nghe và nhận diện tiến hành hợp âm'
          : ok
            ? <><b>{NOTE_DISPLAY[q.ri]}: {q.pd.name}</b> ✓<span className="cursor-pointer underline opacity-70 ml-2" onClick={() => newQ()}>Tiếp →</span></>
            : <>Đáp án: <b>{NOTE_DISPLAY[q.ri]}: {q.pd.name}</b><span className="cursor-pointer underline opacity-70 ml-2" onClick={() => newQ()}>Tiếp →</span></>
        }
      </FeedbackBar>

      <Card>
        <CardTitle>Bàn phím — nốt gốc các hợp âm</CardTitle>
        <Piano startOctave={4} numOctaves={3} highlighted={rootNotes} />
      </Card>
    </div>
  )
}
