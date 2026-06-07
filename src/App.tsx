import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PracticePage } from '@/pages/Practice'

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[rgba(129,140,248,.2)] bg-[rgba(11,9,24,.85)] px-4 py-3 sm:px-8 sm:py-4 backdrop-blur-md">
      <div>
        <div className="flex items-center gap-2.5 font-display text-[1.4rem] font-bold tracking-wide text-[#818cf8]">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14.5" stroke="#818cf8" strokeWidth="1.4"/>
            <path d="M10 22V12l12-2v8" stroke="#818cf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="23" r="2.8" fill="#818cf8" opacity=".85"/>
            <circle cx="21" cy="19" r="2.8" fill="#818cf8" opacity=".85"/>
          </svg>
          SonicEar
        </div>
        <div className="font-mono text-[.66rem] tracking-[.2em] text-[#8880b4]">LUYỆN CẢM ÂM · EAR TRAINING</div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline font-mono text-[.58rem] px-2 py-0.5 rounded-full border border-[#818cf8]/50 text-[#818cf8] tracking-widest">DEMO</span>
        <div className="font-mono text-[.55rem] tracking-[.08em] text-[#8880b4]/50 hidden sm:block">
          {__BUILD_INFO__}
        </div>
      </div>
    </header>
  )
}

function Background() {
  return (
    <svg className="pointer-events-none fixed inset-0 z-0" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="g1" cx="20%" cy="25%" r="60%">
          <stop offset="0%" stopColor="#1a0e5c"/>
          <stop offset="100%" stopColor="#07050f"/>
        </radialGradient>
        <radialGradient id="g2" cx="80%" cy="75%" r="55%">
          <stop offset="0%" stopColor="#0a0630"/>
          <stop offset="100%" stopColor="#07050f" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g3" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity=".06"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
        </radialGradient>
        <filter id="bl"><feGaussianBlur stdDeviation="50"/></filter>
        <filter id="bl2"><feGaussianBlur stdDeviation="30"/></filter>
      </defs>
      <rect width="1440" height="900" fill="url(#g1)"/>
      <rect width="1440" height="900" fill="url(#g2)"/>
      <rect width="1440" height="900" fill="url(#g3)"/>
      {/* Glow orbs */}
      <circle cx="160" cy="120" r="320" fill="#818cf8" opacity=".07" filter="url(#bl)"/>
      <circle cx="1300" cy="780" r="260" fill="#06b6d4" opacity=".06" filter="url(#bl)"/>
      <circle cx="900" cy="300" r="180" fill="#a78bfa" opacity=".05" filter="url(#bl2)"/>
      {/* Geometric lines */}
      <g stroke="#818cf8" strokeWidth=".6" opacity=".09" fill="none">
        <path d="M720,0 L840,120 L720,240 L600,120Z"/>
        <path d="M720,0 L980,260 L720,520 L460,260Z"/>
        <circle cx="720" cy="450" r="200"/>
        <circle cx="720" cy="450" r="310"/>
        <line x1="0" y1="0" x2="400" y2="400"/>
        <line x1="1440" y1="0" x2="1040" y2="400"/>
      </g>
      {/* Music notes */}
      <g fill="#818cf8" opacity=".04" fontFamily="serif" fontSize="88">
        <text x="40" y="480">♩</text>
        <text x="1310" y="280">♪</text>
        <text x="80" y="790">♫</text>
        <text x="660" y="870">𝄞</text>
      </g>
      {/* Cyan accent note */}
      <g fill="#06b6d4" opacity=".035" fontFamily="serif" fontSize="110">
        <text x="1100" y="600">♬</text>
      </g>
    </svg>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Background />
      <div className="grain pointer-events-none fixed inset-0 z-[1] opacity-[.025]"
        style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundSize:'200px'}} />
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
