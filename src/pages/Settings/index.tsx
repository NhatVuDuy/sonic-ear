import { useNavigate } from 'react-router-dom'
import { useSettings } from '@/store/settings'
import { useStore } from '@/store'
import { useSRStore } from '@/store/sr'
import { audio } from '@/audio/engine'
import { Card, CardTitle } from '@/components/UI'
import { useState } from 'react'

function Slider({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number
  format: (v: number) => string; onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[.72rem] t-lbl">{label}</span>
        <span className="font-mono text-[.68rem] t-dim">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--accent)] h-2 rounded-full cursor-pointer"
        style={{ accentColor: 'var(--accent)' }}
      />
      <div className="flex justify-between font-mono text-[.55rem] t-dim">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const { volume, reverbMix, scaleTempo, update } = useSettings()
  const { reset } = useStore()
  const { reset: resetSR } = useSRStore()
  const [confirmReset, setConfirmReset] = useState(false)

  const handleVolume = (v: number) => {
    update({ volume: v })
    audio.setVolume(v)
  }

  const handleReverb = (v: number) => {
    update({ reverbMix: v })
    audio.setReverb(v)
  }

  const handleTempo = (v: number) => {
    update({ scaleTempo: v })
    audio.scaleTempo = v
  }

  const handleReset = () => {
    reset()
    resetSR()
    setConfirmReset(false)
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 animate-[fadeUp_.32s_ease_both]">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/practice')}
          className="rounded-xl px-3 py-1.5 font-mono text-[.72rem] transition-all hover:opacity-70"
          style={{ background: 'var(--t-opt-bg)', border: '2px solid var(--t-opt-border)', color: 'var(--t-dim)' }}
        >
          ← Luyện tập
        </button>
        <div>
          <div className="font-display text-[1.4rem] font-bold t-lbl">⚙️ Cài Đặt</div>
          <div className="font-mono text-[.62rem] t-dim">Âm thanh · Tốc độ · Dữ liệu</div>
        </div>
      </div>

      {/* Audio settings */}
      <Card>
        <CardTitle>🔊 Âm thanh</CardTitle>
        <div className="flex flex-col gap-5">
          <Slider
            label="Âm lượng"
            value={volume}
            min={0} max={1} step={0.01}
            format={v => `${Math.round(v * 100)}%`}
            onChange={handleVolume}
          />
          <Slider
            label="Hiệu ứng vang (Reverb)"
            value={reverbMix}
            min={0} max={1} step={0.01}
            format={v => `${Math.round(v * 100)}%`}
            onChange={handleReverb}
          />
        </div>
      </Card>

      {/* Scale tempo */}
      <Card>
        <CardTitle>🎼 Tốc độ gam</CardTitle>
        <Slider
          label="Thời gian mỗi nốt"
          value={scaleTempo}
          min={0.08} max={0.5} step={0.01}
          format={v => v <= 0.12 ? 'Nhanh' : v >= 0.38 ? 'Chậm' : `${Math.round(v * 1000)}ms`}
          onChange={handleTempo}
        />
        <div className="mt-3 flex gap-2">
          {([['Nhanh', 0.10], ['Bình thường', 0.20], ['Chậm', 0.40]] as const).map(([label, val]) => (
            <button
              key={label}
              onClick={() => handleTempo(val)}
              className="flex-1 rounded-xl py-2 font-mono text-[.68rem] transition-all hover:opacity-80 active:scale-95"
              style={Math.abs(scaleTempo - val) < 0.02 ? {
                background: 'var(--accent)',
                color: '#fff',
              } : {
                background: 'var(--t-opt-bg)',
                border: '2px solid var(--t-opt-border)',
                color: 'var(--t-dim)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Data management */}
      <Card>
        <CardTitle>🗑️ Dữ liệu</CardTitle>
        <p className="font-mono text-[.72rem] t-dim mb-4">
          Xoá toàn bộ tiến độ: điểm, level, XP, lịch sử luyện tập, và dữ liệu spaced repetition.
        </p>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full rounded-xl py-2.5 font-mono text-[.72rem] font-bold transition-all hover:opacity-80 active:scale-95"
            style={{ background: 'rgba(201,76,76,0.12)', border: '2px solid rgba(201,76,76,0.35)', color: '#c94c4c' }}
          >
            Đặt lại tiến độ
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[.68rem] text-center" style={{ color: '#c94c4c' }}>
              Bạn chắc chắn muốn xoá toàn bộ dữ liệu?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded-xl py-2.5 font-mono text-[.72rem] transition-all hover:opacity-80"
                style={{ background: 'var(--t-opt-bg)', border: '2px solid var(--t-opt-border)', color: 'var(--t-dim)' }}
              >
                Huỷ
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl py-2.5 font-mono text-[.72rem] font-bold transition-all hover:opacity-80 active:scale-95"
                style={{ background: '#c94c4c', color: '#fff' }}
              >
                Xác nhận xoá
              </button>
            </div>
          </div>
        )}
      </Card>

    </div>
  )
}
