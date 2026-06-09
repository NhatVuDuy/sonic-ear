import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PracticePage } from '@/pages/Practice'

function FloatingDeco() {
  const decos = [
    { symbol: '♩', top: '8%',  left: '5%',  size: '2rem',   color: '#ff6b6b', delay: '0s',   dur: '4s'   },
    { symbol: '♪', top: '15%', left: '88%', size: '1.8rem', color: '#ff9f43', delay: '0.5s', dur: '3.5s' },
    { symbol: '⭐', top: '58%', left: '3%',  size: '1.5rem', color: '#ffd93d', delay: '1s',   dur: '5s'   },
    { symbol: '♫', top: '72%', left: '92%', size: '2rem',   color: '#4d96ff', delay: '1.5s', dur: '4.2s' },
    { symbol: '🎵', top: '38%', left: '95%', size: '1.4rem', color: '#a29bfe', delay: '0.8s', dur: '3.8s' },
    { symbol: '✨', top: '82%', left: '10%', size: '1.5rem', color: '#fd79a8', delay: '2s',   dur: '4.5s' },
    { symbol: '♬', top: '25%', left: '2%',  size: '1.6rem', color: '#26de81', delay: '0.3s', dur: '3.2s' },
    { symbol: '🌟', top: '48%', left: '96%', size: '1.4rem', color: '#ffd93d', delay: '2.5s', dur: '4.8s' },
  ]
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: '#fffdf5' }} />

      {decos.map((d, i) => (
        <div
          key={i}
          className="animate-float absolute select-none"
          style={{ top: d.top, left: d.left, fontSize: d.size, color: d.color, animationDelay: d.delay, animationDuration: d.dur, opacity: 0.55 }}
        >
          {d.symbol}
        </div>
      ))}

      {/* Soft background blobs */}
      <div className="absolute rounded-full" style={{ width: 600, height: 400, top: '-5%', left: '-5%',   background: 'rgba(255,107,107,0.07)', filter: 'blur(80px)' }} />
      <div className="absolute rounded-full" style={{ width: 500, height: 400, bottom: '-5%', right: '-5%', background: 'rgba(77,150,255,0.07)', filter: 'blur(80px)' }} />
      <div className="absolute rounded-full" style={{ width: 400, height: 400, top: '40%', left: '40%',   background: 'rgba(255,211,61,0.05)',  filter: 'blur(80px)' }} />
    </div>
  )
}

function Header() {
  return (
    <header
      className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
      style={{
        background: 'rgba(255,253,245,0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(255,107,107,0.14)',
        boxShadow: '0 2px 18px rgba(255,107,107,0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-[1.5rem]"
          style={{
            background: 'linear-gradient(270deg,#ff6b6b,#ff9f43,#ffd93d,#26de81,#4d96ff,#a29bfe,#fd79a8,#ff6b6b)',
            backgroundSize: '400% 400%',
            animation: 'logo-colors 4s ease infinite',
            boxShadow: '0 4px 14px rgba(255,107,107,0.35)',
          }}
        >
          🎵
        </div>
        <div>
          <div className="font-display text-[1.45rem] font-bold leading-tight grad-text">SonicEar</div>
          <div className="font-mono text-[.53rem] tracking-[.15em]" style={{ color: '#888' }}>🎹 LUYỆN CẢM ÂM VUI VẺ</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="hidden sm:inline font-mono text-[.62rem] tracking-wider text-white rounded-full px-3 py-1.5"
          style={{ background: 'linear-gradient(135deg,#4d96ff,#a29bfe)' }}
        >
          ✨ DÀNH CHO BÉ
        </span>
        <span className="hidden sm:block font-mono text-[.5rem]" style={{ color: '#999' }}>{__BUILD_INFO__}</span>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <HashRouter>
      <FloatingDeco />
      <div className="relative z-[2] flex min-h-screen flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/practice" replace />} />
          <Route path="/practice" element={<PracticePage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
