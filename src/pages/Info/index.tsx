import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'

// ── Animated hero note ────────────────────────────────────────────────────────
function FloatingNote({ char, x, y, size, delay, dur, color }: {
  char: string; x: string; y: string; size: string; delay: string; dur: string; color: string
}) {
  return (
    <div className="absolute pointer-events-none select-none animate-float"
      style={{ left: x, top: y, fontSize: size, color, animationDelay: delay, animationDuration: dur, opacity: 0.18 }}>
      {char}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function Stat({ val, label, color }: { val: string | number; label: string; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-3xl px-5 py-4 text-center flex-1 min-w-[80px]"
      style={{ background: 'var(--t-card-bg)', border: '1.5px solid var(--t-opt-border)', boxShadow: 'var(--t-card-shadow)' }}>
      <span className="font-display text-2xl font-bold" style={{ color: color || 'var(--accent)' }}>{val}</span>
      <span className="font-mono text-[.58rem] tracking-widest" style={{ color: 'var(--t-dim)' }}>{label}</span>
    </div>
  )
}

// ── Module card ───────────────────────────────────────────────────────────────
const MODULES = [
  {
    emoji: '🎯', label: 'Quãng', en: 'Interval',
    color: '#4d96ff',
    desc: 'Nhận diện khoảng cách giữa hai nốt — nền tảng của mọi kỹ năng cảm âm.',
    tags: ['11 quãng', '3 cấp độ', 'SM-2'],
  },
  {
    emoji: '🎸', label: 'Hợp Âm', en: 'Chord',
    color: '#f43f5e',
    desc: 'Phân biệt major, minor, dim, aug, sus, dom7, maj7, m7 và nhiều hơn.',
    tags: ['12 loại', 'Block + Arp', 'random root'],
  },
  {
    emoji: '🎼', label: 'Điệu Thức', en: 'Scale',
    color: '#a855f7',
    desc: 'Major, natural minor, dorian, phrygian, lydian, mixolydian, pentatonic.',
    tags: ['8 gam', 'Lên & xuống', 'playScale()'],
  },
  {
    emoji: '🎵', label: 'Nốt Đơn', en: 'Note',
    color: '#10b981',
    desc: 'Luyện cảm âm tuyệt đối — nghe một nốt, nhận diện tên từ bàn phím piano.',
    tags: ['12 nốt', 'Piano UI', 'SR-weighted'],
  },
  {
    emoji: '🎶', label: 'Tiến Hành', en: 'Progression',
    color: '#f59e0b',
    desc: 'I–IV–V–I, Pop, Jazz ii–V–I, 50s, Rock minor, Blues 12-bar.',
    tags: ['6 tiến hành', '22 XP', 'Block + Arp'],
  },
  {
    emoji: '🥁', label: 'Tiết Tấu', en: 'Rhythm',
    color: '#ef4444',
    desc: 'Nghe click-track và nhận diện 2/4, 3/4, 4/4, nốt chấm, syncopation.',
    tags: ['7 tiết tấu', 'Click-track', '14 XP'],
  },
  {
    emoji: '🎹', label: 'Đàn Tự Do', en: 'Free Piano',
    color: '#06b6d4',
    desc: 'Piano synth 8-oscillator chất lượng cao. Khám phá âm thanh tự do.',
    tags: ['2+ quãng 8', 'Reverb + Chorus', 'Không SR'],
  },
]

const FEATURES = [
  { emoji: '🧠', title: 'Spaced Repetition', desc: 'SM-2 tự động ưu tiên nội dung bạn hay sai — học ít, nhớ lâu.' },
  { emoji: '📊', title: 'Thống Kê', desc: 'Heatmap 35 ngày, accuracy/module, điểm yếu theo SM-2.' },
  { emoji: '🎨', title: '5 Theme', desc: 'Kids · Classic · Studio · Rainbow · Neon, mỗi module có màu riêng.' },
  { emoji: '⚡', title: 'Gamification', desc: 'XP, level, streak, bonus combo — không bao giờ nhàm chán.' },
  { emoji: '☁️', title: 'Cloud Sync', desc: 'Đăng nhập Supabase, đồng bộ tiến độ giữa các thiết bị.' },
  { emoji: '📱', title: 'PWA Offline', desc: 'Cài như app native iOS/Android, hoạt động 100% offline.' },
  { emoji: '⌨️', title: 'Phím Tắt', desc: 'Space phát âm, 1–8 chọn đáp án. Luyện tập không cần chuột.' },
  { emoji: '🔊', title: 'Piano Synth', desc: '8 oscillator, stereo chorus ±4 cents, presence EQ, reverb convolver.' },
]

// ── Step connector ─────────────────────────────────────────────────────────────
function StepFlow() {
  const steps = [
    { emoji: '👂', title: 'Nghe', desc: 'Nhấn ▶ để nghe âm thanh tổng hợp bằng Web Audio API. Nghe lại bao nhiêu lần tuỳ thích.' },
    { emoji: '🤔', title: 'Nhận diện', desc: 'Chọn đáp án đúng trong 2–4 lựa chọn. Phím số 1–8 để chọn nhanh.' },
    { emoji: '📈', title: 'SM-2 điều chỉnh', desc: 'Hệ thống tự tính lịch ôn tập tối ưu — câu sai được ôn lại sớm hơn.' },
    { emoji: '🏆', title: 'Level up', desc: 'Tích XP, phá streak, lên level. Dashboard ghi lại mọi buổi luyện tập.' },
  ]
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-0">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col sm:flex-row items-center flex-1">
          <div className="flex flex-col items-center text-center gap-3 flex-1 px-4 py-5 rounded-3xl"
            style={{ background: 'var(--t-card-bg)', border: '1.5px solid var(--t-opt-border)', boxShadow: 'var(--t-card-shadow)' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-bold"
              style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 14px var(--accent-glow,rgba(255,107,107,0.35))' }}>
              {s.emoji}
            </div>
            <div>
              <div className="font-display font-bold text-[.92rem]" style={{ color: 'var(--t-text)' }}>
                <span style={{ color: 'var(--accent)', marginRight: 4 }}>{i + 1}.</span>{s.title}
              </div>
              <p className="mt-1.5 font-mono text-[.68rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>{s.desc}</p>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className="hidden sm:flex text-[1.4rem] px-1.5 flex-shrink-0" style={{ color: 'var(--accent)', opacity: 0.5 }}>›</div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Progress arc (visual XP indicator) ───────────────────────────────────────
function XpArc({ xp, level }: { xp: number; level: number }) {
  const need = level * 100
  const pct = Math.min(1, xp / need)
  const r = 28, cx = 36, cy = 36
  const circ = 2 * Math.PI * r
  return (
    <svg width={72} height={72} viewBox="0 0 72 72">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--t-opt-border)" strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--accent)" strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, fill: 'var(--t-text)', fontWeight: 700 }}>
        Lv.{level}
      </text>
    </svg>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function InfoPage() {
  const navigate = useNavigate()
  const { correct, wrong, streak, level, xp, history } = useStore()
  const total = correct + wrong
  const acc = total ? Math.round(correct / total * 100) : null
  const hasData = total > 0
  const sessions = history.length
  const days = new Set(history.map(r => r.date.slice(0, 10))).size

  return (
    <div className="flex-1 overflow-y-auto animate-[fadeUp_.32s_ease_both]">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28 overflow-hidden">
        {/* floating notes */}
        <FloatingNote char="♩" x="4%" y="12%" size="2.5rem" delay="0s"    dur="4.2s" color="var(--accent)" />
        <FloatingNote char="♪" x="88%" y="8%"  size="2rem"  delay="0.7s"  dur="3.8s" color="var(--accent)" />
        <FloatingNote char="𝄞" x="6%"  y="65%" size="2.8rem" delay="1.2s" dur="5s"   color="var(--accent)" />
        <FloatingNote char="♫" x="90%" y="70%" size="2rem"  delay="2s"    dur="4.5s" color="var(--accent)" />
        <FloatingNote char="♬" x="50%" y="5%"  size="1.8rem" delay="0.3s" dur="3.5s" color="var(--accent)" />

        <div className="relative z-10 flex flex-col items-center gap-7 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl text-4xl shadow-2xl"
              style={{ background: 'var(--accent)', boxShadow: '0 8px 40px var(--accent-glow,rgba(255,107,107,0.5))' }}>
              🎵
            </div>
            <div className="text-left">
              <div className="font-display text-[2.8rem] font-bold leading-none" style={{ color: 'var(--t-text)' }}>SonicEar</div>
              <div className="font-mono text-[.62rem] tracking-[.2em] mt-1" style={{ color: 'var(--t-dim)' }}>LUYỆN CẢM ÂM PIANO</div>
            </div>
          </div>

          <p className="font-display text-[1.1rem] leading-relaxed max-w-md" style={{ color: 'var(--t-dim)' }}>
            Luyện cảm âm theo phương pháp khoa học.<br />
            <span style={{ color: 'var(--accent)' }}>Spaced Repetition · Gamification · 7 module.</span><br />
            Miễn phí hoàn toàn, hoạt động offline.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate('/practice')}
              className="rounded-2xl px-8 py-3.5 font-mono text-[.85rem] font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'var(--accent)', boxShadow: '0 6px 28px var(--accent-glow,rgba(255,107,107,0.45))' }}>
              🎯 Bắt đầu luyện tập →
            </button>
            <button onClick={() => navigate('/sys')}
              className="rounded-2xl px-6 py-3.5 font-mono text-[.85rem] transition-all hover:opacity-80 active:scale-95"
              style={{ background: 'var(--t-opt-bg)', border: '2px solid var(--t-opt-border)', color: 'var(--t-dim)' }}>
              ⚙️ System design
            </button>
          </div>

          {/* tech badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['React 19', 'TypeScript', 'Web Audio API', 'Supabase', 'PWA', 'SM-2 SR'].map(t => (
              <span key={t} className="rounded-full px-3 py-1 font-mono text-[.6rem]"
                style={{ background: 'var(--t-opt-bg)', border: '1px solid var(--t-opt-border)', color: 'var(--t-dim)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERSONAL STATS (if has data) ──────────────────────────────────── */}
      {hasData && (
        <div className="px-4 sm:px-8 pb-10">
          <div className="max-w-3xl mx-auto rounded-3xl p-5"
            style={{ background: 'var(--t-card-bg)', border: '2px solid var(--t-opt-border)', boxShadow: 'var(--t-card-shadow)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[.65rem] tracking-widest font-bold" style={{ color: 'var(--accent)' }}>📈 TIẾN ĐỘ CỦA BẠN</div>
              <button onClick={() => navigate('/dashboard')} className="font-mono text-[.62rem] hover:opacity-70 transition-opacity" style={{ color: 'var(--t-dim)' }}>
                Xem chi tiết →
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <XpArc xp={xp} level={level} />
              <div className="flex flex-wrap gap-2 flex-1">
                <Stat val={total.toLocaleString()} label="TỔNG CÂU" />
                <Stat val={acc !== null ? `${acc}%` : '—'} label="CHÍNH XÁC"
                  color={acc !== null ? (acc >= 80 ? '#26de81' : acc >= 60 ? 'var(--accent)' : '#f87171') : undefined} />
                <Stat val={streak} label="STREAK" />
                <Stat val={sessions} label="BUỔI" />
                <Stat val={days} label="NGÀY" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 7 MODULES ─────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[1.3rem] font-bold text-center mb-2" style={{ color: 'var(--t-text)' }}>
            7 Module Luyện Tập
          </h2>
          <p className="text-center font-mono text-[.72rem] mb-7" style={{ color: 'var(--t-dim)' }}>
            Mỗi module tích hợp spaced repetition — tự động ưu tiên nội dung bạn còn yếu
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODULES.map(m => (
              <div key={m.en}
                className="rounded-3xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.02] cursor-default"
                style={{ background: 'var(--t-card-bg)', boxShadow: 'var(--t-card-shadow)', border: `1.5px solid ${m.color}30` }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-[1.5rem] flex-shrink-0"
                    style={{ background: `${m.color}18`, border: `1.5px solid ${m.color}30` }}>
                    {m.emoji}
                  </div>
                  <div>
                    <div className="font-display font-bold" style={{ color: 'var(--t-text)' }}>{m.label}</div>
                    <div className="font-mono text-[.58rem] font-bold tracking-wider" style={{ color: m.color }}>{m.en.toUpperCase()}</div>
                  </div>
                </div>
                <p className="font-mono text-[.69rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>{m.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map(t => (
                    <span key={t} className="rounded-full px-2.5 py-0.5 font-mono text-[.58rem]"
                      style={{ background: `${m.color}12`, color: m.color, border: `1px solid ${m.color}30` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {/* CTA card */}
            <button onClick={() => navigate('/practice')}
              className="rounded-3xl p-5 flex flex-col items-center justify-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
              style={{ background: 'var(--accent)', boxShadow: '0 6px 28px var(--accent-glow,rgba(255,107,107,0.35))' }}>
              <div className="text-[2rem]">🎯</div>
              <div className="font-display font-bold text-white text-[1rem]">Bắt đầu ngay</div>
              <div className="font-mono text-[.65rem] text-white opacity-80">Miễn phí · Không cần tài khoản</div>
            </button>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 py-12" style={{ background: 'rgba(0,0,0,0.025)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[1.3rem] font-bold text-center mb-7" style={{ color: 'var(--t-text)' }}>
            Cách Hoạt Động
          </h2>
          <StepFlow />
        </div>
      </div>

      {/* ── FEATURES GRID ─────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[1.3rem] font-bold text-center mb-7" style={{ color: 'var(--t-text)' }}>
            Tính Năng Nổi Bật
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FEATURES.map(f => (
              <div key={f.title}
                className="rounded-3xl p-4 flex flex-col gap-2"
                style={{ background: 'var(--t-card-bg)', boxShadow: 'var(--t-card-shadow)', border: '1.5px solid var(--t-opt-border)' }}>
                <span className="text-2xl">{f.emoji}</span>
                <div className="font-mono text-[.72rem] font-bold" style={{ color: 'var(--t-text)' }}>{f.title}</div>
                <p className="font-mono text-[.63rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 px-6 py-16 text-center"
        style={{ background: 'rgba(0,0,0,0.03)' }}>
        <p className="font-display text-[1.15rem]" style={{ color: 'var(--t-text)' }}>
          Mỗi ngày 10 phút — tai nghe âm nhạc cải thiện rõ rệt.
        </p>
        <button onClick={() => navigate('/practice')}
          className="rounded-2xl px-10 py-4 font-mono text-[.85rem] font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--accent)', boxShadow: '0 8px 32px var(--accent-glow,rgba(255,107,107,0.45))' }}>
          🎹 Bắt đầu luyện tập →
        </button>
        <div className="flex items-center gap-4 mt-1">
          {[
            ['📊', 'Thống kê', '/dashboard'],
            ['⚙️', 'System design', '/sys'],
            ['🔧', 'Cài đặt', '/settings'],
          ].map(([icon, label, path]) => (
            <button key={path as string} onClick={() => navigate(path as string)}
              className="font-mono text-[.65rem] hover:opacity-80 transition-opacity" style={{ color: 'var(--t-dim)' }}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
