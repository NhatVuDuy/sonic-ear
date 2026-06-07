import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PracticePage } from '@/pages/Practice'

function Header() {
  return (
    <header className="relative flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-8 sm:py-4" style={{ background: 'rgba(12,9,16,0.82)', backdropFilter: 'blur(24px)' }}>
      <div className="flex items-center gap-3">
        {/* Clean crystal logo — no spinning, no rainbow */}
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{
          background: 'linear-gradient(145deg,rgba(96,165,250,0.25) 0%,rgba(168,85,247,0.35) 100%)',
          border: '1px solid rgba(168,85,247,0.3)',
          boxShadow: '0 0 18px rgba(168,85,247,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <svg width="19" height="19" viewBox="0 0 32 32" fill="none">
            <path d="M10 22V12l12-2v8" stroke="rgba(196,181,253,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="23" r="2.8" fill="rgba(196,181,253,0.9)"/>
            <circle cx="21" cy="19" r="2.8" fill="rgba(56,189,248,0.9)"/>
          </svg>
        </div>
        <div>
          <div className="font-display text-[1.3rem] font-bold tracking-wide grad-text">SonicEar</div>
          <div className="font-mono text-[.6rem] tracking-[.18em] text-slate-600">LUYỆN CẢM ÂM · EAR TRAINING</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline font-mono text-[.58rem] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-slate-400 tracking-widest">
          STUDIO
        </span>
        <div className="hidden sm:block font-mono text-[.52rem] text-slate-700">{__BUILD_INFO__}</div>
      </div>
    </header>
  )
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Very dark warm base */}
      <div className="absolute inset-0" style={{ background: '#0c0910' }} />

      {/* 5 ambient blobs — each module's color, all very soft */}
      {/* rose  → interval */ }
      <div className="animate-blob-1 absolute rounded-full"
        style={{ width: 500, height: 500, top: '-5%', left: '-10%', background: 'rgba(244,63,94,0.09)', filter: 'blur(100px)' }} />
      {/* orange → chord */}
      <div className="animate-blob-2 absolute rounded-full"
        style={{ width: 440, height: 440, top: '10%', right: '-8%', background: 'rgba(249,115,22,0.08)', filter: 'blur(90px)' }} />
      {/* green  → scale */}
      <div className="animate-blob-3 absolute rounded-full"
        style={{ width: 380, height: 380, bottom: '0%', left: '20%', background: 'rgba(16,185,129,0.07)', filter: 'blur(85px)' }} />
      {/* sky    → note */}
      <div className="animate-blob-4 absolute rounded-full"
        style={{ width: 320, height: 320, bottom: '25%', right: '5%', background: 'rgba(56,189,248,0.07)', filter: 'blur(80px)' }} />
      {/* violet → piano */}
      <div className="animate-blob-5 absolute rounded-full"
        style={{ width: 420, height: 420, top: '40%', left: '35%', background: 'rgba(168,85,247,0.08)', filter: 'blur(95px)' }} />

      {/* Faint dot-grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.4,
      }} />
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
