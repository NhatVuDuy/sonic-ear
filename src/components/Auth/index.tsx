import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useStore } from '@/store'
import { THEMES } from '@/theme'

// ─── Shared input style ───────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string
  onChange: (v: string) => void; placeholder?: string
}) {
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold" style={{ color: 'var(--t-dim)' }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border px-3 py-2 text-sm outline-none transition-all focus:ring-2"
        style={{
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
          border: '1.5px solid var(--t-opt-border)',
          color: 'var(--t-text)',
          ['--tw-ring-color' as any]: 'var(--accent)',
        }}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'username'}
      />
    </label>
  )
}

// ─── Google button ────────────────────────────────────────────────────────
function GoogleBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all hover:opacity-80 active:scale-95"
      style={{ border: '1.5px solid var(--t-opt-border)', color: 'var(--t-text)', background: 'transparent' }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18Z"/>
        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"/>
      </svg>
      Tiếp tục với Google
    </button>
  )
}

// ─── Sign In form ─────────────────────────────────────────────────────────
function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuthStore()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Mật khẩu" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
      {error && <p className="rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(201,76,76,0.12)', color: '#c94c4c' }}>{error}</p>}
      <button
        type="submit" disabled={loading}
        className="rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        style={{ background: 'var(--accent)' }}
      >
        {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </button>
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--t-dim)' }}>
        <div className="h-px flex-1" style={{ background: 'var(--t-opt-border)' }} />
        hoặc
        <div className="h-px flex-1" style={{ background: 'var(--t-opt-border)' }} />
      </div>
      <GoogleBtn onClick={signInWithGoogle} />
      <p className="text-center text-xs" style={{ color: 'var(--t-dim)' }}>
        Chưa có tài khoản?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
          Đăng ký
        </button>
      </p>
    </form>
  )
}

// ─── Sign Up form ─────────────────────────────────────────────────────────
function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const { signUp, signInWithGoogle } = useAuthStore()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const err = await signUp(email, password, username)
    setLoading(false)
    if (err) setError(err)
    else setDone(true)
  }

  if (done) return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="text-4xl">📬</div>
      <p className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>Kiểm tra email để xác nhận tài khoản</p>
      <p className="text-xs" style={{ color: 'var(--t-dim)' }}>Sau khi xác nhận, quay lại đây và đăng nhập</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Tên hiển thị" value={username} onChange={setUsername} placeholder="Nguyễn Văn A" />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Mật khẩu (ít nhất 6 ký tự)" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
      {error && <p className="rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(201,76,76,0.12)', color: '#c94c4c' }}>{error}</p>}
      <button
        type="submit" disabled={loading}
        className="rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        style={{ background: 'var(--accent)' }}
      >
        {loading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
      </button>
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--t-dim)' }}>
        <div className="h-px flex-1" style={{ background: 'var(--t-opt-border)' }} />
        hoặc
        <div className="h-px flex-1" style={{ background: 'var(--t-opt-border)' }} />
      </div>
      <GoogleBtn onClick={signInWithGoogle} />
      <p className="text-center text-xs" style={{ color: 'var(--t-dim)' }}>
        Đã có tài khoản?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
          Đăng nhập
        </button>
      </p>
    </form>
  )
}

// ─── Set username modal (Google OAuth new users) ──────────────────────────
export function UsernameModal() {
  const { usernameModalOpen, setUsername } = useAuthStore()
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!usernameModalOpen) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const err = await setUsername(name)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl" style={{ background: isDark ? 'rgba(20,10,35,0.98)' : '#fff', border: '1.5px solid var(--accent)' }}>
        <div className="mb-6 text-center">
          <div className="mb-2 text-3xl">👋</div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>Chọn tên hiển thị</h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--t-dim)' }}>Tên này sẽ xuất hiện trên bảng xếp hạng</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Tên hiển thị" value={name} onChange={setName} placeholder="Nguyễn Văn A" />
          {error && <p className="rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(201,76,76,0.12)', color: '#c94c4c' }}>{error}</p>}
          <button
            type="submit" disabled={loading}
            className="rounded-xl py-2.5 text-sm font-bold text-white hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            {loading ? 'Đang lưu…' : 'Xác nhận'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Auth Modal ──────────────────────────────────────────────────────
export function AuthModal() {
  const { authModalOpen, closeAuth } = useAuthStore()
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark
  const [tab, setTab] = useState<'in' | 'up'>('in')

  if (!authModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) closeAuth() }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
        style={{
          background: isDark ? 'rgba(20,10,35,0.98)' : '#fff',
          border: '1.5px solid var(--t-opt-border)',
        }}
      >
        {/* Tabs */}
        <div className="mb-6 flex rounded-2xl p-1" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}>
          {(['in', 'up'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 rounded-xl py-2 text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--t-dim)',
              }}
            >
              {t === 'in' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          ))}
        </div>

        {tab === 'in'
          ? <SignInForm onSwitch={() => setTab('up')} />
          : <SignUpForm onSwitch={() => setTab('in')} />
        }
      </div>
    </div>
  )
}
