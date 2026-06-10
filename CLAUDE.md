# CLAUDE.md — SonicEar

Hướng dẫn cho Claude Code khi làm việc với dự án này.

---

## Dự án là gì

**SonicEar** — Web app luyện cảm âm piano (Ear Training).
Mục tiêu: người dùng nghe âm thanh → nhận diện quãng / hợp âm / gam / nốt đơn.

Dự án đang ở **Phase 2** (web app đầy đủ). Phase 1 là single HTML file đã hoàn thành.

---

## Commands

```bash
npm run dev      # Dev server tại localhost:5173
npm run build    # TypeScript check + Vite build → dist/
npm run preview  # Preview bản build
npm run lint     # ESLint
```

---

## Tech Stack

| Layer | Thư viện | Version |
|-------|----------|---------|
| Framework | React | 19 |
| Language | TypeScript | 6 |
| Build | Vite | 8 |
| Styling | Tailwind CSS | v4 (dùng `@tailwindcss/vite` plugin, KHÔNG dùng postcss) |
| State | Zustand | 5 (với `persist` middleware → LocalStorage) |
| Routing | React Router | v7 |
| Audio | Web Audio API | native (không dùng Tone.js hay thư viện ngoài) |
| Backend | — | Chưa có. LocalStorage hiện tại. Supabase sẽ thêm sau |

---

## Cấu trúc thư mục

```
src/
├── audio/
│   └── engine.ts          # AudioEngine class (singleton export `audio`)
├── theory/
│   └── index.ts           # NOTE_NAMES, INTERVALS, CHORDS, SCALES, utils
├── components/
│   ├── Piano/
│   │   └── index.tsx      # Piano component — bàn phím tương tác
│   └── UI/
│       └── index.tsx      # Card, Btn, PlayBtn, FeedbackBar, OptionBtn, StatBox, ProgressBar, NoteBubble, ModuleTabs
├── modules/
│   ├── Interval/index.tsx # Luyện nhận diện quãng
│   ├── Chord/
│   │   ├── index.tsx      # re-export
│   │   └── ChordModule.tsx
│   ├── Scale/
│   │   ├── index.tsx
│   │   └── ScaleModule.tsx
│   ├── Note/
│   │   ├── index.tsx
│   │   └── NoteModule.tsx
│   └── FreePiano/
│       └── index.tsx      # Đàn tự do
├── store/
│   └── index.ts           # Zustand store — progress, XP, level, history
├── pages/
│   ├── Practice/
│   │   └── index.tsx      # Trang luyện tập chính (layout + stage routing)
│   ├── Home/              # Chưa build
│   └── Dashboard/         # Chưa build
├── App.tsx                # Router + Header + Background SVG
├── main.tsx
├── index.css              # Tailwind v4 @theme tokens + base styles
└── vite-env.d.ts
```

---

## Kiến trúc quan trọng

### Audio Engine (`src/audio/engine.ts`)

Singleton class `AudioEngine`, export instance là `audio`.

```ts
import { audio } from '@/audio/engine'

audio.attack(noteStr, velocity)   // bắt đầu phát nốt (giữ)
audio.release(noteStr, immediate) // dừng nốt (immediate=true: cắt ngay)
audio.releaseAll()                // dừng tất cả nốt đang phát
audio.playNote(ns, duration, velocity, delay)  // phát nốt tự release
audio.playNotes(noteStrs, arp, velocity)       // phát hợp âm hoặc arpeggio
audio.playScale(noteStrs, tempo)               // phát gam lên và xuống
```

**Piano synth model**: 4 oscillators (triangle + sawtooth detuned + sine sub + sine 2x) → BiquadFilter lowpass → EnvelopeGain (ADSR) → DryGain + ReverbConvolver → Compressor → Master.

**Quan trọng**: AudioContext chỉ được tạo sau user gesture. `audio.attack()` tự gọi `getAC()` → an toàn khi gọi trong event handler.

**NoteStr format**: `"C4"`, `"C#4"`, `"D5"` (tên nốt + octave, không có space).

### Theory (`src/theory/index.ts`)

```ts
NOTE_NAMES   // ['C','C#',...,'B']
NOTE_DISPLAY // ['C','C♯',...,'B']  — dùng để hiển thị
IS_BLACK     // [false,true,...] — map semitone → white/black key

noteToHz(name, octave)              // → Hz (A4 = 440)
shiftNote(rootIdx, semitones, oct)  // → noteStr
parseNote(noteStr)                  // → [name, octave]
buildScaleNotes(rootIdx, steps, oct) // → noteStr[]
shuffle(arr)   // Fisher-Yates
pick(arr)      // random element
```

### Store (`src/store/index.ts`)

```ts
const { correct, wrong, streak, score, xp, level,
        currentStage, difficulty,
        onCorrect, onWrong, setStage, setDifficulty } = useStore()
```

- `onCorrect(xp?)` — tăng correct, streak, score, XP. Tự level up.
- `onWrong()` — tăng wrong, reset streak về 0.
- Persist key: `sonicear-v1` trong localStorage.

### Piano Component (`src/components/Piano/index.tsx`)

```tsx
<Piano
  startOctave={3}
  numOctaves={2}
  small={false}
  highlighted={['C4', 'E4', 'G4']}  // nốt highlight màu xanh
  onKeyPress={(noteStr) => {}}
/>
```

- White key width: 40px (normal), 32px (small)
- Scroll ngang tự động khi content rộng hơn container
- `highlighted` prop → render màu xanh lên phím

### Design System

**Màu sắc** (định nghĩa trong `index.css` `@theme`):
```
--color-gold: #c9a84c
--color-gold-light: #e8c96d
--color-gold-dim: #7a6230
--color-dark: #0d0b08
--color-surface: #1a1610
--color-text: #e8dcc8
--color-dim: #8a7d6a
--color-ok: #4caf82
--color-bad: #c94c4c
```

**Font**:
- `font-display` → Playfair Display (tiêu đề, số)
- `font-mono` → DM Mono (labels, badges, code)
- body → Cormorant Garamond

**Tailwind v4 lưu ý**: Dùng `@tailwindcss/vite` plugin trong `vite.config.ts`, KHÔNG dùng `tailwind.config.js` hay postcss. Custom tokens trong `@theme {}` của `index.css`. Class utilities custom khai báo trong `@layer utilities {}`.

---

## Roadmap

### Đã xong
- [x] Single HTML prototype (Phase 1)
- [x] Project scaffold React + TS + Vite + Tailwind v4 + Zustand
- [x] Audio engine (Web Audio API)
- [x] Music theory module
- [x] Piano component
- [x] 4 modules: Interval, Chord, Scale, Note
- [x] Free Piano
- [x] Practice page với layout 2 cột
- [x] Zustand store + LocalStorage persist
- [x] 5 themes (kids/classic/studio/rainbow/neon) + ThemeSwitcher
- [x] PWA — vite-plugin-pwa, service worker, install banner, offline
- [x] Google Analytics 4 (placeholder G-XXXXXXXXXX, cần thay thật)
- [x] Supabase auth — email/password + Google OAuth
- [x] Profile page — hiển thị stats, lịch sử session, signout
- [x] Leaderboard page — top players by XP
- [x] Multi-device sync — stats + game sessions lưu Supabase
- [x] iOS safe area (notch/Dynamic Island)

### Cần làm tiếp (Phase 2)
- [ ] **Dashboard/Stats page** — biểu đồ accuracy theo ngày, streak calendar, heatmap
- [ ] **Spaced Repetition** — SM-2 algorithm, ôn lại câu hay sai
- [ ] **Chord Progression module** — nghe và nhận diện I-IV-V-I
- [ ] **Rhythm module** — nhận diện tiết tấu
- [ ] **Settings page** — cỡ bàn phím, transpose, volume
- [ ] **Dictation module** — nghe giai điệu, chép lại nốt

### Phase 3 (sau)
- [ ] **Claude API** — AI feedback cá nhân hoá, phân tích điểm yếu
- [ ] **Mobile app** — React Native hoặc Capacitor wrapper

### Backlog / Known bugs
- Xem `BACKLOG.md`

---

## Conventions

- Component files: PascalCase (`ChordModule.tsx`)
- Utility/store files: camelCase (`engine.ts`, `index.ts`)
- Module folders: PascalCase (`/modules/Chord/`)
- Path alias: `@/` → `src/` (cấu hình trong `vite.config.ts` và `tsconfig.app.json`)
- TypeScript strict: tắt (`"strict": false`) để dev nhanh, bật lại trước production
- Không dùng `any` trừ khi thực sự cần (WebAudio API)
- Mỗi module là self-contained: tự quản lý state local (useState), gọi `useStore` chỉ cho `onCorrect`/`onWrong`

---

## Lưu ý khi dev

1. **Audio phải trong user gesture** — không gọi `audio.attack()` ngoài event handler hoặc useEffect không có trigger.
2. **releaseAll() đã có global listener** — `mouseup`, `touchend`, `visibilitychange` đều gọi `audio.releaseAll()`. Không cần add thêm.
3. **NoteStr luôn là `NoteName + Octave`** — ví dụ `"C#4"`, không phải `"Cs4"` hay `"C# 4"`.
4. **Tailwind v4 không dùng arbitrary values cho màu custom** — dùng CSS variable trực tiếp: `style={{ color: 'var(--color-gold)' }}` hoặc khai báo utility trong `index.css`.
5. **Piano highlighted prop** — chỉ màu xanh (đúng). Nếu cần màu đỏ (sai), cần thêm prop `highlightedWrong` vào Piano component.
