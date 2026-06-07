import { useEffect, useRef, useCallback } from 'react'
import { NOTE_NAMES, IS_BLACK } from '@/theory'
import { audio } from '@/audio/engine'

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

  // Build note list
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
        {whites.map((n, wi) => {
          const ns = n.name + n.octave
          const isHl = highlighted.includes(ns)
          return (
            <div
              key={ns}
              data-note={ns}
              onMouseDown={e => { e.preventDefault(); handleAttack(ns) }}
              onMouseUp={() => handleRelease(ns)}
              onMouseLeave={() => handleRelease(ns)}
              onTouchStart={e => { e.preventDefault(); handleAttack(ns) }}
              onTouchEnd={() => handleRelease(ns)}
              className="relative z-10 flex-shrink-0 cursor-pointer rounded-b-lg border border-black/20 transition-[background] duration-[60ms]"
              style={{
                width: wW,
                height: kH,
                background: isHl
                  ? 'linear-gradient(180deg,#b8f0d0 0%,#72c898 100%)'
                  : 'linear-gradient(180deg,#eee8de 0%,#f8f4ec 100%)',
                boxShadow: '0 4px 5px rgba(0,0,0,.4),inset 0 -2px 3px rgba(0,0,0,.07)',
              }}
            >
              {n.name === 'C' && (
                <span className="pointer-events-none absolute bottom-1.5 left-0 right-0 text-center font-mono text-[0.58rem] font-semibold text-black/60">
                  C{n.octave}
                </span>
              )}
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
              className="absolute top-0 z-20 cursor-pointer rounded-b-md transition-[background] duration-[60ms]"
              style={{
                left,
                width: bW,
                height: bH,
                background: isHl
                  ? 'linear-gradient(180deg,#34d399 0%,#2a7a50 100%)'
                  : 'linear-gradient(180deg,#282018 0%,#1a1410 100%)',
                boxShadow: '2px 4px 8px rgba(0,0,0,.7),inset 0 -2px 3px rgba(255,255,255,.04)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
