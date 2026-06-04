// ─── Notes ───────────────────────────────────────────────
export const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const
export const NOTE_DISPLAY = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'] as const
export const IS_BLACK = [false,true,false,true,false,false,true,false,true,false,true,false] as const

export type NoteName = typeof NOTE_NAMES[number]

export function noteToHz(name: string, octave: number): number {
  const idx = NOTE_NAMES.indexOf(name as NoteName)
  const midi = (octave + 1) * 12 + idx
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export function shiftNote(rootIdx: number, semitones: number, rootOct: number): string {
  let idx = rootIdx + semitones
  let oct = rootOct
  while (idx >= 12) { idx -= 12; oct++ }
  while (idx < 0)   { idx += 12; oct-- }
  return NOTE_NAMES[idx] + oct
}

export function parseNote(ns: string): [string, number] {
  const m = ns.match(/^([A-G]#?)(\d)$/)
  return m ? [m[1], parseInt(m[2])] : ['C', 4]
}

// ─── Intervals ───────────────────────────────────────────
export interface Interval { s: number; abbr: string; vn: string; mnemonic?: string }
export const INTERVALS: Interval[] = [
  { s:0,  abbr:'P1', vn:'Đồng âm',          mnemonic:'Cùng một nốt' },
  { s:1,  abbr:'m2', vn:'Quãng 2 thứ',       mnemonic:'Jaws theme' },
  { s:2,  abbr:'M2', vn:'Quãng 2 trưởng',    mnemonic:'Happy Birthday' },
  { s:3,  abbr:'m3', vn:'Quãng 3 thứ',       mnemonic:'Smoke on the Water' },
  { s:4,  abbr:'M3', vn:'Quãng 3 trưởng',    mnemonic:'When the Saints' },
  { s:5,  abbr:'P4', vn:'Quãng 4 đúng',      mnemonic:'Here Comes the Bride' },
  { s:6,  abbr:'TT', vn:'Tritone',           mnemonic:'The Simpsons' },
  { s:7,  abbr:'P5', vn:'Quãng 5 đúng',      mnemonic:'Star Wars' },
  { s:8,  abbr:'m6', vn:'Quãng 6 thứ',       mnemonic:'The Entertainer' },
  { s:9,  abbr:'M6', vn:'Quãng 6 trưởng',    mnemonic:'My Way' },
  { s:10, abbr:'m7', vn:'Quãng 7 thứ',       mnemonic:'Somewhere (West Side Story)' },
  { s:11, abbr:'M7', vn:'Quãng 7 trưởng',    mnemonic:'Take On Me' },
  { s:12, abbr:'P8', vn:'Quãng 8 (Octave)',  mnemonic:'Somewhere Over the Rainbow' },
]

// ─── Chords ──────────────────────────────────────────────
export interface ChordDef { name: string; vn: string; sem: number[] }
export const CHORDS: Record<string, ChordDef> = {
  major: { name:'Major',      vn:'Trưởng',      sem:[0,4,7] },
  minor: { name:'Minor',      vn:'Thứ',         sem:[0,3,7] },
  dom7:  { name:'Dom 7th',    vn:'Át thất',     sem:[0,4,7,10] },
  maj7:  { name:'Major 7th',  vn:'Trưởng thất', sem:[0,4,7,11] },
  min7:  { name:'Minor 7th',  vn:'Thứ thất',    sem:[0,3,7,10] },
  dim:   { name:'Diminished', vn:'Giảm',        sem:[0,3,6] },
  aug:   { name:'Augmented',  vn:'Tăng',        sem:[0,4,8] },
  sus4:  { name:'Sus4',       vn:'Sus4',        sem:[0,5,7] },
}

// ─── Scales ──────────────────────────────────────────────
export interface ScaleDef { name: string; vn: string; steps: number[] }
export const SCALES: Record<string, ScaleDef> = {
  major:      { name:'Major',          vn:'Trưởng (Ionian)',  steps:[2,2,1,2,2,2,1] },
  minor:      { name:'Natural Minor',  vn:'Thứ tự nhiên',     steps:[2,1,2,2,1,2,2] },
  harmMinor:  { name:'Harmonic Minor', vn:'Thứ hòa âm',       steps:[2,1,2,2,1,3,1] },
  blues:      { name:'Blues',          vn:'Blues',            steps:[3,2,1,1,3,2] },
  pentatonic: { name:'Pentatonic Maj', vn:'Ngũ cung Trưởng',  steps:[2,2,3,2,3] },
  dorian:     { name:'Dorian',         vn:'Dorian',           steps:[2,1,2,2,2,1,2] },
}

export function buildScaleNotes(rootIdx: number, steps: number[], oct = 4): string[] {
  const out: string[] = [NOTE_NAMES[rootIdx] + oct]
  let cur = rootIdx, o = oct
  for (const s of steps) {
    cur += s
    if (cur >= 12) { cur -= 12; o++ }
    out.push(NOTE_NAMES[cur] + o)
  }
  return out
}

// ─── Utils ───────────────────────────────────────────────
export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
