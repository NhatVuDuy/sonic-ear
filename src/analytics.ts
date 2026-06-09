import type { Stage, Difficulty } from '@/store'
import type { ThemeId } from '@/theme'

// Typed wrapper around gtag. All calls are no-ops if GA4 is not loaded
// (dev env, ad-blocker, or measurement ID not yet configured).
function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args)
  }
}

export const analytics = {
  // User picks a module tab
  stageChanged(stage: Stage) {
    gtag('event', 'stage_changed', { stage })
  },

  // User submits an answer
  answerSubmitted(opts: {
    module: Stage
    correct: boolean
    difficulty: Difficulty
    streak: number
  }) {
    gtag('event', 'answer_submitted', {
      module: opts.module,
      result: opts.correct ? 'correct' : 'wrong',
      difficulty: opts.difficulty,
      streak: opts.streak,
    })
  },

  // User levels up
  levelUp(newLevel: number, totalXp: number) {
    gtag('event', 'level_up', { new_level: newLevel, total_xp: totalXp })
  },

  // User switches theme
  themeChanged(themeId: ThemeId) {
    gtag('event', 'theme_changed', { theme_id: themeId })
  },

  // User plays a sound manually (Free Piano)
  notePlayed(noteStr: string) {
    gtag('event', 'note_played', { note: noteStr })
  },

  // PWA install prompt shown / accepted
  pwaInstall(action: 'prompted' | 'accepted' | 'dismissed') {
    gtag('event', 'pwa_install', { action })
  },
}
