import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  volume: number      // 0–1  (default 0.82)
  reverbMix: number   // 0–1  (default 1 = full reverb as built)
  scaleTempo: number  // seconds per note (default 0.2)
}

interface SettingsState extends Settings {
  update: (patch: Partial<Settings>) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      volume: 0.82,
      reverbMix: 1.0,
      scaleTempo: 0.2,
      update: (patch) => set(patch),
    }),
    { name: 'sonicear-settings-v1' }
  )
)
