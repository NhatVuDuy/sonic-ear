import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PracticePage } from '@/pages/Practice'
import { ProfilePage } from '@/pages/Profile'
import { LeaderboardPage } from '@/pages/Leaderboard'
import { AuthModal, UsernameModal } from '@/components/Auth'
import { useStore } from '@/store'
import { useAuthStore } from '@/store/auth'
import { THEMES, THEME_IDS, applyTheme } from '@/theme'
import { analytics } from '@/analytics'

// ─── Theme switcher pills ────────────────────────────────────────────────
function ThemeSwitcher() {
  const { themeId, setTheme } = useStore()
  return (
    <div className="flex items-center gap-0.5">
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
              width: 30,
              height: 30,
              fontSize: '1rem',
              opacity: active ? 1 : 0.4,
              boxShadow: active ? '0 0 0 2px var(--accent, #ff6b6b), 0 0 8px var(--accent-glow, rgba(255,107,107,0.4))' : 'none',
              background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
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

  const symbols = isDark
    ? ['♩','♪','⭐','♫','♬','✦','𝄞','♩']
    : ['♩','♪','⭐','♫','🎵','✨','♬','🌟']

  const palette = {
    kids:    ['#ff6b6b','#ff9f43','#ffd93d','#4d96ff','#a29bfe','#fd79a8','#26de81','#ffd93d'],
    classic: ['#c9a84c','#e8c96d','#c9a84c','#e8c96d','#c9a84c','#e8c96d','#c9a84c','#e8c96d'],
    studio:  ['#a855f7','#c084fc','#22d3ee','#a855f7','#c084fc','#a855f7','#22d3ee','#c084fc'],
    rainbow: ['#f472b6','#fb923c','#facc15','#34d399','#22d3ee','#a78bfa','#e879f9','#fb923c'],
    neon:    ['#f43f5e','#f97316','#fbbf24','#10b981','#38bdf8','#a855f7','#f43f5e','#f97316'],
  }[themeId]

  const positions = [
    { top: '8%',  left: '5%',  size: '2rem',   delay: '0s',   dur: '4s'   },
    { top: '15%', left: '88%', size: '1.8rem',  delay: '0.5s', dur: '3.5s' },
    { top: '58%', left: '3%',  size: '1.5rem',  delay: '1s',   dur: '5s'   },
    { top: '72%', left: '92%', size: '2rem',    delay: '1.5s', dur: '4.2s' },
    { top: '38%', left: '95%', size: '1.4rem',  delay: '0.8s', dur: '3.8s' },
    { top: '82%', left: '10%', size: '1.5rem',  delay: '2s',   dur: '4.5s' },
    { top: '25%', left: '2%',  size: '1.6rem',  delay: '0.3s', dur: '3.2s' },
    { top: '48%', left: '96%', size: '1.4rem',  delay: '2.5s', dur: '4.8s' },
  ]

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--t-bg, #fffdf5)', transition: 'background 0.35s ease' }} />
      {positions.map((p, i) => (
        <div
          key={i}
          className="animate-float absolute select-none"
          style={{ top: p.top, left: p.left, fontSize: p.size, color: palette[i], animationDelay: p.delay, animationDuration: p.dur, opacity: isDark ? 0.3 : 0.55 }}
        >
          {symbols[i]}
        </div>
      ))}
      <div className="absolute rounded-full" style={{ width: 600, height: 400, top: '-5%',    left: '-5%',   background: `${palette[0]}14`, filter: 'blur(80px)' }} />
      <div className="absolute rounded-full" style={{ width: 500, height: 400, bottom: '-5%', right: '-5%',  background: `${palette[3]}11`, filter: 'blur(80px)' }} />
      <div className="absolute rounded-full" style={{ width: 400, height: 400, top: '40%',    left: '40%',   background: `${palette[6]}0d`, filter: 'blur(80px)' }} />
    </div>
  )
}

// ─── Header nav icon button ───────────────────────────────────────────────
function NavBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-2xl text-base transition-all hover:scale-110 active:scale-90"
      style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
    >
      {icon}
    </button>
  )
}

// ─── Auth button (login or avatar) ───────────────────────────────────────
function AuthBtn() {
  const { user, profile, openAuth } = useAuthStore()
  const navigate = useNavigate()

  if (user) {
    const initial = (profile?.username ?? user.email ?? '?')[0].toUpperCase()
    return (
      <button
        onClick={() => navigate('/profile')}
        title="Hồ sơ"
        className="flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-bold text-white transition-all hover:scale-110 active:scale-90"
        style={{ background: 'var(--accent)' }}
      >
        {initial}
      </button>
    )
  }
  return (
    <button
      onClick={openAuth}
      className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-bold transition-all hover:opacity-80 active:scale-95"
      style={{ background: 'var(--accent)', color: '#fff' }}
    >
      Đăng nhập
    </button>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────
function Header() {
  const { themeId } = useStore()
  const theme = THEMES[themeId]
  const isDark = theme.isDark
  const navigate = useNavigate()

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

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <div className="mx-1 h-5 w-px opacity-20" style={{ background: 'var(--t-text)' }} />
        <NavBtn icon="🏆" label="Bảng xếp hạng" onClick={() => navigate('/leaderboard')} />
        <AuthBtn />
        <span className="hidden sm:block font-mono text-[.5rem] t-dim ml-1">{__BUILD_INFO__}</span>
      </div>
    </header>
  )
}

// ─── Theme + Auth initializer ─────────────────────────────────────────────
function AppInit() {
  const themeId = useStore(s => s.themeId)
  const init = useAuthStore(s => s.init)
  useEffect(() => { applyTheme(themeId) }, [themeId])
  useEffect(() => { init() }, [init])
  return null
}

// ─── PWA install banner ───────────────────────────────────────────────────
function PwaInstallBanner() {
  const [prompt, setPrompt] = useState<any>(null)
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      analytics.pwaInstall('prompted')
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!prompt) return null

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-4 py-3 shadow-xl"
      style={{
        background: isDark ? 'rgba(30,15,50,0.95)' : 'rgba(255,255,255,0.97)',
        border: '1.5px solid var(--accent)',
        backdropFilter: 'blur(16px)',
        minWidth: 260,
      }}
    >
      <span style={{ fontSize: '1.4rem' }}>📲</span>
      <div className="flex-1">
        <div className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>Cài SonicEar</div>
        <div className="text-xs" style={{ color: 'var(--t-dim)' }}>Dùng offline, không cần mạng</div>
      </div>
      <button
        className="rounded-xl px-3 py-1.5 text-xs font-bold transition-opacity active:opacity-70"
        style={{ background: 'var(--accent)', color: '#fff' }}
        onClick={async () => {
          prompt.prompt()
          const { outcome } = await prompt.userChoice
          analytics.pwaInstall(outcome === 'accepted' ? 'accepted' : 'dismissed')
          setPrompt(null)
        }}
      >
        Cài
      </button>
      <button
        className="text-lg leading-none opacity-40 hover:opacity-70"
        style={{ color: 'var(--t-text)' }}
        onClick={() => { analytics.pwaInstall('dismissed'); setPrompt(null) }}
      >
        ×
      </button>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppInit />
      <FloatingDeco />
      <div className="relative z-[2] flex min-h-screen flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/practice" replace />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>
      <AuthModal />
      <UsernameModal />
      <PwaInstallBanner />
    </HashRouter>
  )
}
