export type ThemeId = 'kids' | 'classic' | 'neon' | 'pastel'

interface ThemeVars {
  '--t-bg': string
  '--t-header-bg': string
  '--t-header-border': string
  '--t-gamebar-bg': string
  '--t-gamebar-border': string
  '--t-stage-bar-bg': string
  '--t-stats-bar-bg': string
  '--t-card-bg': string
  '--t-card-shadow': string
  '--t-text': string
  '--t-dim': string
  '--t-opt-lbl': string
  '--t-opt-bg': string
  '--t-opt-border': string
  '--t-opt-text': string
  '--t-tab-bg': string
  '--t-tab-border': string
  '--t-tab-text': string
  '--t-fb-idle-bg': string
  '--t-fb-idle-border': string
  '--t-fb-idle-text': string
  '--t-stage-btn-bg': string
  '--t-stage-btn-color': string
  '--t-stage-btn-border': string
  '--t-stars-bg': string
  '--t-stars-text': string
  '--t-xp-text': string
  '--t-stat-bg': string
  '--t-stat-border': string
  '--t-stat-lbl': string
  '--t-progressbar-track': string
  '--t-scrollbar': string
  '--t-piano-white-border': string
}

export interface ModuleAccent {
  accent: string
  accentDark: string
  glow: string
  subtle: string
  label: string
  emoji: string
}

export interface ThemeDef {
  label: string
  emoji: string
  isDark: boolean
  vars: ThemeVars
  logoStyle: React.CSSProperties
  moduleAccents: Record<string, ModuleAccent>
}

// ─── Kids (light, bright, playful — demo4) ────────────────────────────────
const KIDS: ThemeDef = {
  label: 'Kids',
  emoji: '🎨',
  isDark: false,
  logoStyle: {
    background: 'linear-gradient(270deg,#ff6b6b,#ff9f43,#ffd93d,#26de81,#4d96ff,#a29bfe,#fd79a8,#ff6b6b)',
    backgroundSize: '400% 400%',
    animation: 'logo-colors 4s ease infinite',
    boxShadow: '0 4px 14px rgba(255,107,107,0.35)',
  },
  vars: {
    '--t-bg':               '#fffdf5',
    '--t-header-bg':        'rgba(255,253,245,0.94)',
    '--t-header-border':    '2px solid rgba(255,107,107,0.14)',
    '--t-gamebar-bg':       'rgba(255,253,245,0.92)',
    '--t-gamebar-border':   '2px solid rgba(0,0,0,0.05)',
    '--t-stage-bar-bg':     'rgba(255,253,245,0.75)',
    '--t-stats-bar-bg':     'rgba(255,253,245,0.6)',
    '--t-card-bg':          'rgba(255,255,255,0.92)',
    '--t-card-shadow':      'rgba(255,107,107,0.08)',
    '--t-text':             '#2d2d2d',
    '--t-dim':              '#6b7280',
    '--t-opt-lbl':          '#4338ca',
    '--t-opt-bg':           'white',
    '--t-opt-border':       '#e5e7eb',
    '--t-opt-text':         '#6b7280',
    '--t-tab-bg':           'white',
    '--t-tab-border':       '#e5e7eb',
    '--t-tab-text':         '#6b7280',
    '--t-fb-idle-bg':       'rgba(255,255,255,0.7)',
    '--t-fb-idle-border':   '2px dashed #e5e7eb',
    '--t-fb-idle-text':     '#9ca3af',
    '--t-stage-btn-bg':     'white',
    '--t-stage-btn-color':  '#6b7280',
    '--t-stage-btn-border': '2px solid #e5e7eb',
    '--t-stars-bg':         'rgba(255,211,61,0.2)',
    '--t-stars-text':       '#b45309',
    '--t-xp-text':          '#666',
    '--t-stat-bg':          'rgba(255,255,255,0.85)',
    '--t-stat-border':      '#f3f4f6',
    '--t-stat-lbl':         '#9ca3af',
    '--t-progressbar-track':'#f3f4f6',
    '--t-scrollbar':        '#ddd',
    '--t-piano-white-border':'rgba(200,185,165,0.55)',
  },
  moduleAccents: {
    interval: { accent: '#ff6b6b', accentDark: '#c92a2a', glow: 'rgba(255,107,107,0.45)', subtle: 'rgba(255,107,107,0.07)', label: 'Quãng Nhạc', emoji: '🎯' },
    chord:    { accent: '#ff9f43', accentDark: '#c05c00', glow: 'rgba(255,159,67,0.45)',  subtle: 'rgba(255,159,67,0.07)',  label: 'Hợp Âm',    emoji: '🎸' },
    scale:    { accent: '#26de81', accentDark: '#099268', glow: 'rgba(38,222,129,0.45)',  subtle: 'rgba(38,222,129,0.07)',  label: 'Điệu Thức', emoji: '🎼' },
    note:     { accent: '#4d96ff', accentDark: '#1971c2', glow: 'rgba(77,150,255,0.45)',  subtle: 'rgba(77,150,255,0.07)',  label: 'Nốt Đơn',   emoji: '🎵' },
    piano:    { accent: '#a29bfe', accentDark: '#6741d9', glow: 'rgba(162,155,254,0.45)', subtle: 'rgba(162,155,254,0.07)', label: 'Đàn Tự Do', emoji: '🎹' },
  },
}

// ─── Classic (dark warm gold — original) ─────────────────────────────────
const CLASSIC: ThemeDef = {
  label: 'Classic',
  emoji: '🏺',
  isDark: true,
  logoStyle: {
    background: 'linear-gradient(135deg,#c9a84c,#e8c96d,#a06c28)',
    backgroundSize: '200% 200%',
    animation: 'logo-colors 3s ease infinite',
    boxShadow: '0 4px 14px rgba(201,168,76,0.5)',
  },
  vars: {
    '--t-bg':               '#0d0b08',
    '--t-header-bg':        'rgba(13,11,8,0.97)',
    '--t-header-border':    '2px solid rgba(201,168,76,0.2)',
    '--t-gamebar-bg':       'rgba(20,16,10,0.97)',
    '--t-gamebar-border':   '2px solid rgba(201,168,76,0.1)',
    '--t-stage-bar-bg':     'rgba(13,11,8,0.9)',
    '--t-stats-bar-bg':     'rgba(13,11,8,0.75)',
    '--t-card-bg':          'rgba(26,22,16,0.97)',
    '--t-card-shadow':      'rgba(201,168,76,0.12)',
    '--t-text':             '#e8dcc8',
    '--t-dim':              '#8a7d6a',
    '--t-opt-lbl':          '#e8c96d',
    '--t-opt-bg':           'rgba(26,22,16,0.95)',
    '--t-opt-border':       'rgba(201,168,76,0.22)',
    '--t-opt-text':         '#8a7d6a',
    '--t-tab-bg':           'rgba(26,22,16,0.9)',
    '--t-tab-border':       'rgba(201,168,76,0.22)',
    '--t-tab-text':         '#8a7d6a',
    '--t-fb-idle-bg':       'rgba(26,22,16,0.8)',
    '--t-fb-idle-border':   '2px dashed rgba(201,168,76,0.28)',
    '--t-fb-idle-text':     '#6a5f4e',
    '--t-stage-btn-bg':     'rgba(26,22,16,0.9)',
    '--t-stage-btn-color':  '#8a7d6a',
    '--t-stage-btn-border': '2px solid rgba(201,168,76,0.2)',
    '--t-stars-bg':         'rgba(201,168,76,0.15)',
    '--t-stars-text':       '#e8c96d',
    '--t-xp-text':          '#8a7d6a',
    '--t-stat-bg':          'rgba(26,22,16,0.92)',
    '--t-stat-border':      'rgba(201,168,76,0.15)',
    '--t-stat-lbl':         '#5a4f3e',
    '--t-progressbar-track':'rgba(201,168,76,0.12)',
    '--t-scrollbar':        '#3a3020',
    '--t-piano-white-border':'rgba(201,168,76,0.28)',
  },
  moduleAccents: {
    interval: { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Quãng Nhạc', emoji: '🎯' },
    chord:    { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Hợp Âm',    emoji: '🎸' },
    scale:    { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Điệu Thức', emoji: '🎼' },
    note:     { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Nốt Đơn',   emoji: '🎵' },
    piano:    { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Đàn Tự Do', emoji: '🎹' },
  },
}

// ─── Neon (dark electric, per-section accent) ────────────────────────────
const NEON: ThemeDef = {
  label: 'Neon',
  emoji: '⚡',
  isDark: true,
  logoStyle: {
    background: 'linear-gradient(270deg,#f43f5e,#f97316,#10b981,#3b82f6,#8b5cf6,#ec4899,#f43f5e)',
    backgroundSize: '400% 400%',
    animation: 'logo-colors 3s ease infinite',
    boxShadow: '0 4px 18px rgba(139,92,246,0.55)',
  },
  vars: {
    '--t-bg':               '#080b14',
    '--t-header-bg':        'rgba(8,11,20,0.97)',
    '--t-header-border':    '2px solid rgba(139,92,246,0.3)',
    '--t-gamebar-bg':       'rgba(10,13,22,0.97)',
    '--t-gamebar-border':   '2px solid rgba(139,92,246,0.14)',
    '--t-stage-bar-bg':     'rgba(8,11,20,0.9)',
    '--t-stats-bar-bg':     'rgba(8,11,20,0.75)',
    '--t-card-bg':          'rgba(14,16,28,0.97)',
    '--t-card-shadow':      'rgba(139,92,246,0.14)',
    '--t-text':             '#e2e8f0',
    '--t-dim':              '#94a3b8',
    '--t-opt-lbl':          '#c4b5fd',
    '--t-opt-bg':           'rgba(14,16,28,0.95)',
    '--t-opt-border':       'rgba(139,92,246,0.22)',
    '--t-opt-text':         '#94a3b8',
    '--t-tab-bg':           'rgba(14,16,28,0.9)',
    '--t-tab-border':       'rgba(139,92,246,0.22)',
    '--t-tab-text':         '#94a3b8',
    '--t-fb-idle-bg':       'rgba(14,16,28,0.8)',
    '--t-fb-idle-border':   '2px dashed rgba(139,92,246,0.3)',
    '--t-fb-idle-text':     '#64748b',
    '--t-stage-btn-bg':     'rgba(14,16,28,0.9)',
    '--t-stage-btn-color':  '#94a3b8',
    '--t-stage-btn-border': '2px solid rgba(139,92,246,0.2)',
    '--t-stars-bg':         'rgba(251,191,36,0.15)',
    '--t-stars-text':       '#fbbf24',
    '--t-xp-text':          '#94a3b8',
    '--t-stat-bg':          'rgba(14,16,28,0.92)',
    '--t-stat-border':      'rgba(139,92,246,0.14)',
    '--t-stat-lbl':         '#475569',
    '--t-progressbar-track':'rgba(139,92,246,0.12)',
    '--t-scrollbar':        '#1e2236',
    '--t-piano-white-border':'rgba(139,92,246,0.28)',
  },
  moduleAccents: {
    interval: { accent: '#f43f5e', accentDark: '#fb7185', glow: 'rgba(244,63,94,0.5)',   subtle: 'rgba(244,63,94,0.08)',   label: 'Quãng Nhạc', emoji: '🎯' },
    chord:    { accent: '#f97316', accentDark: '#fb923c', glow: 'rgba(249,115,22,0.5)',  subtle: 'rgba(249,115,22,0.08)',  label: 'Hợp Âm',    emoji: '🎸' },
    scale:    { accent: '#10b981', accentDark: '#34d399', glow: 'rgba(16,185,129,0.5)',  subtle: 'rgba(16,185,129,0.08)',  label: 'Điệu Thức', emoji: '🎼' },
    note:     { accent: '#3b82f6', accentDark: '#60a5fa', glow: 'rgba(59,130,246,0.5)',  subtle: 'rgba(59,130,246,0.08)',  label: 'Nốt Đơn',   emoji: '🎵' },
    piano:    { accent: '#8b5cf6', accentDark: '#a78bfa', glow: 'rgba(139,92,246,0.5)',  subtle: 'rgba(139,92,246,0.08)',  label: 'Đàn Tự Do', emoji: '🎹' },
  },
}

// ─── Pastel (light, soft purple — demo3 inspired) ─────────────────────────
const PASTEL: ThemeDef = {
  label: 'Pastel',
  emoji: '🌸',
  isDark: false,
  logoStyle: {
    background: 'linear-gradient(270deg,#f472b6,#c084fc,#818cf8,#60a5fa,#34d399,#f472b6)',
    backgroundSize: '400% 400%',
    animation: 'logo-colors 4s ease infinite',
    boxShadow: '0 4px 14px rgba(192,132,252,0.4)',
  },
  vars: {
    '--t-bg':               '#f5f0ff',
    '--t-header-bg':        'rgba(245,240,255,0.96)',
    '--t-header-border':    '2px solid rgba(196,181,253,0.4)',
    '--t-gamebar-bg':       'rgba(240,232,255,0.96)',
    '--t-gamebar-border':   '2px solid rgba(196,181,253,0.2)',
    '--t-stage-bar-bg':     'rgba(240,232,255,0.82)',
    '--t-stats-bar-bg':     'rgba(240,232,255,0.65)',
    '--t-card-bg':          'rgba(255,255,255,0.96)',
    '--t-card-shadow':      'rgba(167,139,250,0.12)',
    '--t-text':             '#2e1065',
    '--t-dim':              '#6d28d9',
    '--t-opt-lbl':          '#5b21b6',
    '--t-opt-bg':           'rgba(255,255,255,0.95)',
    '--t-opt-border':       '#ddd6fe',
    '--t-opt-text':         '#7c3aed',
    '--t-tab-bg':           'rgba(255,255,255,0.9)',
    '--t-tab-border':       '#ddd6fe',
    '--t-tab-text':         '#7c3aed',
    '--t-fb-idle-bg':       'rgba(255,255,255,0.8)',
    '--t-fb-idle-border':   '2px dashed #ddd6fe',
    '--t-fb-idle-text':     '#a78bfa',
    '--t-stage-btn-bg':     'rgba(255,255,255,0.9)',
    '--t-stage-btn-color':  '#7c3aed',
    '--t-stage-btn-border': '2px solid #ddd6fe',
    '--t-stars-bg':         'rgba(251,191,36,0.18)',
    '--t-stars-text':       '#a16207',
    '--t-xp-text':          '#7c3aed',
    '--t-stat-bg':          'rgba(255,255,255,0.92)',
    '--t-stat-border':      '#ede9fe',
    '--t-stat-lbl':         '#a78bfa',
    '--t-progressbar-track':'#ede9fe',
    '--t-scrollbar':        '#c4b5fd',
    '--t-piano-white-border':'rgba(196,181,253,0.6)',
  },
  moduleAccents: {
    interval: { accent: '#f472b6', accentDark: '#be185d', glow: 'rgba(244,114,182,0.45)', subtle: 'rgba(244,114,182,0.07)', label: 'Quãng Nhạc', emoji: '🎯' },
    chord:    { accent: '#fb923c', accentDark: '#c2410c', glow: 'rgba(251,146,60,0.45)',  subtle: 'rgba(251,146,60,0.07)',  label: 'Hợp Âm',    emoji: '🎸' },
    scale:    { accent: '#4ade80', accentDark: '#15803d', glow: 'rgba(74,222,128,0.45)',  subtle: 'rgba(74,222,128,0.07)',  label: 'Điệu Thức', emoji: '🎼' },
    note:     { accent: '#60a5fa', accentDark: '#1d4ed8', glow: 'rgba(96,165,250,0.45)',  subtle: 'rgba(96,165,250,0.07)',  label: 'Nốt Đơn',   emoji: '🎵' },
    piano:    { accent: '#a78bfa', accentDark: '#5b21b6', glow: 'rgba(167,139,250,0.45)', subtle: 'rgba(167,139,250,0.07)', label: 'Đàn Tự Do', emoji: '🎹' },
  },
}

export const THEMES: Record<ThemeId, ThemeDef> = { kids: KIDS, classic: CLASSIC, neon: NEON, pastel: PASTEL }
export const THEME_IDS: ThemeId[] = ['kids', 'classic', 'neon', 'pastel']

export function applyTheme(id: ThemeId) {
  const { vars, isDark } = THEMES[id]
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v)
  }
  root.setAttribute('data-theme', id)
  root.classList.toggle('dark-theme', isDark)
  document.body.style.background = vars['--t-bg']
  document.body.style.color = vars['--t-text']
}
