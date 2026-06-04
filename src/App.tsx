import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PracticePage } from '@/pages/Practice'

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[rgba(201,168,76,.15)] bg-[rgba(13,11,8,.8)] px-4 py-3 sm:px-8 sm:py-4 backdrop-blur-md">
      <div>
        <div className="flex items-center gap-2.5 font-display text-[1.4rem] font-bold tracking-wide text-[#c9a84c]">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14.5" stroke="#c9a84c" strokeWidth="1.4"/>
            <path d="M10 22V12l12-2v8" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="23" r="2.8" fill="#c9a84c" opacity=".85"/>
            <circle cx="21" cy="19" r="2.8" fill="#c9a84c" opacity=".85"/>
          </svg>
          SonicEar
        </div>
        <div className="font-mono text-[.66rem] tracking-[.2em] text-[#8a7d6a]">LUYỆN CẢM ÂM · EAR TRAINING</div>
      </div>
    </header>
  )
}

// SVG decorative background
function Background() {
  return (
    <svg className="pointer-events-none fixed inset-0 z-0" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="g1" cx="18%" cy="28%" r="55%"><stop offset="0%" stopColor="#2a1e08"/><stop offset="100%" stopColor="#0d0b08"/></radialGradient>
        <radialGradient id="g2" cx="82%" cy="72%" r="48%"><stop offset="0%" stopColor="#1a1208"/><stop offset="100%" stopColor="#0d0b08" stopOpacity="0"/></radialGradient>
        <filter id="bl"><feGaussianBlur stdDeviation="45"/></filter>
      </defs>
      <rect width="1440" height="900" fill="url(#g1)"/>
      <rect width="1440" height="900" fill="url(#g2)"/>
      <circle cx="180" cy="140" r="280" fill="#c9a84c" opacity=".045" filter="url(#bl)"/>
      <circle cx="1280" cy="720" r="240" fill="#6b4cf6" opacity=".03" filter="url(#bl)"/>
      <g stroke="#c9a84c" strokeWidth=".5" opacity=".07" fill="none">
        <path d="M720,0 L820,100 L720,200 L620,100Z"/>
        <path d="M720,0 L950,230 L720,460 L490,230Z"/>
        <circle cx="720" cy="450" r="190"/><circle cx="720" cy="450" r="290"/>
        <line x1="0" y1="0" x2="380" y2="380"/><line x1="1440" y1="0" x2="1060" y2="380"/>
      </g>
      <g fill="#c9a84c" opacity=".032" fontFamily="serif" fontSize="88">
        <text x="40" y="480">♩</text><text x="1310" y="280">♪</text>
        <text x="80" y="790">♫</text><text x="660" y="870">𝄞</text>
      </g>
    </svg>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Background />
      <div className="grain pointer-events-none fixed inset-0 z-[1] opacity-[.03]"
        style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundSize:'200px'}} />
      <div className="relative z-[2] flex min-h-screen flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/practice" replace />} />
          <Route path="/practice" element={<PracticePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
