import { useOverallStreak, useGlobalBestStreak } from '../../hooks/useProgress'
import { useCompletionsStore } from '../../store/completions'

interface Achievement {
  id: string
  icon: string
  name: string
  description: string
  target: number
  progress(streak: number, totalCompletions: number, maxDayHabits: number, bestStreak: number): number
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
    <div
      className="scrollable scroll"
      style={{
        height: '100%',
        padding: '10px 18px 100px',
        background: 'var(--bg)',
      }}
    >
      <h1
        style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          margin: '10px 0 16px',
        }}
      >
        Achievements
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ACHIEVEMENTS.map((a) => {
          const prog = a.progress(streak, totalCompletions, maxDayHabits, bestStreak)
          const unlocked = prog >= a.target
          const pct = Math.round((prog / a.target) * 100)

          return (
            <div
              key={a.id}
              className="card"
              style={{
                padding: 16,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                opacity: unlocked ? 1 : 0.92,
                background: unlocked ? 'var(--accent-soft)' : 'var(--surface)',
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  flexShrink: 0,
                  filter: unlocked ? 'none' : 'grayscale(1) opacity(.5)',
                }}
              >
                {a.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                    {a.name}
                  </span>
                  {unlocked && (
                    <span
                      className="eyebrow"
                      style={{
                        background: 'var(--accent)',
                        color: 'var(--on-accent)',
                        padding: '2px 7px',
                        borderRadius: 20,
                        fontSize: 9,
                      }}
                    >
                      UNLOCKED
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>
                  {a.description}
                </div>
                {!unlocked && (
                  <>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 4,
                        background: 'var(--surface-2)',
                        overflow: 'hidden',
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: 'var(--ink-3)',
                          borderRadius: 4,
                          transition: 'width .8s',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
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
