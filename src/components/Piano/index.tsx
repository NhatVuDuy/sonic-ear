import { useCallback } from 'react'
import { NOTE_NAMES, IS_BLACK } from '@/theory'
import { audio } from '@/audio/engine'

// Rainbow gradients for highlighted keys — cycles through hues
const HL_GRADIENTS = [
  { white: 'linear-gradient(180deg,#fce7f3 0%,#f472b6 60%,#db2777 100%)', black: 'linear-gradient(180deg,#f9a8d4 0%,#be185d 100%)', glow: 'rgba(244,114,182,0.55)', label: 'rgba(130,0,80,0.9)' },
  { white: 'linear-gradient(180deg,#ffedd5 0%,#fb923c 60%,#ea580c 100%)', black: 'linear-gradient(180deg,#fed7aa 0%,#c2410c 100%)', glow: 'rgba(251,146,60,0.55)',  label: 'rgba(120,40,0,0.9)' },
  { white: 'linear-gradient(180deg,#fef9c3 0%,#facc15 60%,#ca8a04 100%)', black: 'linear-gradient(180deg,#fef08a 0%,#a16207 100%)', glow: 'rgba(250,204,21,0.55)',  label: 'rgba(100,70,0,0.9)' },
  { white: 'linear-gradient(180deg,#d1fae5 0%,#34d399 60%,#059669 100%)', black: 'linear-gradient(180deg,#6ee7b7 0%,#047857 100%)', glow: 'rgba(52,211,153,0.55)',  label: 'rgba(0,80,50,0.9)' },
  { white: 'linear-gradient(180deg,#dbeafe 0%,#60a5fa 60%,#2563eb 100%)', black: 'linear-gradient(180deg,#93c5fd 0%,#1d4ed8 100%)', glow: 'rgba(96,165,250,0.55)',  label: 'rgba(0,30,120,0.9)' },
  { white: 'linear-gradient(180deg,#ede9fe 0%,#a78bfa 60%,#7c3aed 100%)', black: 'linear-gradient(180deg,#c4b5fd 0%,#5b21b6 100%)', glow: 'rgba(167,139,250,0.55)', label: 'rgba(60,0,140,0.9)' },
]

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
  const wW = small ? 32 : 40
  const kH = small ? 74 : 120
  const bW = small ? 20 : 25
  const bH = small ? 46 : 74

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
          const hlIdx = highlighted.indexOf(ns)
          const isHl = hlIdx >= 0
          const col = isHl ? HL_GRADIENTS[hlIdx % HL_GRADIENTS.length] : null
          return (
            <div
              key={ns}
              data-note={ns}
              onMouseDown={e => { e.preventDefault(); handleAttack(ns) }}
              onMouseUp={() => handleRelease(ns)}
              onMouseLeave={() => handleRelease(ns)}
              onTouchStart={e => { e.preventDefault(); handleAttack(ns) }}
              onTouchEnd={() => handleRelease(ns)}
              className="relative z-10 flex-shrink-0 cursor-pointer rounded-b-lg border border-black/20 transition-[background,box-shadow] duration-[60ms]"
              style={{
                width: wW,
                height: kH,
                background: col ? col.white : 'linear-gradient(180deg,#eee8de 0%,#f8f4ec 100%)',
                boxShadow: col
                  ? `0 4px 5px rgba(0,0,0,.4),inset 0 -2px 3px rgba(0,0,0,.07),0 0 14px ${col.glow}`
                  : '0 4px 5px rgba(0,0,0,.4),inset 0 -2px 3px rgba(0,0,0,.07)',
              }}
            >
              {n.name === 'C' && (
                <span
                  className="pointer-events-none absolute bottom-1.5 left-0 right-0 text-center font-mono text-[0.58rem] font-bold"
                  style={{ color: col ? col.label : 'rgba(0,0,0,0.55)' }}
                >
                  C{n.octave}
                </span>
              )}
            </div>
          )
        })}

        {/* Black keys */}
        {allNotes.filter(n => n.black).map(n => {
          const ns = n.name + n.octave
          const hlIdx = highlighted.indexOf(ns)
          const isHl = hlIdx >= 0
          const col = isHl ? HL_GRADIENTS[hlIdx % HL_GRADIENTS.length] : null
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
              className="absolute top-0 z-20 cursor-pointer rounded-b-md transition-[background,box-shadow] duration-[60ms]"
              style={{
                left,
                width: bW,
                height: bH,
                background: col ? col.black : 'linear-gradient(180deg,#282018 0%,#1a1410 100%)',
                boxShadow: col
                  ? `2px 4px 8px rgba(0,0,0,.7),inset 0 -2px 3px rgba(255,255,255,.04),0 0 12px ${col.glow}`
                  : '2px 4px 8px rgba(0,0,0,.7),inset 0 -2px 3px rgba(255,255,255,.04)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
