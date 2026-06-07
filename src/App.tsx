import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PracticePage } from '@/pages/Practice'

function Header() {
  return (
    <header className="relative flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-8 sm:py-4" style={{ background: 'rgba(4,3,15,0.75)', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center gap-3">
        {/* Spinning rainbow logo ring */}
        <div className="animate-rainbow-spin flex h-9 w-9 items-center justify-center rounded-xl shadow-lg" style={{
          background: 'linear-gradient(135deg,#f472b6,#fb923c,#facc15,#34d399,#22d3ee,#a78bfa,#f472b6)',
        }}>
          <div className="flex h-7 w-7 items-center justify-center rounded-[10px]" style={{ background: 'rgba(4,3,15,0.85)' }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M10 22V12l12-2v8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="23" r="2.8" fill="white" opacity=".9"/>
              <circle cx="21" cy="19" r="2.8" fill="white" opacity=".9"/>
            </svg>
          </div>
        </div>

        <div>
          <div className="font-display text-[1.3rem] font-bold tracking-wide grad-text">SonicEar</div>
          <div className="font-mono text-[.6rem] tracking-[.18em] text-slate-500">LUYỆN CẢM ÂM · EAR TRAINING</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Rainbow DEMO badge */}
        <span className="hidden sm:inline font-mono text-[.6rem] px-3 py-1 rounded-full tracking-widest text-white font-semibold" style={{
          background: 'linear-gradient(135deg,#f472b6,#fb923c,#facc15,#34d399,#22d3ee,#a78bfa)',
          boxShadow: '0 0 16px rgba(244,114,182,0.35)',
        }}>
          ✦ RAINBOW
        </span>
        <div className="hidden sm:block font-mono text-[.55rem] text-slate-600">{__BUILD_INFO__}</div>
      </div>
    </header>
  )
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep dark base */}
      <div className="absolute inset-0" style={{ background: '#04030f' }} />

      {/* 5 rainbow blobs — each a different hue */}
      <div className="animate-blob-1 absolute rounded-full"
        style={{ width: 480, height: 480, top: '0%', left: '-8%', background: 'rgba(244,114,182,0.13)', filter: 'blur(90px)' }} />
      <div className="animate-blob-2 absolute rounded-full"
        style={{ width: 420, height: 420, top: '15%', right: '-6%', background: 'rgba(251,146,60,0.11)', filter: 'blur(80px)' }} />
      <div className="animate-blob-3 absolute rounded-full"
        style={{ width: 360, height: 360, bottom: '5%', left: '15%', background: 'rgba(34,211,238,0.10)', filter: 'blur(75px)' }} />
      <div className="animate-blob-4 absolute rounded-full"
        style={{ width: 300, height: 300, bottom: '20%', right: '10%', background: 'rgba(52,211,153,0.09)', filter: 'blur(70px)' }} />
      <div className="animate-blob-5 absolute rounded-full"
        style={{ width: 380, height: 380, top: '45%', left: '38%', background: 'rgba(167,139,250,0.10)', filter: 'blur(85px)' }} />

      {/* Very subtle grid */}
      <div className="absolute inset-0 opacity-[.018]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Rainbow music notes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g fontFamily="serif" fontSize="100">
          <text x="30"   y="500" fill="rgba(244,114,182,0.07)">♩</text>
          <text x="1310" y="260" fill="rgba(251,146,60,0.06)">♪</text>
          <text x="55"   y="820" fill="rgba(250,204,21,0.05)">♫</text>
          <text x="650"  y="880" fill="rgba(52,211,153,0.06)">𝄞</text>
        </g>
        <g fontFamily="serif" fontSize="120">
          <text x="1100" y="580" fill="rgba(96,165,250,0.05)">♬</text>
        </g>
      </svg>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Background />
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
