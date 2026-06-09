import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeId } from '@/theme'
import { analytics } from '@/analytics'

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
  themeId: ThemeId

  // Actions
  onCorrect: (xp?: number) => void
  onWrong: () => void
  setStage: (s: Stage) => void
  setDifficulty: (stage: Stage, d: Difficulty) => void
  setTheme: (id: ThemeId) => void
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
      themeId: 'kids' as ThemeId,
      difficulty: {
        interval: 'basic',
        chord: 'basic',
        scale: 'basic',
        note: 'basic',
        piano: 'basic',
      },

      onCorrect: (xp = 12) => {
        const { streak, score, level, currentStage, difficulty } = get()
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
        analytics.answerSubmitted({ module: currentStage, correct: true, difficulty: difficulty[currentStage], streak: streak + 1 })
        if (leveled) analytics.levelUp(level + 1, newXp)
      },

      onWrong: () => {
        const { currentStage, difficulty, streak } = get()
        set({ wrong: get().wrong + 1, streak: 0 })
        analytics.answerSubmitted({ module: currentStage, correct: false, difficulty: difficulty[currentStage], streak })
      },

      setStage: (s) => { set({ currentStage: s }); analytics.stageChanged(s) },

      setTheme: (id) => { set({ themeId: id }); analytics.themeChanged(id) },

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
        themeId: s.themeId,
      }),
    }
  )
)
