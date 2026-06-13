export type ThemeId = 'kids' | 'classic' | 'studio' | 'rainbow' | 'neon'

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
    interval:    { accent: '#ff6b6b', accentDark: '#c92a2a', glow: 'rgba(255,107,107,0.45)', subtle: 'rgba(255,107,107,0.07)', label: 'Quãng Nhạc', emoji: '🎯' },
    chord:       { accent: '#ff9f43', accentDark: '#c05c00', glow: 'rgba(255,159,67,0.45)',  subtle: 'rgba(255,159,67,0.07)',  label: 'Hợp Âm',    emoji: '🎸' },
    scale:       { accent: '#26de81', accentDark: '#099268', glow: 'rgba(38,222,129,0.45)',  subtle: 'rgba(38,222,129,0.07)',  label: 'Điệu Thức', emoji: '🎼' },
    note:        { accent: '#4d96ff', accentDark: '#1971c2', glow: 'rgba(77,150,255,0.45)',  subtle: 'rgba(77,150,255,0.07)',  label: 'Nốt Đơn',   emoji: '🎵' },
    piano:       { accent: '#a29bfe', accentDark: '#6741d9', glow: 'rgba(162,155,254,0.45)', subtle: 'rgba(162,155,254,0.07)', label: 'Đàn Tự Do', emoji: '🎹' },
    progression: { accent: '#fd79a8', accentDark: '#c0306e', glow: 'rgba(253,121,168,0.45)', subtle: 'rgba(253,121,168,0.07)', label: 'Tiến Hành', emoji: '🎶' },
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
    interval:    { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Quãng Nhạc', emoji: '🎯' },
    chord:       { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Hợp Âm',    emoji: '🎸' },
    scale:       { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Điệu Thức', emoji: '🎼' },
    note:        { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Nốt Đơn',   emoji: '🎵' },
    piano:       { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Đàn Tự Do', emoji: '🎹' },
    progression: { accent: '#c9a84c', accentDark: '#e8c96d', glow: 'rgba(201,168,76,0.5)',  subtle: 'rgba(201,168,76,0.08)', label: 'Tiến Hành', emoji: '🎶' },
  },
}

// ─── Studio (dark purple/violet — demo-theme) ─────────────────────────────
const STUDIO: ThemeDef = {
  label: 'Studio',
  emoji: '🔮',
  isDark: true,
  logoStyle: {
    background: 'linear-gradient(135deg,#7c3aed,#a855f7,#22d3ee)',
    backgroundSize: '200% 200%',
    animation: 'logo-colors 3.5s ease infinite',
    boxShadow: '0 4px 18px rgba(168,85,247,0.55)',
  },
  vars: {
    '--t-bg':               '#060414',
    '--t-header-bg':        'rgba(6,4,20,0.95)',
    '--t-header-border':    '2px solid rgba(255,255,255,0.08)',
    '--t-gamebar-bg':       'rgba(10,6,28,0.97)',
    '--t-gamebar-border':   '2px solid rgba(168,85,247,0.14)',
    '--t-stage-bar-bg':     'rgba(6,4,20,0.9)',
    '--t-stats-bar-bg':     'rgba(6,4,20,0.75)',
    '--t-card-bg':          'rgba(255,255,255,0.04)',
    '--t-card-shadow':      'rgba(168,85,247,0.18)',
    '--t-text':             '#f1f5f9',
    '--t-dim':              '#94a3b8',
    '--t-opt-lbl':          '#c084fc',
    '--t-opt-bg':           'rgba(255,255,255,0.05)',
    '--t-opt-border':       'rgba(255,255,255,0.10)',
    '--t-opt-text':         '#94a3b8',
    '--t-tab-bg':           'rgba(255,255,255,0.04)',
    '--t-tab-border':       'rgba(255,255,255,0.10)',
    '--t-tab-text':         '#94a3b8',
    '--t-fb-idle-bg':       'rgba(255,255,255,0.04)',
    '--t-fb-idle-border':   '2px dashed rgba(168,85,247,0.35)',
    '--t-fb-idle-text':     '#64748b',
    '--t-stage-btn-bg':     'rgba(255,255,255,0.04)',
    '--t-stage-btn-color':  '#94a3b8',
    '--t-stage-btn-border': '2px solid rgba(255,255,255,0.10)',
    '--t-stars-bg':         'rgba(250,204,21,0.12)',
    '--t-stars-text':       '#fbbf24',
    '--t-xp-text':          '#94a3b8',
    '--t-stat-bg':          'rgba(255,255,255,0.04)',
    '--t-stat-border':      'rgba(255,255,255,0.08)',
    '--t-stat-lbl':         '#475569',
    '--t-progressbar-track':'rgba(168,85,247,0.14)',
    '--t-scrollbar':        'rgba(168,85,247,0.25)',
    '--t-piano-white-border':'rgba(255,255,255,0.15)',
  },
  moduleAccents: {
    interval:    { accent: '#a855f7', accentDark: '#c084fc', glow: 'rgba(168,85,247,0.5)',  subtle: 'rgba(168,85,247,0.08)', label: 'Quãng Nhạc', emoji: '↕' },
    chord:       { accent: '#a855f7', accentDark: '#c084fc', glow: 'rgba(168,85,247,0.5)',  subtle: 'rgba(168,85,247,0.08)', label: 'Hợp Âm',    emoji: '♪' },
    scale:       { accent: '#a855f7', accentDark: '#c084fc', glow: 'rgba(168,85,247,0.5)',  subtle: 'rgba(168,85,247,0.08)', label: 'Điệu Thức', emoji: '🎼' },
    note:        { accent: '#22d3ee', accentDark: '#67e8f9', glow: 'rgba(34,211,238,0.5)',  subtle: 'rgba(34,211,238,0.08)', label: 'Nốt Đơn',   emoji: '♩' },
    piano:       { accent: '#a855f7', accentDark: '#c084fc', glow: 'rgba(168,85,247,0.5)',  subtle: 'rgba(168,85,247,0.08)', label: 'Đàn Tự Do', emoji: '🎹' },
    progression: { accent: '#f472b6', accentDark: '#f9a8d4', glow: 'rgba(244,114,182,0.5)', subtle: 'rgba(244,114,182,0.08)', label: 'Tiến Hành', emoji: '🎶' },
  },
}

// ─── Rainbow (dark, per-section vibrant gradient — demo2) ─────────────────
const RAINBOW: ThemeDef = {
  label: 'Rainbow',
  emoji: '🌈',
  isDark: true,
  logoStyle: {
    background: 'linear-gradient(135deg,#f472b6,#fb923c,#facc15,#34d399,#22d3ee,#a78bfa,#f472b6)',
    backgroundSize: '300% 300%',
    animation: 'logo-colors 3s ease infinite',
    boxShadow: '0 4px 18px rgba(244,114,182,0.45)',
  },
  vars: {
    '--t-bg':               '#04030f',
    '--t-header-bg':        'rgba(4,3,15,0.92)',
    '--t-header-border':    '2px solid rgba(255,255,255,0.06)',
    '--t-gamebar-bg':       'rgba(6,4,18,0.97)',
    '--t-gamebar-border':   '2px solid rgba(255,255,255,0.06)',
    '--t-stage-bar-bg':     'rgba(4,3,15,0.9)',
    '--t-stats-bar-bg':     'rgba(4,3,15,0.75)',
    '--t-card-bg':          'rgba(255,255,255,0.04)',
    '--t-card-shadow':      'rgba(167,139,250,0.14)',
    '--t-text':             '#f1f5f9',
    '--t-dim':              '#94a3b8',
    '--t-opt-lbl':          '#e879f9',
    '--t-opt-bg':           'rgba(255,255,255,0.05)',
    '--t-opt-border':       'rgba(255,255,255,0.10)',
    '--t-opt-text':         '#94a3b8',
    '--t-tab-bg':           'rgba(255,255,255,0.04)',
    '--t-tab-border':       'rgba(255,255,255,0.10)',
    '--t-tab-text':         '#94a3b8',
    '--t-fb-idle-bg':       'rgba(255,255,255,0.04)',
    '--t-fb-idle-border':   '2px dashed rgba(255,255,255,0.15)',
    '--t-fb-idle-text':     '#64748b',
    '--t-stage-btn-bg':     'rgba(255,255,255,0.04)',
    '--t-stage-btn-color':  '#94a3b8',
    '--t-stage-btn-border': '2px solid rgba(255,255,255,0.10)',
    '--t-stars-bg':         'rgba(250,204,21,0.14)',
    '--t-stars-text':       '#fbbf24',
    '--t-xp-text':          '#94a3b8',
    '--t-stat-bg':          'rgba(255,255,255,0.04)',
    '--t-stat-border':      'rgba(255,255,255,0.08)',
    '--t-stat-lbl':         '#475569',
    '--t-progressbar-track':'rgba(255,255,255,0.08)',
    '--t-scrollbar':        'rgba(167,139,250,0.3)',
    '--t-piano-white-border':'rgba(255,255,255,0.15)',
  },
  moduleAccents: {
    interval:    { accent: '#f472b6', accentDark: '#f9a8d4', glow: 'rgba(244,114,182,0.5)', subtle: 'rgba(244,114,182,0.08)', label: 'Quãng Nhạc', emoji: '↕' },
    chord:       { accent: '#fb923c', accentDark: '#fdba74', glow: 'rgba(251,146,60,0.5)',  subtle: 'rgba(251,146,60,0.08)',  label: 'Hợp Âm',    emoji: '🎵' },
    scale:       { accent: '#a3e635', accentDark: '#bef264', glow: 'rgba(163,230,53,0.5)',  subtle: 'rgba(163,230,53,0.08)',  label: 'Điệu Thức', emoji: '🎼' },
    note:        { accent: '#22d3ee', accentDark: '#67e8f9', glow: 'rgba(34,211,238,0.5)',  subtle: 'rgba(34,211,238,0.08)',  label: 'Nốt Đơn',   emoji: '♩' },
    piano:       { accent: '#a78bfa', accentDark: '#c4b5fd', glow: 'rgba(167,139,250,0.5)', subtle: 'rgba(167,139,250,0.08)', label: 'Đàn Tự Do', emoji: '🎹' },
    progression: { accent: '#34d399', accentDark: '#6ee7b7', glow: 'rgba(52,211,153,0.5)',  subtle: 'rgba(52,211,153,0.08)',  label: 'Tiến Hành', emoji: '🎶' },
  },
}

// ─── Neon (dark, per-section saturated — demo3) ───────────────────────────
const NEON: ThemeDef = {
  label: 'Neon',
  emoji: '⚡',
  isDark: true,
  logoStyle: {
    background: 'linear-gradient(270deg,#f43f5e,#f97316,#10b981,#38bdf8,#a855f7,#f43f5e)',
    backgroundSize: '400% 400%',
    animation: 'logo-colors 3s ease infinite',
    boxShadow: '0 4px 18px rgba(244,63,94,0.5)',
  },
  vars: {
    '--t-bg':               '#0c0910',
    '--t-header-bg':        'rgba(12,9,16,0.97)',
    '--t-header-border':    '2px solid rgba(255,255,255,0.07)',
    '--t-gamebar-bg':       'rgba(14,10,20,0.97)',
    '--t-gamebar-border':   '2px solid rgba(255,255,255,0.06)',
    '--t-stage-bar-bg':     'rgba(12,9,16,0.9)',
    '--t-stats-bar-bg':     'rgba(12,9,16,0.75)',
    '--t-card-bg':          'rgba(255,255,255,0.03)',
    '--t-card-shadow':      'rgba(168,85,247,0.12)',
    '--t-text':             '#f1f5f9',
    '--t-dim':              '#94a3b8',
    '--t-opt-lbl':          '#d8b4fe',
    '--t-opt-bg':           'rgba(255,255,255,0.04)',
    '--t-opt-border':       'rgba(255,255,255,0.08)',
    '--t-opt-text':         '#94a3b8',
    '--t-tab-bg':           'rgba(255,255,255,0.03)',
    '--t-tab-border':       'rgba(255,255,255,0.08)',
    '--t-tab-text':         '#94a3b8',
    '--t-fb-idle-bg':       'rgba(255,255,255,0.03)',
    '--t-fb-idle-border':   '2px dashed rgba(255,255,255,0.12)',
    '--t-fb-idle-text':     '#64748b',
    '--t-stage-btn-bg':     'rgba(255,255,255,0.04)',
    '--t-stage-btn-color':  '#94a3b8',
    '--t-stage-btn-border': '2px solid rgba(255,255,255,0.08)',
    '--t-stars-bg':         'rgba(250,204,21,0.12)',
    '--t-stars-text':       '#fbbf24',
    '--t-xp-text':          '#94a3b8',
    '--t-stat-bg':          'rgba(255,255,255,0.04)',
    '--t-stat-border':      'rgba(255,255,255,0.07)',
    '--t-stat-lbl':         '#475569',
    '--t-progressbar-track':'rgba(255,255,255,0.08)',
    '--t-scrollbar':        'rgba(255,255,255,0.15)',
    '--t-piano-white-border':'rgba(255,255,255,0.14)',
  },
  moduleAccents: {
    interval:    { accent: '#f43f5e', accentDark: '#fda4af', glow: 'rgba(244,63,94,0.45)',   subtle: 'rgba(244,63,94,0.07)',   label: 'Quãng Nhạc', emoji: '↕' },
    chord:       { accent: '#f97316', accentDark: '#fdba74', glow: 'rgba(249,115,22,0.45)',  subtle: 'rgba(249,115,22,0.07)',  label: 'Hợp Âm',    emoji: '♪' },
    scale:       { accent: '#10b981', accentDark: '#6ee7b7', glow: 'rgba(16,185,129,0.45)',  subtle: 'rgba(16,185,129,0.07)',  label: 'Điệu Thức', emoji: '🎼' },
    note:        { accent: '#38bdf8', accentDark: '#7dd3fc', glow: 'rgba(56,189,248,0.45)',  subtle: 'rgba(56,189,248,0.07)',  label: 'Nốt Đơn',   emoji: '♩' },
    piano:       { accent: '#a855f7', accentDark: '#d8b4fe', glow: 'rgba(168,85,247,0.45)',  subtle: 'rgba(168,85,247,0.07)',  label: 'Đàn Tự Do', emoji: '🎹' },
    progression: { accent: '#facc15', accentDark: '#fde047', glow: 'rgba(250,204,21,0.45)',  subtle: 'rgba(250,204,21,0.07)',  label: 'Tiến Hành', emoji: '🎶' },
  },
}

export const THEMES: Record<ThemeId, ThemeDef> = { kids: KIDS, classic: CLASSIC, studio: STUDIO, rainbow: RAINBOW, neon: NEON }
export const THEME_IDS: ThemeId[] = ['kids', 'classic', 'studio', 'rainbow', 'neon']

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
