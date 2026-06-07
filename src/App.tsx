import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PracticePage } from '@/pages/Practice'

function Header() {
  return (
    <header className="relative flex items-center justify-between border-b border-white/[0.08] bg-black/30 px-4 py-3 sm:px-8 sm:py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <path d="M10 22V12l12-2v8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="23" r="2.8" fill="white" opacity=".9"/>
            <circle cx="21" cy="19" r="2.8" fill="white" opacity=".9"/>
          </svg>
        </div>
        <div>
          <div className="font-display text-[1.3rem] font-bold tracking-wide grad-text">SonicEar</div>
          <div className="font-mono text-[.6rem] tracking-[.18em] text-slate-500">LUYỆN CẢM ÂM · EAR TRAINING</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline font-mono text-[.6rem] px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-300 tracking-widest">
          ✦ DEMO
        </span>
        <div className="hidden sm:block font-mono text-[.55rem] text-slate-600">{__BUILD_INFO__}</div>
      </div>
    </header>
  )
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 15% 25%, rgba(139,92,246,0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(6,182,212,0.12) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(251,146,60,0.06) 0%, transparent 60%), #060414'
      }} />
      {/* Animated blobs */}
      <div className="animate-blob-1 absolute rounded-full"
        style={{ width: 420, height: 420, top: '5%', left: '-5%', background: 'rgba(139,92,246,0.10)', filter: 'blur(80px)' }} />
      <div className="animate-blob-2 absolute rounded-full"
        style={{ width: 380, height: 380, bottom: '10%', right: '-5%', background: 'rgba(6,182,212,0.09)', filter: 'blur(70px)' }} />
      <div className="animate-blob-3 absolute rounded-full"
        style={{ width: 300, height: 300, top: '55%', left: '40%', background: 'rgba(251,146,60,0.07)', filter: 'blur(65px)' }} />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(168,85,247,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* Music notes deco */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g fill="rgba(168,85,247,0.06)" fontFamily="serif" fontSize="100">
          <text x="40" y="500">♩</text>
          <text x="1300" y="260">♪</text>
          <text x="60" y="820">♫</text>
          <text x="640" y="880">𝄞</text>
        </g>
        <g fill="rgba(34,211,238,0.04)" fontFamily="serif" fontSize="120">
          <text x="1100" y="580">♬</text>
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
