import { useNavigate } from 'react-router-dom'

// ── Small helpers ─────────────────────────────────────────────────────────────

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-6">
      <h2 className="font-display text-[1.2rem] font-bold pb-2"
        style={{ color: 'var(--t-text)', borderBottom: '2px solid var(--t-opt-border)' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-[.78rem] font-bold tracking-wider uppercase" style={{ color: 'var(--accent)' }}>{title}</h3>
      {children}
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[.72rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>{children}</p>
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="rounded-2xl p-4 overflow-x-auto font-mono text-[.68rem] leading-relaxed"
      style={{ background: 'rgba(0,0,0,0.06)', border: '1.5px solid var(--t-opt-border)', color: 'var(--t-text)' }}>
      {children}
    </pre>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1.5px solid var(--t-opt-border)' }}>
      <table className="w-full font-mono text-[.68rem]">
        <thead>
          <tr style={{ background: 'var(--t-opt-bg)', borderBottom: '1.5px solid var(--t-opt-border)' }}>
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-2.5 font-bold tracking-wider uppercase text-[.6rem]"
                style={{ color: 'var(--accent)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--t-opt-border)' : 'none' }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5" style={{ color: j === 0 ? 'var(--t-text)' : 'var(--t-dim)' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full px-2.5 py-0.5 font-mono text-[.6rem]"
      style={{ background: 'rgba(var(--accent-rgb,255,107,107),0.12)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb,255,107,107),0.2)' }}>
      {children}
    </span>
  )
}

// ── TOC items ──────────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',    label: '1. Tổng quan' },
  { id: 'stack',       label: '2. Tech stack' },
  { id: 'structure',   label: '3. Cấu trúc file' },
  { id: 'modules',     label: '4. Modules' },
  { id: 'audio',       label: '5. Audio engine' },
  { id: 'state',       label: '6. State management' },
  { id: 'sr',          label: '7. Spaced repetition' },
  { id: 'theme',       label: '8. Design system' },
  { id: 'routing',     label: '9. Routing' },
  { id: 'analytics',   label: '10. Analytics' },
  { id: 'auth',        label: '11. Auth & Cloud' },
  { id: 'pwa',         label: '12. PWA' },
  { id: 'roadmap',     label: '13. Roadmap' },
]

// ── Main component ────────────────────────────────────────────────────────────

export function SysPage() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 animate-[fadeUp_.32s_ease_both]">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/info')}
            className="rounded-xl px-3 py-1.5 font-mono text-[.72rem] transition-all hover:opacity-70"
            style={{ background: 'var(--t-opt-bg)', border: '2px solid var(--t-opt-border)', color: 'var(--t-dim)' }}
          >
            ← Giới thiệu
          </button>
          <div>
            <div className="font-display text-[1.4rem] font-bold t-lbl">⚙️ System Design</div>
            <div className="font-mono text-[.62rem] t-dim">SonicEar — Tài liệu kỹ thuật chi tiết</div>
          </div>
        </div>

        {/* TOC */}
        <div className="rounded-3xl p-5" style={{ background: 'var(--t-card-bg)', border: '1.5px solid var(--t-opt-border)' }}>
          <div className="font-mono text-[.65rem] tracking-widest mb-3" style={{ color: 'var(--accent)' }}>MỤC LỤC</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {TOC.map(t => (
              <a key={t.id} href={`#${t.id}`}
                className="font-mono text-[.68rem] hover:opacity-100 opacity-70 transition-opacity cursor-pointer"
                style={{ color: 'var(--t-text)' }}>
                {t.label}
              </a>
            ))}
          </div>
        </div>

        {/* 1. Overview */}
        <Section id="overview" title="1. Tổng Quan">
          <P>
            SonicEar là web app luyện cảm âm piano (Ear Training) dành cho người Việt. Người dùng nghe âm thanh
            được tổng hợp bằng Web Audio API và nhận diện quãng / hợp âm / gam / nốt đơn / tiến hành / tiết tấu.
            Toàn bộ logic chạy client-side — không cần backend để luyện tập.
          </P>
          <P>
            Dữ liệu tiến độ lưu trong localStorage (Zustand persist). Tuỳ chọn đồng bộ lên Supabase khi đăng nhập.
            App đóng gói thành PWA, cài được trên iOS và Android, hoạt động offline hoàn toàn.
          </P>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['7', 'Modules'],
              ['5', 'Themes'],
              ['~15k', 'LoC'],
              ['0', 'Backend deps'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl p-3 text-center"
                style={{ background: 'var(--t-opt-bg)', border: '1.5px solid var(--t-opt-border)' }}>
                <div className="font-display text-xl font-bold" style={{ color: 'var(--accent)' }}>{v}</div>
                <div className="font-mono text-[.58rem] tracking-wider mt-0.5" style={{ color: 'var(--t-dim)' }}>{l}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 2. Tech Stack */}
        <Section id="stack" title="2. Tech Stack">
          <Table
            headers={['Layer', 'Thư viện', 'Version', 'Ghi chú']}
            rows={[
              ['Framework',  'React',                '19',      'Concurrent mode, RSC-ready'],
              ['Language',   'TypeScript',            '6',       'strict: false (dev speed)'],
              ['Build',      'Vite (rolldown)',        '8',       'ESM native, không dùng rollup'],
              ['Styling',    'Tailwind CSS',           'v4',      '@tailwindcss/vite plugin, no postcss'],
              ['State',      'Zustand',               '5',       'persist middleware → localStorage'],
              ['Routing',    'React Router',           'v7',      'HashRouter (GitHub Pages compat)'],
              ['Audio',      'Web Audio API',          'native',  'Không dùng Tone.js hay thư viện ngoài'],
              ['Auth / DB',  'Supabase',              '2.x',     'Optional — tiến độ vẫn lưu local nếu chưa login'],
              ['PWA',        'vite-plugin-pwa',        '1.x',     'Workbox generateSW, offline cache'],
              ['Analytics',  'GA4',                   'gtag.js', 'module events: answer, level_up, theme'],
            ]}
          />
          <Sub title="Lý do chọn">
            <P>
              Vite 8 dùng Rolldown thay Rollup — build nhanh hơn đáng kể. Tailwind v4 loại bỏ toàn bộ config file,
              định nghĩa token trong @theme{} của CSS. Zustand 5 có API đơn giản, không cần context provider.
              HashRouter phù hợp deploy GitHub Pages tĩnh vì không cần server rewrite.
            </P>
          </Sub>
        </Section>

        {/* 3. File Structure */}
        <Section id="structure" title="3. Cấu Trúc File">
          <Code>{`src/
├── audio/
│   └── engine.ts          # AudioEngine class — singleton export \`audio\`
│                          # 8-oscillator piano synth, ADSR, reverb, chorus
├── theory/
│   └── index.ts           # NOTE_NAMES, INTERVALS, CHORDS, SCALES, utils
│                          # noteToHz(), shiftNote(), buildScaleNotes(), etc.
├── analytics/
│   └── index.ts           # GA4 wrapper — answerSubmitted, levelUp, themeChanged
├── components/
│   ├── Piano/
│   │   └── index.tsx      # Piano keyboard component — highlighted keys, onKeyPress
│   ├── UI/
│   │   └── index.tsx      # Card, CardTitle, Btn, PlayBtn, FeedbackBar,
│   │                      # OptionBtn, StatBox, ProgressBar, NoteBubble, ModuleTabs
│   └── Auth/
│       └── index.tsx      # AuthModal, UsernameModal — Supabase auth UI
├── modules/
│   ├── Interval/index.tsx # SR: iv:N  — 11 intervals, 3 difficulties
│   ├── Chord/
│   │   ├── index.tsx      # Re-export
│   │   └── ChordModule.tsx# SR: ch:KEY — 12 chord types, block+arp
│   ├── Scale/
│   │   ├── index.tsx
│   │   └── ScaleModule.tsx# SR: sc:KEY — 8 scales, ascending+descending
│   ├── Note/
│   │   ├── index.tsx
│   │   └── NoteModule.tsx # SR: nt:N  — 12 chromatic notes, piano UI
│   ├── ChordProgression/
│   │   └── index.tsx      # SR: pg:KEY — 6 progressions, 22 XP
│   ├── Rhythm/
│   │   └── index.tsx      # SR: rh:KEY — 7 rhythms, click-track, 14 XP
│   └── FreePiano/
│       └── index.tsx      # Free exploration, no SR tracking
├── store/
│   ├── index.ts           # Main store — XP, level, history, stage, theme
│   ├── sr.ts              # SM-2 spaced repetition store
│   ├── settings.ts        # Audio settings — volume, reverb, scaleTempo
│   └── auth.ts            # Supabase auth store
├── pages/
│   ├── Practice/index.tsx # Main practice UI — stage tabs, gamification bar
│   ├── Dashboard/index.tsx# Stats — heatmap 35d, module breakdown, weak spots
│   ├── Info/index.tsx     # Landing page — modules, features, how-to
│   ├── Sys/index.tsx      # This page — system design documentation
│   ├── Settings/index.tsx # Audio sliders, scale tempo, reset progress
│   ├── Profile/index.tsx  # User profile — Supabase stats
│   └── Leaderboard/       # Global leaderboard via Supabase
├── theme/
│   └── index.ts           # 5 themes × module accents — applyTheme()
├── App.tsx                # Router + Header + FloatingDeco + PWA banner
├── main.tsx               # React.createRoot entry
├── index.css              # Tailwind v4 @theme tokens + base styles + @keyframes
└── vite-env.d.ts          # __BUILD_INFO__ global declare`}
          </Code>
        </Section>

        {/* 4. Modules */}
        <Section id="modules" title="4. Modules">
          <Table
            headers={['Module', 'SR Key', 'XP', 'Pool', 'Đặc điểm']}
            rows={[
              ['Interval',     'iv:N (0–10)',   '12', '11 quãng', '3 modes: basic/medium/all; root C4'],
              ['Chord',        'ch:KEY',        '12', '12 loại',  'Block + Arpeggio; random root C3–C5'],
              ['Scale',        'sc:KEY',        '12', '8 gam',    'Lên + xuống; audio.playScale()'],
              ['Note',         'nt:N (0–11)',   '12', '12 nốt',   'Piano keyboard UI; highlight nốt đúng'],
              ['Progression',  'pg:KEY',        '22', '6 tiến hành', 'Block + Arpeggio; 2 root octaves'],
              ['Rhythm',       'rh:KEY',        '14', '7 tiết tấu', 'Click-track C4/C5; NoteBox visual'],
              ['FreePiano',    '— (no SR)',      '—', '—',         'Attack/Release events; 2 octaves'],
            ]}
          />
          <Sub title="Cấu trúc chung của mỗi module">
            <Code>{`// Pattern lặp lại trong tất cả interactive modules
const { onCorrect, onWrong } = useStore()
const { record: srRecord } = useSRStore()

const newQ = useCallback((m: Mode = mode) => {
  const pool = getPool(m)
  const pick = srWeightedPick(pool, k => \`prefix:\${k}\`)  // SM-2 weighted
  // ... build question + shuffled options
  setTimeout(() => playAudio(...), 500)         // auto-play on new question
}, [mode])

const answer = (key: string) => {
  if (answered || !q) return
  setAnswered(true); setSelected(key)
  const ok = key === q.answer
  srRecord(\`prefix:\${q.key}\`, ok)             // update SM-2 card
  if (ok) onCorrect(XP_VALUE); else onWrong()  // update global stats
}`}
            </Code>
          </Sub>
        </Section>

        {/* 5. Audio Engine */}
        <Section id="audio" title="5. Audio Engine">
          <Sub title="Signal chain">
            <Code>{`Oscillators (8x) → GainNode → EnvelopeGain (ADSR)
  → BiquadFilter (lowpass, velocity-to-brightness)
  → BiquadFilter (presence peak @ 2.2kHz, +2.5dB)
  → DryGain (0.58 + (1-reverb)×0.42) → DynamicsCompressor → MasterGain
  → ReverbConvolver (3.8s impulse) → ReverbGain (reverb×0.42) ↗`}
            </Code>
          </Sub>
          <Sub title="Oscillator mix (per note)">
            <Table
              headers={['Osc', 'Type', 'Freq', 'Gain', 'Pan', 'Mục đích']}
              rows={[
                ['1', 'triangle', 'hz',         '0.35', 'center', 'Fundamental'],
                ['2', 'triangle', 'hz × 0.99769', '0.15', '−0.22', 'Chorus −4 cents, trái'],
                ['3', 'triangle', 'hz × 1.00231', '0.15', '+0.22', 'Chorus +4 cents, phải'],
                ['4', 'sawtooth', 'hz × 1.003',  '0.06', 'center', 'Brightness nhẹ'],
                ['5', 'sine',     'hz × 0.5',    '0.22', 'center', 'Sub octave ấm'],
                ['6', 'sine',     'hz × 2.0005', '0.14', 'center', 'Harmonic 2nd (inharmonic)'],
                ['7', 'sine',     'hz × 3.001',  '0.05', 'center', 'Harmonic 3rd'],
                ['8', 'sine',     'hz × 4.002',  '0.02', 'center', 'Harmonic 4th'],
              ]}
            />
          </Sub>
          <Sub title="ADSR">
            <Code>{`env.gain.setValueAtTime(0, now)
env.gain.linearRampToValueAtTime(velocity × 0.90, now + 0.001)   // 1ms attack
env.gain.exponentialRampToValueAtTime(velocity × 0.55, now + 0.081) // 80ms fast decay
env.gain.exponentialRampToValueAtTime(velocity × 0.10, now + 2.9)   // 2.8s sustain fade
// Release: exponential ramp to 0.0001 over 2.2s (or 0.04s if immediate)`}
            </Code>
          </Sub>
          <Sub title="iOS Audio Routing">
            <P>
              Web Audio mặc định dùng AVAudioSessionCategoryAmbient — bị tắt tiếng bởi mute switch.
              Safari browser: masterGain → MediaStreamDestination → {'<audio>'} srcObject → kích hoạt Playback category.
              PWA standalone (WKWebView): srcObject không hoạt động → dùng ac.destination trực tiếp.
              Detect: navigator.userAgent + navigator.standalone.
            </P>
          </Sub>
          <Sub title="Public API">
            <Code>{`audio.attack(ns, velocity)                    // start note (sustain)
audio.release(ns, immediate?)                 // stop note (fade or cut)
audio.releaseAll()                            // stop all voices
audio.playNote(ns, duration, velocity, delay) // one-shot with auto-release
audio.playNotes(noteStrs, arp, velocity)      // chord or arpeggio
audio.playScale(noteStrs, tempo?)             // ascending + descending
audio.setVolume(0–1)                          // live update masterGain
audio.setReverb(0–1)                          // live update dry/wet gains
audio.scaleTempo                              // seconds-per-note property
audio.warmUp()                                // create + resume AudioContext`}
            </Code>
          </Sub>
        </Section>

        {/* 6. State management */}
        <Section id="state" title="6. State Management">
          <Table
            headers={['Store', 'File', 'Persist key', 'Nội dung']}
            rows={[
              ['useStore',    'store/index.ts',    'sonicear-v1',          'XP, level, correct, wrong, streak, history (500), stage, theme, difficulty'],
              ['useSRStore',  'store/sr.ts',        'sonicear-sr-v1',       'SM-2 cards: ease, interval, reps, dueAt, correct, wrong per question key'],
              ['useSettings', 'store/settings.ts',  'sonicear-settings-v1', 'volume (0–1), reverbMix (0–1), scaleTempo (s/note)'],
              ['useAuthStore','store/auth.ts',       'sonicear-auth-v1',     'Supabase user, profile, sync methods'],
            ]}
          />
          <Sub title="Session tracking">
            <P>
              _stageCorrect / _stageWrong / _stageStart là non-persisted fields (không lưu localStorage).
              Khi setStage() được gọi, nếu đã có ít nhất 1 câu trả lời, auto-save một SessionResult vào history[].
              Dashboard đọc history[] để render heatmap và module breakdown.
            </P>
          </Sub>
          <Sub title="Supabase sync">
            <P>
              scheduleSync() debounce 10s sau mỗi onCorrect/onWrong — gọi syncStats() để upsert row trong bảng profiles.
              addHistory() gọi pushSession() để insert vào bảng game_sessions.
              Toàn bộ sync là optional — app chạy hoàn toàn offline không có Supabase.
            </P>
          </Sub>
        </Section>

        {/* 7. Spaced Repetition */}
        <Section id="sr" title="7. Spaced Repetition (SM-2)">
          <Sub title="Card fields">
            <Code>{`interface SRCard {
  ease: number      // easiness factor: 1.3–2.5, default 2.0
  interval: number  // days until next review
  reps: number      // consecutive correct streak
  dueAt: number     // timestamp ms — next due date
  correct: number   // lifetime correct count
  wrong: number     // lifetime wrong count
}`}
            </Code>
          </Sub>
          <Sub title="Update algorithm">
            <Code>{`const q = isCorrect ? 5 : 1   // quality score (SM-2 uses 0–5)
const newEase = clamp(1.3, 2.5, card.ease + 0.1 - (5 - q) × 0.08)

// Interval scheduling
wrong  → 30 min  (interval = 0.02 days)
reps=1 → 12 h    (interval = 0.5 days)
reps=2 → 1 day
reps≥3 → round(prev_interval × newEase)  // exponential growth`}
            </Code>
          </Sub>
          <Sub title="Weighted pick">
            <Code>{`// srWeightedPick(pool, keyFn) — used by every module
weight = 1.0
if (unseen)              weight = 2.0   // prefer unseen
if (dueAt <= now)        weight × = 4.0  // overdue: strongly prefer
if (accuracy < 0.6)      weight × = 1 + (0.6 - accuracy) × 3  // struggling`}
            </Code>
          </Sub>
          <Sub title="SR keys by module">
            <P>
              iv:0–iv:10 (quãng) · ch:major, ch:minor, ch:dim7 ... (hợp âm) · sc:major, sc:dorian ...
              nt:0–nt:11 (nốt) · pg:I-IV-V-I, pg:pop ... (tiến hành) · rh:4q, rh:3q ... (tiết tấu)
            </P>
          </Sub>
        </Section>

        {/* 8. Design System */}
        <Section id="theme" title="8. Design System">
          <Sub title="5 Themes">
            <Table
              headers={['ID', 'Name', 'Style', 'Dark?', 'Accent']}
              rows={[
                ['kids',    '🎨 Kids',    'Bright, playful, pastel',    'No',  '#ff6b6b coral red'],
                ['classic', '🎵 Classic', 'Gold, dark wood piano',       'No',  '#c9a84c antique gold'],
                ['studio',  '🎛️ Studio',  'Deep purple/teal, dark pro',  'Yes', '#a855f7 purple'],
                ['rainbow', '🌈 Rainbow', 'Soft rainbow pastels',         'No',  '#f472b6 pink'],
                ['neon',    '⚡ Neon',    'Black + electric neon',        'Yes', '#f43f5e neon red'],
              ]}
            />
          </Sub>
          <Sub title="Mỗi theme có module accents riêng">
            <Code>{`// moduleAccents[stage] = { accent, accentDark, glow, subtle, label, emoji }
// Ví dụ: kids theme, interval module
{ accent: '#4d96ff', accentDark: '#2563eb', glow: 'rgba(77,150,255,0.4)',
  subtle: 'rgba(77,150,255,0.06)', label: 'Quãng', emoji: '🎯' }

// Khi user chọn stage, Practice page override CSS variables:
--accent:      ma.accent
--accent-dark: ma.accentDark
--accent-glow: ma.glow`}
            </Code>
          </Sub>
          <Sub title="Typography">
            <Table
              headers={['Class', 'Font', 'Usage']}
              rows={[
                ['font-display', 'Playfair Display', 'Tiêu đề, số lớn, brand name'],
                ['font-mono',    'DM Mono',           'Labels, badges, code, stats'],
                ['body',         'Cormorant Garamond', 'Text dài, descriptions'],
              ]}
            />
          </Sub>
          <Sub title="CSS token system (Tailwind v4)">
            <Code>{`/* index.css */
@theme {
  --color-gold: #c9a84c;
  --color-ok:   #4caf82;
  --color-bad:  #c94c4c;
  /* ... */
}

/* Runtime theme vars (applied via applyTheme()) */
:root {
  --t-bg, --t-header-bg, --t-card-bg, --t-card-shadow,
  --t-text, --t-dim, --t-opt-bg, --t-opt-border,
  --accent, --accent-dark, --accent-glow, ...
}

/* No tailwind.config.js — custom tokens in @theme {} */
/* Custom utilities in @layer utilities {} */`}
            </Code>
          </Sub>
        </Section>

        {/* 9. Routing */}
        <Section id="routing" title="9. Routing">
          <Table
            headers={['Path', 'Component', 'Mô tả']}
            rows={[
              ['/',             'Navigate → /practice', 'Redirect'],
              ['/practice',     'PracticePage',         'Trang luyện tập chính — 7 module tabs'],
              ['/dashboard',    'DashboardPage',        'Thống kê — heatmap, accuracy, weak spots'],
              ['/info',         'InfoPage',             'Landing page — giới thiệu dự án'],
              ['/sys',          'SysPage',              'System design — tài liệu kỹ thuật'],
              ['/settings',     'SettingsPage',         'Âm thanh, tốc độ gam, reset data'],
              ['/profile',      'ProfilePage',          'Hồ sơ Supabase user'],
              ['/leaderboard',  'LeaderboardPage',      'Bảng xếp hạng global'],
            ]}
          />
          <P>
            HashRouter được chọn để tương thích GitHub Pages (không cần server-side rewrite).
            Header NavBtn icons: 📊 Dashboard, 🏆 Leaderboard, ⚙️ Settings, Auth button.
          </P>
        </Section>

        {/* 10. Analytics */}
        <Section id="analytics" title="10. Analytics (GA4)">
          <Sub title="Events được track">
            <Code>{`analytics.answerSubmitted({ module, correct, difficulty, streak })
analytics.levelUp(level, totalXp)
analytics.themeChanged(themeId)
analytics.stageChanged(stageId)
analytics.pwaInstall('prompted' | 'accepted' | 'dismissed')`}
            </Code>
          </Sub>
          <P>
            Measurement ID cần cấu hình trong .env (VITE_GA_ID). Nếu không có sẽ log ra console thay vì gửi lên GA4.
            Không track PII. Không dùng cookies third-party.
          </P>
        </Section>

        {/* 11. Auth */}
        <Section id="auth" title="11. Auth & Cloud (Supabase)">
          <Sub title="Luồng auth">
            <P>
              Magic link qua email hoặc OAuth Google. Sau khi login, useAuthStore.init() lắng nghe
              onAuthStateChange và load profile từ bảng profiles. Username chọn lần đầu qua UsernameModal.
            </P>
          </Sub>
          <Sub title="Database schema">
            <Code>{`-- profiles (upserted mỗi 10s sau khi có thay đổi)
id uuid PK references auth.users
username text UNIQUE
total_xp int, level int, correct int, wrong int

-- game_sessions (inserted sau mỗi session)
id uuid PK, user_id uuid FK
stage text, correct int, wrong int
xp_earned int, duration_ms int, played_at timestamptz`}
            </Code>
          </Sub>
          <Sub title="Env vars cần thiết">
            <Code>{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_GA_ID=G-XXXXXXXXXX          # GA4 Measurement ID
VITE_ADSENSE_ID=ca-pub-XXXXXXXX  # AdSense publisher (placeholder)`}
            </Code>
          </Sub>
        </Section>

        {/* 12. PWA */}
        <Section id="pwa" title="12. PWA">
          <Sub title="Config (vite.config.ts)">
            <Code>{`VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'SonicEar', short_name: 'SonicEar',
    theme_color: '#ff6b6b', background_color: '#fffdf5',
    display: 'standalone', start_url: '/',
    icons: [{ src: '/icon-192.png', ... }, { src: '/icon-512.png', ... }]
  },
  workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] }
})`}
            </Code>
          </Sub>
          <P>
            generateSW mode — Workbox tự generate service worker. Precache tất cả assets.
            PwaInstallBanner hiện khi browser fire beforeinstallprompt (Android Chrome).
            iOS: "Add to Home Screen" thủ công. PWA standalone trên iOS: WKWebView, audio route trực tiếp đến ac.destination.
          </P>
        </Section>

        {/* 13. Roadmap */}
        <Section id="roadmap" title="13. Roadmap">
          <Sub title="Đã xong ✅">
            <div className="flex flex-wrap gap-2">
              {[
                'Audio Engine (8-osc piano synth)',
                'Theory module (intervals, chords, scales)',
                'Piano component',
                'Interval module',
                'Chord module',
                'Scale module',
                'Note module',
                'Free Piano',
                'Chord Progression module',
                'Rhythm module',
                'Spaced Repetition (SM-2)',
                'Dashboard (heatmap, breakdown, weak spots)',
                'Settings page',
                'Info landing page',
                'System Design page',
                '5 themes × module accents',
                'Gamification (XP, level, streak)',
                'Session history (500 entries)',
                'Supabase auth + profiles + game_sessions',
                'Global leaderboard',
                'GA4 analytics',
                'PWA (offline, install banner)',
                'iOS audio routing fix',
                'Keyboard shortcuts (Space, 1–8)',
              ].map(f => (
                <span key={f} className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[.63rem]"
                  style={{ background: 'rgba(76,175,130,0.1)', color: '#4caf82', border: '1px solid rgba(76,175,130,0.25)' }}>
                  ✓ {f}
                </span>
              ))}
            </div>
          </Sub>
          <Sub title="Còn lại 🔜">
            <div className="flex flex-wrap gap-2">
              {[
                'Dictation module (nghe giai điệu, chép lại)',
                'Claude API — AI feedback cá nhân hoá',
                'Mobile app (Capacitor)',
                'iOS mute switch bypass (BACKLOG)',
                'GA4 real Measurement ID',
                'AdSense real publisher/slot IDs',
                'Supabase schema.sql deploy',
              ].map(f => (
                <span key={f} className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[.63rem]"
                  style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' }}>
                  ◦ {f}
                </span>
              ))}
            </div>
          </Sub>
        </Section>

        {/* Footer */}
        <div className="text-center py-6 flex flex-col gap-2">
          <div className="flex flex-wrap justify-center gap-2">
            {['React 19','TypeScript 6','Vite 8','Tailwind v4','Zustand 5','Web Audio API','Supabase','PWA'].map(t => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <p className="font-mono text-[.6rem] mt-2" style={{ color: 'var(--t-dim)', opacity: 0.5 }}>
            sonicear.zenpax.io.vn · {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </div>
  )
}
