import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SRCard {
  ease: number      // 1.3–2.5 (SM-2 easiness factor)
  interval: number  // days until next review
  reps: number      // consecutive correct answers
  dueAt: number     // timestamp (ms) of next due date
  correct: number   // lifetime correct count
  wrong: number     // lifetime wrong count
}

interface SRState {
  cards: Record<string, SRCard>
  record: (key: string, isCorrect: boolean) => void
  getCard: (key: string) => SRCard | undefined
  weakSpots: (prefix: string, limit?: number) => Array<{ key: string; card: SRCard }>
}

function sm2Update(card: SRCard, isCorrect: boolean): SRCard {
  const q = isCorrect ? 5 : 1  // quality: 5 = perfect, 1 = complete failure
  const newEase = Math.min(2.5, Math.max(1.3, card.ease + 0.1 - (5 - q) * 0.08))
  const newReps = isCorrect ? card.reps + 1 : 0
  let newInterval: number
  if (!isCorrect) {
    newInterval = 0.02  // ~30 min in fractional days
  } else if (newReps === 1) {
    newInterval = 0.5   // 12 hours
  } else if (newReps === 2) {
    newInterval = 1
  } else {
    newInterval = Math.round(card.interval * newEase)
  }
  return {
    ease: newEase,
    interval: newInterval,
    reps: newReps,
    dueAt: Date.now() + newInterval * 86_400_000,
    correct: card.correct + (isCorrect ? 1 : 0),
    wrong: card.wrong + (isCorrect ? 0 : 1),
  }
}

function newCard(): SRCard {
  return { ease: 2.0, interval: 0, reps: 0, dueAt: 0, correct: 0, wrong: 0 }
}

export const useSRStore = create<SRState>()(
  persist(
    (set, get) => ({
      cards: {},

      record: (key, isCorrect) => {
        const card = get().cards[key] ?? newCard()
        set({ cards: { ...get().cards, [key]: sm2Update(card, isCorrect) } })
      },

      getCard: (key) => get().cards[key],

      weakSpots: (prefix, limit = 8) => {
        const all = Object.entries(get().cards)
          .filter(([k, c]) => k.startsWith(prefix) && c.correct + c.wrong >= 3)
          .sort(([, a], [, b]) => a.ease - b.ease)
          .slice(0, limit)
        return all.map(([key, card]) => ({ key, card }))
      },
    }),
    { name: 'sonicear-sr-v1' }
  )
)

export function srWeightedPick<T>(items: T[], keyFn: (item: T) => string): T {
  const { cards } = useSRStore.getState()
  const now = Date.now()

  const weights = items.map(item => {
    const key = keyFn(item)
    const card = cards[key]
    if (!card) return 2.0  // unseen — slightly preferred
    let w = 1.0
    if (card.dueAt <= now) w *= 4.0  // overdue — strongly preferred
    const accuracy = card.correct + card.wrong > 0 ? card.correct / (card.correct + card.wrong) : 0.5
    if (accuracy < 0.6) w *= 1.0 + (0.6 - accuracy) * 3  // struggling — extra weight
    return w
  })

  const total = weights.reduce((s, w) => s + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}
