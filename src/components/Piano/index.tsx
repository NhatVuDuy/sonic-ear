import { useCallback } from 'react'
import { NOTE_NAMES, IS_BLACK } from '@/theory'
import { audio } from '@/audio/engine'

// Kids theme: each white key has its own note-color (Do=red, Re=orange…).
// All white keys show their note name for easy learning.
const NOTE_COLORS: Record<string, { bg: string; text: string }> = {
  'C':  { bg: 'rgba(255,107,107,0.13)', text: '#c92a2a' },
  'D':  { bg: 'rgba(255,159,67,0.13)',  text: '#c05c00' },
  'E':  { bg: 'rgba(38,222,129,0.13)',  text: '#099268' },
  'F':  { bg: 'rgba(77,150,255,0.13)',  text: '#1971c2' },
  'G':  { bg: 'rgba(162,155,254,0.13)', text: '#6741d9' },
  'A':  { bg: 'rgba(253,121,168,0.13)', text: '#c2255c' },
  'B':  { bg: 'rgba(255,211,61,0.18)',  text: '#966a00' },
}

interface PianoProps {
  startOctave?: number
  numOctaves?: number
  small?: boolean
  highlighted?: string[]
  onKeyPress?: (noteStr: string) => void
}

export function Piano({
  startOctave = 3,
  numOctaves = 2,
  small = false,
  highlighted = [],
  onKeyPress,
}: PianoProps) {
  const wW = small ? 32 : 42
  const kH = small ? 74 : 130
  const bW = small ? 20 : 26
  const bH = small ? 46 : 80

  const allNotes: { name: string; octave: number; s: number; black: boolean }[] = []
  for (let oct = startOctave; oct < startOctave + numOctaves; oct++) {
    for (let s = 0; s < 12; s++) {
      allNotes.push({ name: NOTE_NAMES[s], octave: oct, s, black: IS_BLACK[s] })
    }
  }
  const whites = allNotes.filter(n => !n.black)

  const handleAttack = useCallback((ns: string) => {
    audio.attack(ns, 0.8)
    onKeyPress?.(ns)
  }, [onKeyPress])

  const handleRelease = useCallback((ns: string) => {
    audio.release(ns, false)
  }, [])

  return (
    <div
      className="overflow-x-auto overflow-y-visible pb-2"
      style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}
    >
      <div className="relative flex" style={{ width: `${whites.length * wW}px`, height: `${kH}px` }}>
        {/* White keys */}
        {whites.map((n) => {
          const ns = n.name + n.octave
          const isHl = highlighted.includes(ns)
          const nc = NOTE_COLORS[n.name] ?? { bg: 'rgba(0,0,0,0.05)', text: '#888' }
          return (
            <div
              key={ns}
              data-note={ns}
              onMouseDown={e => { e.preventDefault(); handleAttack(ns) }}
              onMouseUp={() => handleRelease(ns)}
              onMouseLeave={() => handleRelease(ns)}
              onTouchStart={e => { e.preventDefault(); handleAttack(ns) }}
              onTouchEnd={() => handleRelease(ns)}
              className="relative z-10 flex-shrink-0 cursor-pointer rounded-b-xl border-2 transition-[background,box-shadow] duration-[60ms]"
              style={{
                width: wW,
                height: kH,
                borderColor: isHl
                  ? 'var(--accent, #ff6b6b)'
                  : 'rgba(200,185,165,0.55)',
                background: isHl
                  ? 'linear-gradient(180deg, color-mix(in srgb, var(--accent, #ff6b6b) 25%, white) 0%, var(--accent, #ff6b6b) 100%)'
                  : `linear-gradient(180deg, ${nc.bg} 0%, rgba(255,255,255,0.3) 40%, white 100%)`,
                boxShadow: isHl
                  ? '0 4px 6px rgba(0,0,0,.12), 0 0 18px var(--accent-glow, rgba(255,107,107,0.5))'
                  : '0 3px 5px rgba(0,0,0,.10)',
              }}
            >
              {/* Note label — all white keys, colored by note */}
              <span
                className="pointer-events-none absolute bottom-1.5 left-0 right-0 text-center font-mono font-bold"
                style={{
                  fontSize: small ? '0.48rem' : '0.58rem',
                  color: isHl ? 'rgba(255,255,255,0.92)' : nc.text,
                  textShadow: isHl ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {/* Show octave number only on C keys */}
                {n.name}{n.name === 'C' ? n.octave : ''}
              </span>
            </div>
          )
        })}

        {/* Black keys */}
        {allNotes.filter(n => n.black).map(n => {
          const ns = n.name + n.octave
          const isHl = highlighted.includes(ns)
          const lw = whites.filter(w =>
            w.octave < n.octave || (w.octave === n.octave && w.s < n.s)
          )
          if (!lw.length) return null
          const left = (lw.length - 1) * wW + wW - bW / 2

          return (
            <div
              key={ns}
              data-note={ns}
              onMouseDown={e => { e.preventDefault(); handleAttack(ns) }}
              onMouseUp={() => handleRelease(ns)}
              onMouseLeave={() => handleRelease(ns)}
              onTouchStart={e => { e.preventDefault(); handleAttack(ns) }}
              onTouchEnd={() => handleRelease(ns)}
              className="absolute top-0 z-20 cursor-pointer rounded-b-lg transition-[background,box-shadow] duration-[60ms]"
              style={{
                left,
                width: bW,
                height: bH,
                background: isHl
                  ? `linear-gradient(180deg, color-mix(in srgb, var(--accent, #ff6b6b) 60%, black) 0%, var(--accent, #ff6b6b) 100%)`
                  : 'linear-gradient(180deg,#3a3030 0%,#221a1a 100%)',
                boxShadow: isHl
                  ? '2px 4px 8px rgba(0,0,0,.5), 0 0 12px var(--accent-glow, rgba(255,107,107,0.6))'
                  : '2px 4px 8px rgba(0,0,0,.5)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
