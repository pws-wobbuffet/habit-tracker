import { useOverallStreak, useGlobalBestStreak } from '../../hooks/useProgress'
import { useCompletionsStore } from '../../store/completions'

interface Achievement {
  id: string
  icon: string
  name: string
  description: string
  target: number
  progress(
    streak: number,
    totalCompletions: number,
    maxDayHabits: number,
    bestStreak: number,
  ): number
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first',
    icon: '🌱',
    name: 'First Step',
    description: 'Complete your first habit',
    target: 1,
    progress: (_, t) => Math.min(t, 1),
  },
  {
    id: 'week',
    icon: '🔥',
    name: 'Week Warrior',
    description: '7-day streak on a single habit',
    target: 7,
    progress: (_, _t, _m, best) => Math.min(best, 7),
  },
  {
    id: 'month',
    icon: '💪',
    name: 'Iron Will',
    description: '30-day streak on a single habit',
    target: 30,
    progress: (_, _t, _m, best) => Math.min(best, 30),
  },
  {
    id: '10habits',
    icon: '🎯',
    name: 'Dedicated',
    description: 'Complete 10 habits in a single day',
    target: 10,
    progress: (_, _t, max) => Math.min(max, 10),
  },
  {
    id: 'century',
    icon: '💯',
    name: 'Centurion',
    description: '100 total completions',
    target: 100,
    progress: (_, t) => Math.min(t, 100),
  },
]

export default function AchievementsScreen() {
  const streak = useOverallStreak()
  const bestStreak = useGlobalBestStreak()
  const completions = useCompletionsStore((s) => s.completions)
  const totalCompletions = completions.length

  const countsByDate = completions.reduce<Record<string, number>>((acc, c) => {
    acc[c.date] = (acc[c.date] ?? 0) + 1
    return acc
  }, {})
  const maxDayHabits = Math.max(0, ...Object.values(countsByDate))

  return (
    <div className="scrollable scroll h-full bg-bg px-[18px] pt-2.5 pb-[100px]">
      <h1 className="mt-2.5 mb-4 text-[22px] font-extrabold tracking-[-0.02em] text-ink">
        Achievements
      </h1>
      <div className="flex flex-col gap-3">
        {ACHIEVEMENTS.map((a) => {
          const prog = a.progress(streak, totalCompletions, maxDayHabits, bestStreak)
          const unlocked = prog >= a.target
          const pct = Math.round((prog / a.target) * 100)

          return (
            <div
              key={a.id}
              className="card flex items-start gap-3.5 p-4"
              style={{
                opacity: unlocked ? 1 : 0.92,
                background: unlocked ? 'var(--accent-soft)' : 'var(--surface)',
              }}
            >
              <span
                className="shrink-0 text-[32px]"
                style={{ filter: unlocked ? 'none' : 'grayscale(1) opacity(.5)' }}
              >
                {a.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[15px] font-bold text-ink">{a.name}</span>
                  {unlocked && (
                    <span className="eyebrow rounded-[20px] bg-accent px-[7px] py-0.5 text-[9px] text-on-accent">
                      UNLOCKED
                    </span>
                  )}
                </div>
                <div className="mb-2 text-xs text-ink-3">{a.description}</div>
                {!unlocked && (
                  <>
                    <div className="mb-1 h-1.5 overflow-hidden rounded bg-surface-2">
                      <div
                        className="h-full rounded bg-ink-3"
                        style={{ width: `${pct}%`, transition: 'width .8s' }}
                      />
                    </div>
                    <div className="text-[11px] text-ink-3">
                      {prog} / {a.target}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
