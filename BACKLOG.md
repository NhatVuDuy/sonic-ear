# SonicEar — Backlog

## Bugs

### [BUG] iOS mute switch: Web Audio không ra loa ngoài khi mute ON (Safari browser)
**Priority**: Medium  
**Status**: Open

**Mô tả**: Khi bật hardware mute switch trên iPhone, Web Audio API bị tắt tiếng dù đang dùng Safari browser (không phải PWA). YouTube và các app HTML5 video/audio khác vẫn ra loa ngoài bình thường với mute ON.

**Root cause**: iOS chạy Web Audio API dưới `AVAudioSessionCategoryAmbient` (bị mute switch tắt). `HTMLAudioElement` chạy dưới `AVAudioSessionCategoryPlayback` (bỏ qua mute switch). Cần "lừa" iOS upgrade session cả trang lên Playback bằng cách play một `<audio>` element thật.

**Các hướng đã thử** (tất cả đều thất bại hoặc chưa xác nhận):
- `masterGain → createMediaStreamDestination → <audio srcObject>` — confirm được lúc commit b9fb81f, nhưng sau khi thêm PWA/SW thì không còn ổn định
- `<audio src=/silent.wav volume=0.001>` — volume dưới ngưỡng iOS detect
- Dual path: `ac.destination` + `<audio srcObject volume=1.0>` tap 0.001 — không được
- `<audio src=/silent.wav volume=1.0>` — file toàn zeros, iOS không nhận ra là active media
- **Hiện tại (v1.2.3)**: `ac.destination` + Blob URL WAV ±1 LSB noise, volume=1.0 — chưa xác nhận

**Debug code**: Đã thêm `console.log` chi tiết vào `buildChain()`, cần chạy Safari Web Inspector để xem output.

**Hướng xử lý tiếp**:
1. Lấy console log từ Safari Web Inspector để biết `el.play()` resolve hay reject
2. Nếu resolve mà vẫn không bypass: tăng signal amplitude trong WAV (thử -20 dBFS)
3. Nếu reject: gesture timing bị vỡ đâu đó — trace lại call stack
4. Xem xét dùng `<audio>` loop với actual audible note (rất nhỏ) thay vì noise
