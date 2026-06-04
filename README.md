# SonicEar — Luyện Cảm Âm

Web app luyện cảm âm piano với âm thanh chất lượng cao.

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Zustand (state + LocalStorage persist)
- React Router v6
- Web Audio API (không dụng thư viện ngoài)

## Cấu trúc
```
src/
├── audio/        # Audio engine (Web Audio API)
├── theory/       # Music theory (intervals, chords, scales)
├── components/
│   ├── Piano/    # Bàn phím tương tác
│   └── UI/       # Card, Button, FeedbackBar...
├── modules/      # Interval, Chord, Scale, Note, FreePiano
├── store/        # Zustand store
└── pages/
    └── Practice/ # Trang luyện tập chính
```

## Chạy local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
# Output: dist/
```

## Deploy lên Vercel
```bash
npm i -g vercel
vercel --prod
```

## Thêm Supabase (Phase 3)
Khi cần lưu tiến độ online:
1. Tạo project tại supabase.com
2. `npm install @supabase/supabase-js`
3. Thêm auth + sync vào store/
