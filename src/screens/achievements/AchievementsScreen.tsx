import { m } from 'framer-motion'
import { StatusBar } from '../../components/layout/StatusBar'
import { useOverallStreak } from '../../hooks/useProgress'
import { useCompletionsStore } from '../../store/completions'

const PAGE = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
}

interface Achievement {
  id: string
  icon: string
  name: string
  description: string
  check(streak: number, totalCompletions: number): boolean
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', icon: '🌱', name: 'First Step', description: 'Complete your first habit', check: (_, t) => t >= 1 },
  { id: 'week', icon: '🔥', name: 'Week Warrior', description: '7-day streak', check: (s) => s >= 7 },
  { id: 'month', icon: '💪', name: 'Iron Will', description: '30-day streak', check: (s) => s >= 30 },
  { id: '10habits', icon: '🎯', name: 'Dedicated', description: 'Complete 10 habits in a day', check: (_, t) => t >= 10 },
  { id: 'century', icon: '💯', name: 'Centurion', description: '100 total completions', check: (_, t) => t >= 100 },
]

export default function AchievementsScreen() {
  const streak = useOverallStreak()
  const totalCompletions = useCompletionsStore((s) => s.completions.length)

  return (
    <m.div {...PAGE} className="h-full flex flex-col bg-parchment">
      <StatusBar />
      <div className="flex-1 scrollable px-4 pt-4">
        <h1 className="font-display text-2xl font-semibold text-text mb-5">Achievements</h1>
        <div className="space-y-3">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = a.check(streak, totalCompletions)
            return (
              <div
                key={a.id}
                className={`flex items-center gap-4 p-4 rounded-2xl ${
                  unlocked ? 'bg-accent/10 border border-accent/20' : 'bg-surface opacity-50'
                }`}
              >
                <span className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>{a.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-text">{a.name}</p>
                  <p className="text-xs text-muted">{a.description}</p>
                </div>
                {unlocked && <span className="ml-auto text-green text-lg">✓</span>}
              </div>
            )
          })}
        </div>
      </div>
    </m.div>
  )
}
