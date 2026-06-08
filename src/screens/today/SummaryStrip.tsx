import { ProgressRing } from './ProgressRing'
import { StreakBadge } from './StreakBadge'
import { useTodayProgress, useOverallStreak } from '../../hooks/useProgress'

export function SummaryStrip() {
  const { completed, total, percent } = useTodayProgress()
  const streak = useOverallStreak()

  return (
    <div
      className="mx-4 mb-4 rounded-2xl flex items-center justify-around px-6 py-4"
      style={{ backgroundColor: '#1a1410' }}
    >
      <ProgressRing percent={percent} completed={completed} total={total} />
      <div className="w-px h-12 bg-white/10" />
      <StreakBadge streak={streak} />
    </div>
  )
}
