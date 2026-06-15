import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'

const MODULES = [
  {
    emoji: '🎯', label: 'Quãng', name: 'Interval',
    desc: 'Nhận diện khoảng cách giữa hai nốt nhạc — từ unison đến quãng 8. Nền tảng của mọi kỹ năng cảm âm.',
    tags: ['11 loại quãng', 'SM-2 spaced repetition', '3 cấp độ'],
  },
  {
    emoji: '🎸', label: 'Hợp Âm', name: 'Chord',
    desc: 'Phân biệt major, minor, diminished, augmented, sus, và các biến thể 7. Chơi dưới dạng block chord hoặc arpeggio.',
    tags: ['12 loại hợp âm', 'Block & Arpeggio', '3 cấp độ'],
  },
  {
    emoji: '🎼', label: 'Điệu Thức', name: 'Scale',
    desc: 'Nhận diện các gam và điệu thức: major, minor, dorian, phrygian, lydian, mixolydian, và pentatonic.',
    tags: ['8 điệu thức', 'Lên & xuống', '2 cấp độ'],
  },
  {
    emoji: '🎵', label: 'Nốt Đơn', name: 'Note',
    desc: 'Luyện cảm âm tuyệt đối — nghe một nốt và nhận diện tên nốt. Cực kỳ hiệu quả với spaced repetition.',
    tags: ['12 nốt chromatic', 'Piano tương tác', 'SR-weighted'],
  },
  {
    emoji: '🎶', label: 'Tiến Hành', name: 'Progression',
    desc: 'Nhận diện các tiến hành hợp âm phổ biến: I–IV–V–I, Pop, Jazz ii–V–I, Blues 12-bar, và nhiều hơn.',
    tags: ['6 tiến hành', 'Block & Arpeggio', '3 cấp độ'],
  },
  {
    emoji: '🥁', label: 'Tiết Tấu', name: 'Rhythm',
    desc: 'Nghe click-track và nhận diện tiết tấu: 2/4, 3/4, 4/4, nốt chấm dôi, nốt móc đơn, syncopation.',
    tags: ['7 tiết tấu', 'Click-track', '3 cấp độ'],
  },
  {
    emoji: '🎹', label: 'Đàn Tự Do', name: 'Free Piano',
    desc: 'Bàn phím piano tương tác để khám phá âm thanh tự do. Piano synth chất lượng cao với reverb và stereo.',
    tags: ['2+ quãng 8', 'Piano synth', 'Highlight nốt'],
  },
]

const FEATURES = [
  { emoji: '🧠', title: 'Spaced Repetition', desc: 'Thuật toán SM-2 tự động ưu tiên luyện tập những nội dung bạn hay sai.' },
  { emoji: '📊', title: 'Thống Kê Chi Tiết', desc: 'Heatmap 35 ngày, accuracy theo module, danh sách điểm yếu cụ thể.' },
  { emoji: '🎨', title: '5 Theme', desc: 'Kids, Classic, Studio, Rainbow, Neon — tuỳ chỉnh giao diện theo sở thích.' },
  { emoji: '🎵', title: 'Piano Synth Chất Lượng', desc: '8 oscillator, ADSR envelope, stereo chorus, presence EQ, reverb convolver.' },
  { emoji: '⚡', title: 'Level & XP', desc: 'Hệ thống gamification với streak, bonus XP, và level up khi đạt đủ điểm.' },
  { emoji: '📱', title: 'PWA', desc: 'Cài đặt như app native, chạy offline không cần mạng, hỗ trợ iOS & Android.' },
  { emoji: '☁️', title: 'Cloud Sync', desc: 'Đăng nhập Supabase để đồng bộ tiến độ giữa nhiều thiết bị.' },
  { emoji: '⌨️', title: 'Phím Tắt', desc: 'Space phát âm, 1–8 chọn đáp án — luyện tập không cần chuột.' },
]

const STEPS = [
  { n: '1', title: 'Nghe', desc: 'Nhấn nút ▶ để nghe âm thanh. Có thể nghe lại nhiều lần.', emoji: '👂' },
  { n: '2', title: 'Nhận diện', desc: 'Chọn đáp án đúng từ các lựa chọn hiển thị trên màn hình.', emoji: '🤔' },
  { n: '3', title: 'Học & Tiến bộ', desc: 'Hệ thống SM-2 tự động điều chỉnh — ôn lại những gì bạn còn yếu.', emoji: '📈' },
]

function StatChip({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl px-4 py-3 gap-0.5"
      style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)' }}>
      <span className="font-display text-xl font-bold" style={{ color: 'var(--accent)' }}>{value}</span>
      <span className="font-mono text-[.6rem] tracking-wider" style={{ color: 'var(--t-dim)' }}>{label}</span>
    </div>
  )
}

export function InfoPage() {
  const navigate = useNavigate()
  const { correct, wrong, streak, level, xp, history } = useStore()
  const total = correct + wrong
  const acc = total ? Math.round(correct / total * 100) : null
  const hasData = total > 0

  return (
    <div className="flex-1 overflow-y-auto animate-[fadeUp_.32s_ease_both]">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-[12rem] opacity-[0.04] select-none">🎵</div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-3xl text-3xl shadow-xl"
              style={{ background: 'var(--accent)', boxShadow: '0 8px 32px var(--accent-glow, rgba(255,107,107,0.4))' }}
            >🎵</div>
            <div className="font-display text-[2.4rem] font-bold" style={{ color: 'var(--t-text)' }}>SonicEar</div>
          </div>
          <p className="font-display text-[1.15rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>
            Luyện cảm âm piano theo phương pháp khoa học.<br />
            Spaced repetition · Gamification · Hoàn toàn miễn phí.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/practice')}
              className="rounded-2xl px-8 py-3.5 font-mono text-[.85rem] font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: 'var(--accent)', boxShadow: '0 6px 24px var(--accent-glow, rgba(255,107,107,0.4))' }}
            >
              🎯 Bắt đầu luyện tập →
            </button>
            <button
              onClick={() => navigate('/sys')}
              className="rounded-2xl px-6 py-3.5 font-mono text-[.85rem] transition-all hover:opacity-80 active:scale-95"
              style={{ background: 'var(--t-opt-bg)', border: '2px solid var(--t-opt-border)', color: 'var(--t-dim)' }}
            >
              ⚙️ Thiết kế hệ thống
            </button>
          </div>
        </div>
      </div>

      {/* ── Personal stats (if played) ────────────────────────────────── */}
      {hasData && (
        <div className="px-4 sm:px-8 pb-8 flex justify-center">
          <div className="w-full max-w-2xl rounded-3xl p-5"
            style={{ background: 'var(--t-card-bg)', boxShadow: 'var(--t-card-shadow)', border: '2px solid var(--t-opt-border)' }}>
            <div className="font-mono text-[.65rem] tracking-widest mb-3" style={{ color: 'var(--t-dim)' }}>📈 TIẾN ĐỘ CỦA BẠN</div>
            <div className="flex flex-wrap gap-3">
              <StatChip value={`Lv.${level}`} label="LEVEL" />
              <StatChip value={xp} label="XP" />
              <StatChip value={total.toLocaleString()} label="TỔNG CÂU" />
              <StatChip value={acc !== null ? `${acc}%` : '—'} label="CHÍNH XÁC" />
              <StatChip value={streak} label="STREAK" />
              <StatChip value={history.length} label="BUỔI" />
            </div>
          </div>
        </div>
      )}

      {/* ── Modules grid ──────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[1.25rem] font-bold mb-6 text-center" style={{ color: 'var(--t-text)' }}>
            7 Module Luyện Tập
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODULES.map(m => (
              <div
                key={m.name}
                className="rounded-3xl p-5 flex flex-col gap-2.5 transition-all hover:scale-[1.02] cursor-default"
                style={{ background: 'var(--t-card-bg)', boxShadow: 'var(--t-card-shadow)', border: '1.5px solid var(--t-opt-border)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[1.6rem]">{m.emoji}</span>
                  <div>
                    <div className="font-display font-bold" style={{ color: 'var(--t-text)' }}>{m.label}</div>
                    <div className="font-mono text-[.6rem] t-dim">{m.name}</div>
                  </div>
                </div>
                <p className="font-mono text-[.7rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>{m.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {m.tags.map(t => (
                    <span key={t} className="rounded-full px-2.5 py-0.5 font-mono text-[.58rem]"
                      style={{ background: 'rgba(var(--accent-rgb,255,107,107),0.1)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb,255,107,107),0.2)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 pb-12" style={{ background: 'rgba(0,0,0,0.03)' }}>
        <div className="max-w-3xl mx-auto py-10">
          <h2 className="font-display text-[1.25rem] font-bold mb-8 text-center" style={{ color: 'var(--t-text)' }}>
            Cách Hoạt Động
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <div key={s.n} className="flex flex-col items-center text-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold shadow-lg"
                  style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 16px var(--accent-glow, rgba(255,107,107,0.3))' }}>
                  {s.emoji}
                </div>
                <div>
                  <div className="font-display font-bold text-[1rem]" style={{ color: 'var(--t-text)' }}>
                    <span className="opacity-40 mr-1">{s.n}.</span>{s.title}
                  </div>
                  <p className="mt-1.5 font-mono text-[.7rem] leading-relaxed" style={{ color: 'var(--t-dim)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features grid ─────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[1.25rem] font-bold mb-6 text-center" style={{ color: 'var(--t-text)' }}>
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

      {/* ── CTA bottom ────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
        <p className="font-display text-[1.1rem]" style={{ color: 'var(--t-dim)' }}>
          Mỗi ngày 10 phút — tai nghe âm nhạc sẽ cải thiện rõ rệt.
        </p>
        <button
          onClick={() => navigate('/practice')}
          className="rounded-2xl px-10 py-4 font-mono text-[.85rem] font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
          style={{ background: 'var(--accent)', boxShadow: '0 8px 28px var(--accent-glow, rgba(255,107,107,0.45))' }}
        >
          🎹 Bắt đầu ngay →
        </button>
        <div className="flex items-center gap-4 mt-2">
          <button onClick={() => navigate('/dashboard')} className="font-mono text-[.68rem] hover:opacity-70 transition-opacity" style={{ color: 'var(--t-dim)' }}>📊 Thống kê</button>
          <span style={{ color: 'var(--t-dim)', opacity: 0.4 }}>·</span>
          <button onClick={() => navigate('/sys')} className="font-mono text-[.68rem] hover:opacity-70 transition-opacity" style={{ color: 'var(--t-dim)' }}>⚙️ System Design</button>
          <span style={{ color: 'var(--t-dim)', opacity: 0.4 }}>·</span>
          <button onClick={() => navigate('/settings')} className="font-mono text-[.68rem] hover:opacity-70 transition-opacity" style={{ color: 'var(--t-dim)' }}>🔧 Cài đặt</button>
        </div>
        <p className="font-mono text-[.55rem] mt-4" style={{ color: 'var(--t-dim)', opacity: 0.45 }}>
          Open source · Web Audio API · React 19 · Supabase · PWA
        </p>
      </div>

    </div>
  )
}
