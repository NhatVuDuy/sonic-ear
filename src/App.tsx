import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { PracticePage } from '@/pages/Practice'
import { useStore } from '@/store'
import { THEMES, THEME_IDS, applyTheme } from '@/theme'

// ─── Theme switcher pills ────────────────────────────────────────────────
function ThemeSwitcher() {
  const { themeId, setTheme } = useStore()
  return (
    <div className="flex items-center gap-1">
      {THEME_IDS.map(id => {
        const t = THEMES[id]
        const active = id === themeId
        return (
          <button
            key={id}
            title={t.label}
            onClick={() => { setTheme(id); applyTheme(id) }}
            className="flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 hover:scale-110 cursor-pointer"
            style={{
              width: 32,
              height: 32,
              fontSize: '1.1rem',
              opacity: active ? 1 : 0.45,
              boxShadow: active ? '0 0 0 2px var(--accent, #ff6b6b), 0 0 0 4px rgba(255,255,255,0.15)' : 'none',
              background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
            }}
          >
            {t.emoji}
          </button>
        )
      })}
    </div>
  )
}

// ─── Floating decorations ────────────────────────────────────────────────
function FloatingDeco() {
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark
  const decos = [
    { symbol: '♩', top: '8%',  left: '5%',  size: '2rem',   color: isDark ? '#c9a84c' : '#ff6b6b', delay: '0s',   dur: '4s'   },
    { symbol: '♪', top: '15%', left: '88%', size: '1.8rem', color: isDark ? '#c9a84c' : '#ff9f43', delay: '0.5s', dur: '3.5s' },
    { symbol: '⭐', top: '58%', left: '3%',  size: '1.5rem', color: isDark ? '#e8c96d' : '#ffd93d', delay: '1s',   dur: '5s'   },
    { symbol: '♫', top: '72%', left: '92%', size: '2rem',   color: isDark ? '#c9a84c' : '#4d96ff', delay: '1.5s', dur: '4.2s' },
    { symbol: '🎵', top: '38%', left: '95%', size: '1.4rem', color: isDark ? '#e8c96d' : '#a29bfe', delay: '0.8s', dur: '3.8s' },
    { symbol: '✨', top: '82%', left: '10%', size: '1.5rem', color: isDark ? '#c9a84c' : '#fd79a8', delay: '2s',   dur: '4.5s' },
    { symbol: '♬', top: '25%', left: '2%',  size: '1.6rem', color: isDark ? '#e8c96d' : '#26de81', delay: '0.3s', dur: '3.2s' },
    { symbol: '🌟', top: '48%', left: '96%', size: '1.4rem', color: isDark ? '#c9a84c' : '#ffd93d', delay: '2.5s', dur: '4.8s' },
  ]

  const blobOpacity = isDark ? 0.08 : 0.06
  const blob1 = isDark ? `rgba(201,168,76,${blobOpacity * 10})` : `rgba(255,107,107,${blobOpacity * 10})`
  const blob2 = isDark ? `rgba(201,168,76,${blobOpacity * 8})`  : `rgba(77,150,255,${blobOpacity * 10})`
  const blob3 = isDark ? `rgba(201,168,76,${blobOpacity * 6})`  : `rgba(255,211,61,${blobOpacity * 8})`

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--t-bg, #fffdf5)', transition: 'background 0.35s ease' }} />

      {decos.map((d, i) => (
        <div
          key={i}
          className="animate-float absolute select-none"
          style={{ top: d.top, left: d.left, fontSize: d.size, color: d.color, animationDelay: d.delay, animationDuration: d.dur, opacity: isDark ? 0.35 : 0.55 }}
        >
          {d.symbol}
        </div>
      ))}

      <div className="absolute rounded-full" style={{ width: 600, height: 400, top: '-5%', left: '-5%',   background: blob1, filter: 'blur(80px)' }} />
      <div className="absolute rounded-full" style={{ width: 500, height: 400, bottom: '-5%', right: '-5%', background: blob2, filter: 'blur(80px)' }} />
      <div className="absolute rounded-full" style={{ width: 400, height: 400, top: '40%', left: '40%',   background: blob3, filter: 'blur(80px)' }} />
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────
function Header() {
  const { themeId } = useStore()
  const theme = THEMES[themeId]
  const isDark = theme.isDark

  return (
    <header
      className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
      style={{
        background: 'var(--t-header-bg)',
        backdropFilter: 'blur(20px)',
        border: 'var(--t-header-border)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        boxShadow: isDark
          ? '0 2px 18px rgba(0,0,0,0.3)'
          : '0 2px 18px rgba(255,107,107,0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-[1.5rem]"
          style={theme.logoStyle as React.CSSProperties}
        >
          🎵
        </div>
        <div>
          <div
            className="font-display text-[1.45rem] font-bold leading-tight"
            style={{ color: isDark ? 'var(--t-text)' : undefined }}
          >
            {isDark ? 'SonicEar' : <span className="grad-text">SonicEar</span>}
          </div>
          <div className="font-mono text-[.53rem] tracking-[.15em] t-dim">🎹 LUYỆN CẢM ÂM VUI VẺ</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <span className="hidden sm:block font-mono text-[.5rem] t-dim">{__BUILD_INFO__}</span>
      </div>
    </header>
  )
}

// ─── Theme initializer ────────────────────────────────────────────────────
function ThemeInit() {
  const themeId = useStore(s => s.themeId)
  useEffect(() => { applyTheme(themeId) }, [themeId])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ThemeInit />
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
