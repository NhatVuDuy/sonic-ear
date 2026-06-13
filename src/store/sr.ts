/**
 * Spaced Repetition store — SM-2 algorithm.
 *
 * Each "card" corresponds to one concept (a specific interval, chord type,
 * scale type, or note). Keys are namespaced strings:
 *   "iv:7"      → Perfect Fifth (7 semitones)
 *   "ch:major"  → Major chord
 *   "sc:minor"  → Natural Minor scale
 *   "nt:0"      → Note C (semitone index 0)
 *
 * After a correct answer (grade 5) the review interval grows exponentially.
 * After a wrong answer (grade 0) the card resets to interval = 1 day.
 *
 * Modules call srRecord() to update the card and srWeightedPick() to bias
 * question selection toward due / difficult cards.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SRCard {
  ease: number      // ease factor, default 2.5, min 1.3
  interval: number  // days until next review
  reps: number      // consecutive correct answers
  dueAt: number     // Unix ms timestamp for next review
  correct: number   // lifetime correct count
  wrong: number     // lifetime wrong count
}

const DEFAULT_CARD: SRCard = { ease: 2.5, interval: 1, reps: 0, dueAt: 0, correct: 0, wrong: 0 }
const MS_PER_DAY = 86_400_000

interface SRState {
  cards: Record<string, SRCard>
  record: (key: string, isCorrect: boolean) => void
  getCard: (key: string) => SRCard
  getWeight: (key: string) => number
  weakSpots: (prefix: string, limit?: number) => Array<{ key: string; card: SRCard }>
}

export const useSRStore = create<SRState>()(
  persist(
    (set, get) => ({
      cards: {},

      getCard: (key) => get().cards[key] ?? { ...DEFAULT_CARD },

      record: (key, isCorrect) => {
        const card = get().getCard(key)
        let { ease, interval, reps, correct, wrong } = card

        if (isCorrect) {
          correct += 1
          // SM-2 interval schedule
          if (reps === 0)       interval = 1
          else if (reps === 1)  interval = 6
          else                  interval = Math.round(interval * ease)
          ease = Math.min(2.5, ease + 0.1)
          reps += 1
        } else {
          wrong += 1
          reps = 0
          interval = 1
          ease = Math.max(1.3, ease - 0.2)
        }

        const dueAt = Date.now() + interval * MS_PER_DAY
        set(s => ({ cards: { ...s.cards, [key]: { ease, interval, reps, dueAt, correct, wrong } } }))
      },

      // Weight for weighted-random question selection.
      // Due cards get 4× boost; struggling cards (low ease) get extra boost.
      getWeight: (key) => {
        const card = get().cards[key]
        if (!card) return 2.0          // unseen — slight boost to introduce new items
        const due = card.dueAt <= Date.now()
        const easeFactor = Math.max(0.5, (card.ease - 1.3) / (2.5 - 1.3)) // 0→1
        const weight = due ? 4.0 : 1.0
        return weight * (1 + (1 - easeFactor))  // struggling items get up to 2× extra
      },

      // Returns items sorted by "most in need of review" for a given prefix.
      weakSpots: (prefix, limit = 8) => {
        const cards = get().cards
        return Object.entries(cards)
          .filter(([k]) => k.startsWith(prefix))
          .filter(([, c]) => c.correct + c.wrong >= 3)   // enough data
          .map(([key, card]) => {
            const total = card.correct + card.wrong
            return { key, card, acc: card.correct / total, ease: card.ease }
          })
          .sort((a, b) => a.ease - b.ease || a.acc - b.acc)
          .slice(0, limit)
          .map(({ key, card }) => ({ key, card }))
      },
    }),
    { name: 'sonicear-sr-v1' }
  )
)

/** Weighted random pick using SR data. */
export function srWeightedPick<T>(items: T[], keyFn: (item: T) => string): T {
  const weights = items.map(item => useSRStore.getState().getWeight(keyFn(item)))
  const total = weights.reduce((s, w) => s + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}
