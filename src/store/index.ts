import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Stage = 'interval' | 'chord' | 'scale' | 'note' | 'piano'
export type Difficulty = 'basic' | 'medium' | 'all'

interface SessionResult {
  date: string
  stage: Stage
  correct: number
  wrong: number
  durationMs: number
}

interface AppState {
  // Progress
  correct: number
  wrong: number
  streak: number
  score: number
  xp: number
  level: number
  history: SessionResult[]

  // UI state
  currentStage: Stage
  difficulty: Record<Stage, Difficulty>

  // Actions
  onCorrect: (xp?: number) => void
  onWrong: () => void
  setStage: (s: Stage) => void
  setDifficulty: (stage: Stage, d: Difficulty) => void
  addHistory: (r: SessionResult) => void
  reset: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      correct: 0,
      wrong: 0,
      streak: 0,
      score: 0,
      xp: 0,
      level: 1,
      history: [],
      currentStage: 'interval',
      difficulty: {
        interval: 'basic',
        chord: 'basic',
        scale: 'basic',
        note: 'basic',
        piano: 'basic',
      },

      onCorrect: (xp = 12) => {
        const { streak, score, level } = get()
        const bonus = streak > 2 ? 5 : 0
        const newXp = get().xp + xp
        const needed = level * 100
        const leveled = newXp >= needed
        set({
          correct: get().correct + 1,
          streak: streak + 1,
          score: score + xp + bonus,
          xp: leveled ? newXp - needed : newXp,
          level: leveled ? level + 1 : level,
        })
      },

      onWrong: () => set({ wrong: get().wrong + 1, streak: 0 }),

      setStage: (s) => set({ currentStage: s }),

      setDifficulty: (stage, d) =>
        set({ difficulty: { ...get().difficulty, [stage]: d } }),

      addHistory: (r) =>
        set({ history: [r, ...get().history].slice(0, 200) }),

      reset: () =>
        set({ correct: 0, wrong: 0, streak: 0, score: 0, xp: 0, level: 1, history: [] }),
    }),
    {
      name: 'sonicear-v1',
      partialize: (s) => ({
        correct: s.correct, wrong: s.wrong, streak: s.streak,
        score: s.score, xp: s.xp, level: s.level,
        history: s.history, difficulty: s.difficulty,
      }),
    }
  )
)
