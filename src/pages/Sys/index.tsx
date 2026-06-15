import { useNavigate } from 'react-router-dom'

// ── Layout helpers ────────────────────────────────────────────────────────────
function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-5 scroll-mt-6">
      <div style={{ borderBottom: '2px solid var(--t-opt-border)', paddingBottom: 10 }}>
        <h2 className="font-display text-[1.2rem] font-bold" style={{ color: 'var(--t-text)' }}>{title}</h2>
        {sub && <p className="font-mono text-[.68rem] mt-0.5" style={{ color: 'var(--t-dim)' }}>{sub}</p>}
      </div>
      {children}
    </section>
  )
}

function Label({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="font-mono text-[.6rem] font-bold tracking-wider"
      style={{ color, background: `${color}14`, border: `1px solid ${color}30`, borderRadius: 6, padding: '2px 7px' }}>
      {children}
    </span>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[.7rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>{children}</p>
}

// ── Visual table ──────────────────────────────────────────────────────────────
function VTable({ headers, rows, widths }: { headers: string[]; rows: (string | React.ReactNode)[][]; widths?: string[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1.5px solid var(--t-opt-border)' }}>
      <table className="w-full font-mono text-[.68rem]" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--t-opt-bg)' }}>
            {headers.map((h, i) => (
              <th key={h} className="text-left px-4 py-2.5 font-bold tracking-wider text-[.6rem]"
                style={{ color: 'var(--accent)', borderBottom: '1.5px solid var(--t-opt-border)', width: widths?.[i] }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--t-opt-border)' : 'none' }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5" style={{ color: j === 0 ? 'var(--t-text)' : 'var(--t-dim)', verticalAlign: 'top' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Code block ────────────────────────────────────────────────────────────────
function Code({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--t-opt-border)' }}>
      {title && (
        <div className="px-4 py-2 font-mono text-[.62rem] font-bold tracking-wider"
          style={{ background: 'var(--t-opt-bg)', color: 'var(--accent)', borderBottom: '1px solid var(--t-opt-border)' }}>
          {title}
        </div>
      )}
      <pre className="px-4 py-4 overflow-x-auto font-mono text-[.67rem] leading-[1.7]"
        style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--t-text)' }}>
        {children}
      </pre>
    </div>
  )
}

// ── 1. Architecture layer diagram ─────────────────────────────────────────────
const LAYERS = [
  {
    label: 'Presentation Layer',
    color: '#4d96ff',
    icon: '🖥️',
    items: [
      { name: 'Pages', detail: 'Practice · Dashboard · Info · Sys · Settings · Profile · Leaderboard' },
      { name: 'Components', detail: 'Piano · Card · FeedbackBar · OptionBtn · ModuleTabs · StatBox' },
      { name: 'Themes', detail: '5 themes × moduleAccents · applyTheme() · CSS variable injection' },
      { name: 'Router', detail: 'HashRouter · 8 routes · NavBtn header icons' },
    ],
  },
  {
    label: 'State Layer',
    color: '#a855f7',
    icon: '🗃️',
    items: [
      { name: 'useStore', detail: 'XP · level · correct · wrong · streak · history[500] · stage · theme' },
      { name: 'useSRStore', detail: 'SM-2 cards: ease · interval · reps · dueAt · correct · wrong' },
      { name: 'useSettings', detail: 'volume · reverbMix · scaleTempo → live audio engine updates' },
      { name: 'useAuthStore', detail: 'Supabase user · profile · syncStats() · pushSession()' },
    ],
  },
  {
    label: 'Domain Layer',
    color: '#f43f5e',
    icon: '⚙️',
    items: [
      { name: 'AudioEngine', detail: '8-osc piano synth · ADSR · reverb convolver · compressor · iOS routing' },
      { name: 'Theory', detail: 'noteToHz() · shiftNote() · buildScaleNotes() · INTERVALS · CHORDS · SCALES' },
      { name: 'SM-2 Algorithm', detail: 'sm2Update() · srWeightedPick() · weighted by due / struggling / unseen' },
      { name: 'Analytics', detail: 'GA4 gtag wrapper · answerSubmitted · levelUp · themeChanged · pwaInstall' },
    ],
  },
  {
    label: 'Infrastructure Layer',
    color: '#10b981',
    icon: '🏗️',
    items: [
      { name: 'Web Audio API', detail: 'AudioContext · OscillatorNode · BiquadFilter · ConvolverNode · GainNode' },
      { name: 'localStorage', detail: 'sonicear-v1 · sonicear-sr-v1 · sonicear-settings-v1 · sonicear-auth-v1' },
      { name: 'Supabase', detail: 'Auth (magic link / OAuth) · profiles table · game_sessions table' },
      { name: 'PWA / ServiceWorker', detail: 'Workbox generateSW · precache 13 entries · offline-first · install banner' },
    ],
  },
]

function ArchDiagram() {
  return (
    <div className="flex flex-col gap-2.5">
      {LAYERS.map((layer, li) => (
        <div key={layer.label}>
          <div className="rounded-2xl p-4" style={{ border: `2px solid ${layer.color}35`, background: `${layer.color}06` }}>
            <div className="flex items-center gap-2 mb-3">
              <span>{layer.icon}</span>
              <span className="font-mono text-[.7rem] font-bold tracking-wider" style={{ color: layer.color }}>
                {layer.label.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {layer.items.map(item => (
                <div key={item.name} className="rounded-xl p-2.5"
                  style={{ background: `${layer.color}10`, border: `1px solid ${layer.color}25` }}>
                  <div className="font-mono text-[.68rem] font-bold mb-1" style={{ color: layer.color }}>{item.name}</div>
                  <div className="font-mono text-[.6rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
          {li < LAYERS.length - 1 && (
            <div className="flex justify-center my-0.5">
              <div className="flex flex-col items-center gap-0" style={{ color: 'var(--t-dim)', opacity: 0.5 }}>
                <div style={{ width: 2, height: 10, background: 'var(--t-opt-border)' }} />
                <div className="font-mono text-[.7rem]">⇅</div>
                <div style={{ width: 2, height: 10, background: 'var(--t-opt-border)' }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── 2. Audio signal chain ─────────────────────────────────────────────────────
const CHAIN_NODES = [
  { label: '8× Osc', sub: 'tri×4\nsaw×1\nsin×3', color: '#4d96ff' },
  { label: 'Gain Mix', sub: 'per-osc\ngain', color: '#60a5fa' },
  { label: 'ADSR\nEnvelope', sub: '1ms att\n80ms dec\n2.8s sus', color: '#a855f7' },
  { label: 'LPF\nBrightness', sub: 'vel→freq\nQ=0.45', color: '#c084fc' },
  { label: 'Presence EQ', sub: '2.2kHz\n+2.5dB pk', color: '#f43f5e' },
  { label: 'Compressor', sub: '-16dB thr\n3:1 ratio', color: '#f97316' },
  { label: 'Master\nGain', sub: 'vol 0–1\niOS route', color: '#10b981' },
]

function AudioChain() {
  return (
    <div className="flex flex-col gap-4">
      {/* Main chain */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start gap-1.5 min-w-max">
          {CHAIN_NODES.map((n, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-xl px-3 py-2.5 text-center flex-shrink-0"
                  style={{ background: `${n.color}15`, border: `2px solid ${n.color}40`, minWidth: 72 }}>
                  <div className="font-mono text-[.65rem] font-bold whitespace-pre-line leading-tight" style={{ color: n.color }}>
                    {n.label}
                  </div>
                  <div className="font-mono text-[.55rem] mt-1.5 whitespace-pre-line leading-tight" style={{ color: 'var(--t-dim)' }}>
                    {n.sub}
                  </div>
                </div>
                {/* Reverb branch split */}
                {i === 4 && (
                  <div className="flex flex-col items-center">
                    <div style={{ width: 1.5, height: 10, background: 'var(--t-opt-border)' }} />
                    <div className="rounded-xl px-3 py-2 text-center"
                      style={{ background: '#f59e0b15', border: '2px solid #f59e0b40', minWidth: 72 }}>
                      <div className="font-mono text-[.62rem] font-bold" style={{ color: '#f59e0b' }}>Reverb</div>
                      <div className="font-mono text-[.55rem] mt-1" style={{ color: 'var(--t-dim)' }}>3.8s conv\n42% wet</div>
                    </div>
                  </div>
                )}
              </div>
              {i < CHAIN_NODES.length - 1 && (
                <div className="font-mono text-[.9rem] mt-3 flex-shrink-0" style={{ color: 'var(--t-dim)', opacity: 0.5 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Oscillator mix table */}
      <VTable
        headers={['#', 'Type', 'Freq', 'Gain', 'Pan', 'Purpose']}
        rows={[
          ['1', 'triangle', 'hz',          '0.35', 'C', 'Fundamental'],
          ['2', 'triangle', 'hz×0.99769',  '0.15', 'L −0.22', 'Chorus −4¢'],
          ['3', 'triangle', 'hz×1.00231',  '0.15', 'R +0.22', 'Chorus +4¢'],
          ['4', 'sawtooth', 'hz×1.003',    '0.06', 'C', 'Brightness'],
          ['5', 'sine',     'hz×0.5',      '0.22', 'C', 'Sub octave'],
          ['6', 'sine',     'hz×2.0005',   '0.14', 'C', '2nd partial'],
          ['7', 'sine',     'hz×3.001',    '0.05', 'C', '3rd partial'],
          ['8', 'sine',     'hz×4.002',    '0.02', 'C', '4th partial'],
        ]}
      />
    </div>
  )
}

// ── 3. SM-2 flowchart ─────────────────────────────────────────────────────────
function SM2Flow() {
  const box = (text: string, color: string, sub?: string) => (
    <div className="rounded-xl px-4 py-2.5 text-center"
      style={{ background: `${color}14`, border: `2px solid ${color}40`, minWidth: 130 }}>
      <div className="font-mono text-[.68rem] font-bold" style={{ color }}>{text}</div>
      {sub && <div className="font-mono text-[.58rem] mt-0.5" style={{ color: 'var(--t-dim)' }}>{sub}</div>}
    </div>
  )
  const arrow = (label?: string, dir: 'down' | 'right' = 'down') => (
    dir === 'down'
      ? <div className="flex flex-col items-center gap-0 my-0.5">
          <div style={{ width: 2, height: 10, background: 'var(--t-opt-border)' }} />
          {label && <div className="font-mono text-[.58rem] px-1.5" style={{ color: 'var(--t-dim)' }}>{label}</div>}
          <div className="font-mono text-sm" style={{ color: 'var(--t-dim)' }}>↓</div>
        </div>
      : <div className="flex items-center gap-0 mx-1">
          {label && <div className="font-mono text-[.58rem]" style={{ color: 'var(--t-dim)' }}>{label}</div>}
          <div className="font-mono text-sm" style={{ color: 'var(--t-dim)' }}>→</div>
        </div>
  )

  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {box('Câu hỏi mới', '#4d96ff', 'srWeightedPick(pool, keyFn)')}
      {arrow()}
      {box('Người dùng trả lời', '#a855f7')}
      {arrow()}
      {/* Branch */}
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center">
          {box('✓ Đúng', '#10b981', 'q = 5')}
          {arrow()}
          {box('ease ↑', '#10b981', 'ease + 0.02\n(max 2.5)')}
          {arrow()}
          {box('reps + 1', '#10b981')}
          {arrow()}
          <div className="rounded-xl px-3 py-2 text-center" style={{ background: '#10b98114', border: '2px solid #10b98140' }}>
            <div className="font-mono text-[.62rem] font-bold mb-1" style={{ color: '#10b981' }}>Interval</div>
            {[
              ['reps=1', '12 giờ'],
              ['reps=2', '1 ngày'],
              ['reps≥3', 'prev×ease'],
            ].map(([k, v]) => (
              <div key={k} className="font-mono text-[.58rem] flex gap-2 justify-center" style={{ color: 'var(--t-dim)' }}>
                <span style={{ color: '#10b981' }}>{k}</span>→ {v}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center mt-12 gap-0">
          <div className="font-mono text-[.68rem] px-3 py-1.5 rounded-full"
            style={{ background: 'var(--t-opt-bg)', border: '1.5px solid var(--t-opt-border)', color: 'var(--t-dim)' }}>
            Đúng / Sai?
          </div>
        </div>
        <div className="flex flex-col items-center">
          {box('✗ Sai', '#f43f5e', 'q = 1')}
          {arrow()}
          {box('ease ↓', '#f43f5e', 'ease − 0.32\n(min 1.3)')}
          {arrow()}
          {box('reps = 0', '#f43f5e')}
          {arrow()}
          {box('Interval = 30 phút', '#f43f5e', '0.02 fractional days')}
        </div>
      </div>
      {arrow()}
      {box('dueAt = now + interval × 86400000', '#f59e0b', 'Lên lịch lần ôn tiếp theo')}
      {arrow()}
      {box('srWeightedPick → ưu tiên due cards ×4', '#4d96ff')}
    </div>
  )
}

// ── 4. State management diagram ───────────────────────────────────────────────
const STORES = [
  {
    name: 'useStore', key: 'sonicear-v1', color: '#4d96ff',
    fields: ['correct, wrong, streak', 'xp, level, score', 'history[500]', 'currentStage', 'themeId, difficulty'],
    actions: ['onCorrect(xp)', 'onWrong()', 'setStage(s)', 'addHistory(r)', 'reset()'],
  },
  {
    name: 'useSRStore', key: 'sonicear-sr-v1', color: '#a855f7',
    fields: ['cards: Record<key, SRCard>', '  ease: 1.3–2.5', '  interval: days', '  reps, dueAt', '  correct, wrong'],
    actions: ['record(key, bool)', 'getCard(key)', 'weakSpots(prefix)', 'reset()'],
  },
  {
    name: 'useSettings', key: 'sonicear-settings-v1', color: '#10b981',
    fields: ['volume: 0–1', 'reverbMix: 0–1', 'scaleTempo: s/note'],
    actions: ['update(patch)'],
    note: '→ audio.setVolume()\n→ audio.setReverb()\n→ audio.scaleTempo',
  },
  {
    name: 'useAuthStore', key: 'sonicear-auth-v1', color: '#f59e0b',
    fields: ['user: SupabaseUser', 'profile: { username }', 'openAuth flag'],
    actions: ['init()', 'syncStats()', 'pushSession()', 'openAuth()'],
    note: 'Optional — app works\nwithout Supabase',
  },
]

function StoresDiagram() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {STORES.map(s => (
        <div key={s.name} className="rounded-2xl p-4" style={{ border: `2px solid ${s.color}30`, background: `${s.color}06` }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-mono text-[.7rem] font-bold" style={{ color: s.color }}>{s.name}</span>
            <span className="font-mono text-[.57rem] rounded-full px-2 py-0.5"
              style={{ background: `${s.color}14`, color: s.color, border: `1px solid ${s.color}30` }}>
              {s.key}
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[.58rem] mb-1 uppercase tracking-wider" style={{ color: 'var(--t-dim)', opacity: 0.7 }}>State</div>
              {s.fields.map(f => (
                <div key={f} className="font-mono text-[.62rem] mb-0.5" style={{ color: 'var(--t-dim)' }}>· {f}</div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[.58rem] mb-1 uppercase tracking-wider" style={{ color: 'var(--t-dim)', opacity: 0.7 }}>Actions</div>
              {s.actions.map(a => (
                <div key={a} className="font-mono text-[.62rem] mb-0.5" style={{ color: s.color }}>→ {a}</div>
              ))}
              {s.note && (
                <div className="font-mono text-[.58rem] mt-2 leading-relaxed whitespace-pre-line"
                  style={{ color: 'var(--t-dim)', opacity: 0.7 }}>{s.note}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 5. Module matrix ──────────────────────────────────────────────────────────
function ModuleMatrix() {
  const mods = [
    { name: '🎯 Interval',    srKey: 'iv:N',   xp: 12, pool: 11, levels: 3, block: false, arp: false, piano: false, click: false },
    { name: '🎸 Chord',       srKey: 'ch:KEY', xp: 12, pool: 12, levels: 3, block: true,  arp: true,  piano: false, click: false },
    { name: '🎼 Scale',       srKey: 'sc:KEY', xp: 12, pool: 8,  levels: 2, block: false, arp: false, piano: false, click: false },
    { name: '🎵 Note',        srKey: 'nt:N',   xp: 12, pool: 12, levels: 2, block: false, arp: false, piano: true,  click: false },
    { name: '🎶 Progression', srKey: 'pg:KEY', xp: 22, pool: 6,  levels: 3, block: true,  arp: true,  piano: false, click: false },
    { name: '🥁 Rhythm',      srKey: 'rh:KEY', xp: 14, pool: 7,  levels: 3, block: false, arp: false, piano: false, click: true  },
    { name: '🎹 Free Piano',  srKey: '—',      xp: 0,  pool: 0,  levels: 0, block: false, arp: false, piano: true,  click: false },
  ]
  const ck = (v: boolean | number, t?: string) =>
    v ? <span style={{ color: '#10b981' }}>{t || '✓'}</span>
      : <span style={{ color: 'var(--t-dim)', opacity: 0.3 }}>—</span>

  return (
    <VTable
      headers={['Module', 'SR key', 'XP', 'Pool', 'Levels', 'Block', 'Arp', 'Piano UI', 'Click-track']}
      rows={mods.map(m => [
        m.name, m.srKey, m.xp || '—', m.pool || '—', m.levels || '—',
        ck(m.block), ck(m.arp), ck(m.piano), ck(m.click),
      ])}
    />
  )
}

// ── 6. Theme design system ────────────────────────────────────────────────────
const THEMES_DATA = [
  { id: 'kids',    emoji: '🎨', name: 'Kids',    dark: false, accent: '#ff6b6b', feel: 'Bright · Playful · Pastel' },
  { id: 'classic', emoji: '🎵', name: 'Classic', dark: false, accent: '#c9a84c', feel: 'Antique gold · Piano wood' },
  { id: 'studio',  emoji: '🎛️', name: 'Studio',  dark: true,  accent: '#a855f7', feel: 'Dark pro · Purple/teal neon' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', dark: false, accent: '#f472b6', feel: 'Soft rainbow pastels' },
  { id: 'neon',    emoji: '⚡', name: 'Neon',    dark: true,  accent: '#f43f5e', feel: 'Black + electric neon' },
]

function ThemeDiagram() {
  const MODULE_COLORS: Record<string, Record<string, string>> = {
    kids:    { interval:'#4d96ff', chord:'#ff6b6b', scale:'#a29bfe', note:'#26de81', progression:'#fd79a8', rhythm:'#f39c12', piano:'#ffeaa7' },
    classic: { interval:'#c9a84c', chord:'#c9a84c', scale:'#c9a84c', note:'#c9a84c', progression:'#c9a84c', rhythm:'#c9a84c', piano:'#c9a84c' },
    studio:  { interval:'#a855f7', chord:'#22d3ee', scale:'#06b6d4', note:'#c084fc', progression:'#a855f7', rhythm:'#06d6a0', piano:'#a855f7' },
    rainbow: { interval:'#f472b6', chord:'#fb923c', scale:'#facc15', note:'#34d399', progression:'#a78bfa', rhythm:'#fbbf24', piano:'#e879f9' },
    neon:    { interval:'#38bdf8', chord:'#f43f5e', scale:'#a855f7', note:'#10b981', progression:'#f97316', rhythm:'#22d3ee', piano:'#f43f5e' },
  }
  const stages = ['interval', 'chord', 'scale', 'note', 'progression', 'rhythm', 'piano']
  const labels = ['Quãng', 'Hợp âm', 'Gam', 'Nốt', 'Tiến hành', 'Tiết tấu', 'Đàn']

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1.5px solid var(--t-opt-border)' }}>
      <table className="font-mono text-[.65rem]" style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
        <thead>
          <tr style={{ background: 'var(--t-opt-bg)', borderBottom: '1.5px solid var(--t-opt-border)' }}>
            <th className="px-4 py-2.5 text-left" style={{ color: 'var(--accent)', width: 90 }}>Theme</th>
            {labels.map(l => (
              <th key={l} className="px-3 py-2.5 text-center font-mono text-[.58rem]"
                style={{ color: 'var(--t-dim)' }}>{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {THEMES_DATA.map((t, ti) => (
            <tr key={t.id} style={{ borderBottom: ti < THEMES_DATA.length - 1 ? '1px solid var(--t-opt-border)' : 'none' }}>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span>{t.emoji}</span>
                  <span style={{ color: 'var(--t-text)' }}>{t.name}</span>
                  {t.dark && <span className="rounded px-1 font-mono text-[.52rem]"
                    style={{ background: '#ffffff18', color: 'var(--t-dim)' }}>dark</span>}
                </div>
              </td>
              {stages.map(s => {
                const c = MODULE_COLORS[t.id][s]
                return (
                  <td key={s} className="px-3 py-2.5 text-center">
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-lg"
                      style={{ background: `${c}25`, border: `2px solid ${c}60` }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── 7. File tree ──────────────────────────────────────────────────────────────
function FileTree() {
  const items: [number, string, string, string][] = [
    [0, 'src/',                '📁', 'Root source directory'],
    [1, 'audio/engine.ts',     '🔊', 'AudioEngine singleton — 8-osc piano synth, ADSR, reverb, iOS routing'],
    [1, 'theory/index.ts',     '🎼', 'Music theory utils: noteToHz, shiftNote, buildScaleNotes, INTERVALS, CHORDS, SCALES'],
    [1, 'analytics/index.ts',  '📊', 'GA4 wrapper: answerSubmitted, levelUp, themeChanged, pwaInstall'],
    [1, 'components/',         '📁', ''],
    [2, 'Piano/index.tsx',     '🎹', 'Interactive piano keyboard — highlighted keys, onKeyPress callback'],
    [2, 'UI/index.tsx',        '🧩', 'Card, CardTitle, Btn, PlayBtn, FeedbackBar, OptionBtn, StatBox, ProgressBar, ModuleTabs'],
    [2, 'Auth/index.tsx',      '🔐', 'AuthModal, UsernameModal — Supabase magic link / OAuth'],
    [1, 'modules/',            '📁', ''],
    [2, 'Interval/index.tsx',  '🎯', 'SR: iv:N — 11 intervals, 3 difficulties'],
    [2, 'Chord/ChordModule.tsx','🎸', 'SR: ch:KEY — 12 chords, block+arp, random root'],
    [2, 'Scale/ScaleModule.tsx','🎼', 'SR: sc:KEY — 8 scales, playScale()'],
    [2, 'Note/NoteModule.tsx', '🎵', 'SR: nt:N — piano UI, highlight correct/wrong'],
    [2, 'ChordProgression/',   '🎶', 'SR: pg:KEY — 6 progressions, 22 XP, block+arp'],
    [2, 'Rhythm/index.tsx',    '🥁', 'SR: rh:KEY — 7 rhythms, click-track, NoteBox visual, 14 XP'],
    [2, 'FreePiano/index.tsx', '🎹', 'Free play — attack/release events, 2 octaves'],
    [1, 'store/',              '📁', ''],
    [2, 'index.ts',            '🗃️', 'Main store: XP, level, correct, wrong, streak, history[500], stage, theme'],
    [2, 'sr.ts',               '🧠', 'SM-2 spaced repetition: SRCard, sm2Update(), srWeightedPick(), weakSpots()'],
    [2, 'settings.ts',         '⚙️', 'Audio settings: volume, reverbMix, scaleTempo — persist sonicear-settings-v1'],
    [2, 'auth.ts',             '🔐', 'Supabase auth: user, profile, syncStats(), pushSession()'],
    [1, 'pages/',              '📁', ''],
    [2, 'Practice/index.tsx',  '🏋️', 'Main practice UI — 7 stage tabs, gamification bar, keyboard shortcuts'],
    [2, 'Dashboard/index.tsx', '📊', 'Stats — 35d heatmap, module accuracy, SM-2 weak spots'],
    [2, 'Info/index.tsx',      'ℹ️', 'Landing page — hero, 7 modules, how-it-works, feature grid'],
    [2, 'Sys/index.tsx',       '📐', 'This page — visual system design documentation'],
    [2, 'Settings/index.tsx',  '🔧', 'Audio sliders (volume, reverb), scale tempo presets, reset progress'],
    [2, 'Profile/index.tsx',   '👤', 'Supabase user profile, sync stats'],
    [2, 'Leaderboard/',        '🏆', 'Global leaderboard — Supabase query'],
    [1, 'theme/index.ts',      '🎨', '5 themes × moduleAccents — applyTheme() injects CSS variables'],
    [1, 'App.tsx',             '🚀', 'HashRouter + Header + FloatingDeco + PWA banner + AppInit'],
    [1, 'index.css',           '💅', 'Tailwind v4 @theme tokens + base styles + @keyframes'],
  ]

  const typeColor: Record<string, string> = {
    '📁': 'var(--t-dim)', '🔊': '#4d96ff', '🎼': '#a855f7', '📊': '#f59e0b',
    '🎹': '#06b6d4', '🧩': '#10b981', '🔐': '#f43f5e', '🎯': '#4d96ff',
    '🎸': '#f43f5e', '🎵': '#10b981', '🎶': '#f59e0b', '🥁': '#ef4444',
    '🗃️': '#4d96ff', '🧠': '#a855f7', '⚙️': '#10b981', '🏋️': '#f43f5e',
    '🏆': '#f59e0b', '🎨': '#f472b6', '🚀': '#10b981', '💅': '#a855f7',
    '📐': '#06b6d4', '🔧': '#10b981', '👤': '#f59e0b', 'ℹ️': '#4d96ff',
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--t-opt-border)' }}>
      <div className="px-4 py-2 font-mono text-[.62rem] font-bold tracking-wider"
        style={{ background: 'var(--t-opt-bg)', color: 'var(--accent)', borderBottom: '1px solid var(--t-opt-border)' }}>
        PROJECT STRUCTURE
      </div>
      <div className="px-3 py-3 font-mono text-[.65rem] leading-[1.85]" style={{ background: 'rgba(0,0,0,0.04)' }}>
        {items.map(([depth, name, icon, desc], i) => (
          <div key={i} className="flex items-start gap-2" style={{ paddingLeft: depth * 16 }}>
            <span className="flex-shrink-0 opacity-30 mt-0.5" style={{ color: 'var(--t-dim)' }}>
              {depth === 0 ? '' : depth === 1 ? '├─' : '│  ├─'}
            </span>
            <span className="flex-shrink-0">{icon}</span>
            <span className="flex-shrink-0" style={{ color: name.endsWith('/') ? 'var(--t-text)' : (typeColor[icon] || 'var(--t-text)'), fontWeight: name.endsWith('/') ? 700 : 400 }}>
              {name}
            </span>
            {desc && <span className="opacity-50 truncate" style={{ color: 'var(--t-dim)' }}>— {desc}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 8. Tech stack visual ──────────────────────────────────────────────────────
const TECH_GROUPS = [
  {
    group: 'Frontend', color: '#4d96ff',
    items: [
      { name: 'React 19', note: 'Concurrent mode', icon: '⚛️' },
      { name: 'TypeScript 6', note: 'strict: false', icon: '📘' },
      { name: 'Tailwind CSS v4', note: '@tailwindcss/vite, no postcss', icon: '🎨' },
      { name: 'React Router v7', note: 'HashRouter', icon: '🔀' },
    ],
  },
  {
    group: 'Build', color: '#10b981',
    items: [
      { name: 'Vite 8 (Rolldown)', note: 'ESM native, fast HMR', icon: '⚡' },
      { name: 'vite-plugin-pwa', note: 'Workbox generateSW', icon: '📱' },
      { name: 'tsc -b', note: 'TypeScript type check', icon: '✅' },
    ],
  },
  {
    group: 'State', color: '#a855f7',
    items: [
      { name: 'Zustand 5', note: '4 stores, persist middleware', icon: '🗃️' },
      { name: 'localStorage', note: '4 persistence keys', icon: '💾' },
    ],
  },
  {
    group: 'Audio / Domain', color: '#f43f5e',
    items: [
      { name: 'Web Audio API', note: 'Native, no Tone.js', icon: '🔊' },
      { name: 'SM-2 Algorithm', note: 'Custom implementation', icon: '🧠' },
      { name: 'Music Theory', note: 'Custom module', icon: '🎼' },
    ],
  },
  {
    group: 'Backend / Cloud', color: '#f59e0b',
    items: [
      { name: 'Supabase', note: 'Auth + profiles + game_sessions', icon: '☁️' },
      { name: 'GA4', note: 'gtag.js analytics', icon: '📊' },
    ],
  },
]

function TechStack() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {TECH_GROUPS.map(g => (
        <div key={g.group} className="rounded-2xl p-4" style={{ border: `2px solid ${g.color}30`, background: `${g.color}06` }}>
          <div className="font-mono text-[.65rem] font-bold tracking-wider mb-3" style={{ color: g.color }}>
            {g.group.toUpperCase()}
          </div>
          <div className="flex flex-col gap-2">
            {g.items.map(item => (
              <div key={item.name} className="flex items-start gap-2.5">
                <span className="text-[1.1rem] flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <div className="font-mono text-[.68rem] font-bold" style={{ color: 'var(--t-text)' }}>{item.name}</div>
                  <div className="font-mono text-[.6rem]" style={{ color: 'var(--t-dim)' }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 9. Roadmap ────────────────────────────────────────────────────────────────
const DONE = [
  'Audio engine (8-osc synth, ADSR, reverb, chorus, presence EQ)',
  'Music theory module (intervals, chords, scales, utils)',
  'Piano component (highlighted keys, scroll, onKeyPress)',
  'Interval module + SM-2', 'Chord module (block + arp) + SM-2',
  'Scale module (ascending + descending) + SM-2',
  'Note module (piano UI) + SM-2',
  'Chord Progression module (6 progressions, 22 XP) + SM-2',
  'Rhythm module (7 patterns, click-track, NoteBox) + SM-2',
  'Free Piano (attack/release, 2 octaves)',
  'Dashboard (heatmap 35d, accuracy/module, weak spots)',
  'Settings page (volume, reverb, scale tempo, reset)',
  'Info landing page', 'System design page (/sys)',
  '5 themes × module accents per stage',
  'Gamification (XP, level, streak, bonus combo)',
  'Session history auto-save (setStage trigger)',
  'Supabase auth (magic link + OAuth Google)',
  'Cloud sync (profiles + game_sessions)',
  'Global leaderboard', 'GA4 analytics (custom events)',
  'PWA (offline, install banner, icons)',
  'iOS audio routing (AVAudioSession bypass)',
  'Keyboard shortcuts (Space + 1–8)',
]
const TODO = [
  { item: 'Dictation module', note: 'Nghe giai điệu → chép lại nốt trên piano' },
  { item: 'Claude API AI feedback', note: 'Phân tích điểm yếu, gợi ý cá nhân hoá' },
  { item: 'Mobile app (Capacitor)', note: 'iOS + Android native shell' },
  { item: 'iOS mute switch bypass', note: 'BACKLOG — WKWebView không hỗ trợ srcObject' },
  { item: 'GA4 real Measurement ID', note: 'Cần cấu hình VITE_GA_ID' },
  { item: 'AdSense monetisation', note: 'Cần VITE_ADSENSE_ID + approval' },
  { item: 'Supabase production deploy', note: 'schema.sql + GitHub secrets + RLS' },
]

// ── TOC ───────────────────────────────────────────────────────────────────────
const TOC = [
  { id: 'arch',     label: '1. Architecture' },
  { id: 'audio',    label: '2. Audio Engine' },
  { id: 'sm2',      label: '3. SM-2 Algorithm' },
  { id: 'state',    label: '4. State Management' },
  { id: 'modules',  label: '5. Module Matrix' },
  { id: 'theme',    label: '6. Theme System' },
  { id: 'files',    label: '7. File Structure' },
  { id: 'tech',     label: '8. Tech Stack' },
  { id: 'db',       label: '9. Database' },
  { id: 'roadmap',  label: '10. Roadmap' },
]

// ── Main ──────────────────────────────────────────────────────────────────────
export function SysPage() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 animate-[fadeUp_.32s_ease_both]">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/info')}
            className="rounded-xl px-3 py-1.5 font-mono text-[.72rem] transition-all hover:opacity-70"
            style={{ background: 'var(--t-opt-bg)', border: '2px solid var(--t-opt-border)', color: 'var(--t-dim)' }}>
            ← Info
          </button>
          <div>
            <div className="font-display text-[1.4rem] font-bold" style={{ color: 'var(--t-text)' }}>⚙️ System Design</div>
            <div className="font-mono text-[.62rem]" style={{ color: 'var(--t-dim)' }}>
              SonicEar — Kiến trúc, thiết kế, diagram
            </div>
          </div>
        </div>

        {/* TOC */}
        <div className="rounded-3xl p-5" style={{ background: 'var(--t-card-bg)', border: '1.5px solid var(--t-opt-border)', boxShadow: 'var(--t-card-shadow)' }}>
          <div className="font-mono text-[.62rem] font-bold tracking-widest mb-3" style={{ color: 'var(--accent)' }}>MỤC LỤC</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TOC.map(t => (
              <a key={t.id} href={`#${t.id}`}
                className="font-mono text-[.67rem] px-3 py-2 rounded-xl text-center transition-all hover:opacity-100 opacity-70 cursor-pointer"
                style={{ background: 'var(--t-opt-bg)', border: '1px solid var(--t-opt-border)', color: 'var(--t-text)', textDecoration: 'none' }}>
                {t.label}
              </a>
            ))}
          </div>
        </div>

        {/* 1. Architecture */}
        <Section id="arch" title="1. Architecture"
          sub="Phân lớp hệ thống theo Presentation → State → Domain → Infrastructure">
          <ArchDiagram />
        </Section>

        {/* 2. Audio Engine */}
        <Section id="audio" title="2. Audio Engine"
          sub="Web Audio API native — 8 oscillator piano synth với ADSR, reverb convolver, stereo chorus">
          <AudioChain />
          <Code title="ADSR ENVELOPE">{`env.gain.setValueAtTime(0, now)
env.gain.linearRampToValueAtTime(velocity × 0.90, now + 0.001)    // 1ms  attack
env.gain.exponentialRampToValueAtTime(velocity × 0.55, now + 0.081) // 80ms decay → 55%
env.gain.exponentialRampToValueAtTime(velocity × 0.10, now + 2.9)   // 2.8s sustain fade

// Release: 2.2s fade (immediate=false) OR 40ms cut (immediate=true)
env.gain.exponentialRampToValueAtTime(0.0001, now + rel)`}
          </Code>
          <Code title="iOS AUDIO ROUTING">{`const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
const isPWA = isIOS && navigator.standalone === true

if (isIOS && !isPWA) {
  // Safari browser: MediaStreamDestination → <audio> srcObject
  // → forces AVAudioSessionCategoryPlayback → bypasses mute switch
  masterGain → MediaStreamDestination → <audio>.srcObject.play()
} else {
  // PWA (WKWebView): srcObject silently fails → direct destination
  masterGain → AudioContext.destination
}`}
          </Code>
        </Section>

        {/* 3. SM-2 */}
        <Section id="sm2" title="3. SM-2 Spaced Repetition"
          sub="Custom SM-2 implementation — weighted pick ưu tiên overdue × 4, struggling × 1–3">
          <SM2Flow />
          <Code title="WEIGHTED PICK FORMULA">{`weight = 1.0

if (card === undefined)   weight = 2.0            // unseen: slightly preferred
if (card.dueAt <= now)    weight *= 4.0            // overdue: strongly preferred
if (accuracy < 0.6)       weight *= 1 + (0.6 - accuracy) * 3  // struggling: extra boost

// accuracy = card.correct / (card.correct + card.wrong)
// Total weight → random weighted selection`}
          </Code>
        </Section>

        {/* 4. State */}
        <Section id="state" title="4. State Management"
          sub="4 Zustand stores với Zustand persist — localStorage sync, optional Supabase cloud sync">
          <StoresDiagram />
          <Code title="SESSION AUTO-SAVE (setStage trigger)">{`setStage: (newStage) => {
  const { currentStage, _stageStart, _stageCorrect, _stageWrong } = get()
  // Auto-save session khi switch stage nếu đã có ít nhất 1 câu
  if (_stageCorrect + _stageWrong > 0) {
    get().addHistory({
      date: new Date().toISOString(), stage: currentStage,
      correct: _stageCorrect, wrong: _stageWrong,
      durationMs: Date.now() - _stageStart,
    })
  }
  set({ currentStage: newStage, _stageStart: Date.now(), _stageCorrect: 0, _stageWrong: 0 })
}`}
          </Code>
        </Section>

        {/* 5. Modules */}
        <Section id="modules" title="5. Module Feature Matrix"
          sub="So sánh 7 modules — SR key, XP, pool size, modes, và tính năng riêng">
          <ModuleMatrix />
          <Note>
            Mọi module (trừ FreePiano) dùng srWeightedPick() để chọn câu hỏi và srRecord() sau khi trả lời.
            Pool tự thay đổi theo mode (basic / medium / all). Options được shuffle trước khi hiển thị.
          </Note>
        </Section>

        {/* 6. Theme */}
        <Section id="theme" title="6. Theme & Design System"
          sub="5 theme × 7 module accents — mỗi stage có màu riêng biệt, CSS variable injection runtime">
          <ThemeDiagram />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            <div className="rounded-2xl p-4" style={{ background: 'var(--t-card-bg)', border: '1.5px solid var(--t-opt-border)' }}>
              <div className="font-mono text-[.6rem] font-bold tracking-wider mb-2" style={{ color: 'var(--accent)' }}>TYPOGRAPHY</div>
              {[
                ['font-display', 'Playfair Display', 'Titles, numbers, brand'],
                ['font-mono',    'DM Mono',           'Labels, code, badges'],
                ['body',         'Cormorant Garamond', 'Long text, descriptions'],
              ].map(([cls, font, use]) => (
                <div key={cls} className="mb-2">
                  <div className="font-mono text-[.65rem] font-bold" style={{ color: 'var(--t-text)' }}>{cls}</div>
                  <div className="font-mono text-[.6rem]" style={{ color: 'var(--accent)' }}>{font}</div>
                  <div className="font-mono text-[.58rem]" style={{ color: 'var(--t-dim)' }}>{use}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-4 col-span-2" style={{ background: 'var(--t-card-bg)', border: '1.5px solid var(--t-opt-border)' }}>
              <div className="font-mono text-[.6rem] font-bold tracking-wider mb-2" style={{ color: 'var(--accent)' }}>CSS VARIABLE SYSTEM</div>
              <div className="grid grid-cols-2 gap-x-4">
                {[
                  ['--t-bg', 'Page background'],
                  ['--t-card-bg', 'Card background'],
                  ['--t-text', 'Primary text'],
                  ['--t-dim', 'Secondary text'],
                  ['--t-opt-bg', 'Option/chip background'],
                  ['--t-opt-border', 'Border colour'],
                  ['--accent', 'Module primary colour'],
                  ['--accent-dark', 'Darker variant'],
                  ['--accent-glow', 'Box shadow glow'],
                  ['--t-header-bg', 'Header glassmorphism'],
                ].map(([v, d]) => (
                  <div key={v} className="flex gap-2 mb-1">
                    <span className="font-mono text-[.6rem]" style={{ color: 'var(--accent)', flexShrink: 0 }}>{v}</span>
                    <span className="font-mono text-[.58rem]" style={{ color: 'var(--t-dim)' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 7. File structure */}
        <Section id="files" title="7. File Structure"
          sub="~15k LoC — tất cả TypeScript + React, không có file config ngoài vite.config.ts và tsconfig">
          <FileTree />
        </Section>

        {/* 8. Tech Stack */}
        <Section id="tech" title="8. Tech Stack"
          sub="Zero backend — toàn bộ logic client-side. Supabase và GA4 là optional cloud integrations">
          <TechStack />
        </Section>

        {/* 9. Database */}
        <Section id="db" title="9. Database Schema (Supabase)"
          sub="2 bảng — profiles (upsert mỗi 10s) và game_sessions (insert mỗi buổi). RLS enabled.">
          <Code title="SQL SCHEMA">{`-- Bảng user profile — upserted sau mỗi onCorrect/onWrong (debounce 10s)
create table profiles (
  id         uuid primary key references auth.users on delete cascade,
  username   text unique,
  total_xp   int default 0,
  level      int default 1,
  correct    int default 0,
  wrong      int default 0,
  updated_at timestamptz default now()
);

-- Bảng session history — inserted sau mỗi lần switch stage (nếu có câu trả lời)
create table game_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade,
  stage       text not null,      -- 'interval' | 'chord' | 'scale' | ...
  correct     int not null,
  wrong       int not null,
  xp_earned   int not null,
  duration_ms int not null,
  played_at   timestamptz default now()
);

-- RLS: users chỉ đọc/ghi data của chính mình
alter table profiles     enable row level security;
alter table game_sessions enable row level security;`}
          </Code>
          <Code title="ENV VARS CẦN THIẾT">{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GA_ID=G-XXXXXXXXXX         # Google Analytics 4 Measurement ID
VITE_ADSENSE_ID=ca-pub-XXXXXXXX # AdSense publisher ID (placeholder)`}
          </Code>
        </Section>

        {/* 10. Roadmap */}
        <Section id="roadmap" title="10. Roadmap"
          sub="Phase 2 hoàn thành. Phase 3 cần external services và thêm platform work.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#10b981' }} />
                <span className="font-mono text-[.68rem] font-bold" style={{ color: '#10b981' }}>HOÀN THÀNH ({DONE.length})</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {DONE.map(d => (
                  <div key={d} className="flex items-start gap-2 font-mono text-[.63rem]" style={{ color: 'var(--t-dim)' }}>
                    <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#f59e0b' }} />
                <span className="font-mono text-[.68rem] font-bold" style={{ color: '#f59e0b' }}>CÒN LẠI ({TODO.length})</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {TODO.map(t => (
                  <div key={t.item} className="rounded-xl p-3"
                    style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <div className="font-mono text-[.65rem] font-bold" style={{ color: '#f59e0b' }}>◦ {t.item}</div>
                    <div className="font-mono text-[.6rem] mt-0.5" style={{ color: 'var(--t-dim)' }}>{t.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* footer */}
        <div className="text-center py-4 font-mono text-[.6rem]" style={{ color: 'var(--t-dim)', opacity: 0.5 }}>
          SonicEar · sonicear.zenpax.io.vn · React 19 · Web Audio API · SM-2 SR · Supabase · PWA
        </div>

      </div>
    </div>
  )
}
