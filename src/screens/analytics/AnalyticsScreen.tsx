import { m } from 'framer-motion'
import { StatusBar } from '../../components/layout/StatusBar'
import { useHabitsStore } from '../../store/habits'
import { useCompletionsStore } from '../../store/completions'
import { useTodayProgress, useOverallStreak } from '../../hooks/useProgress'

const PAGE = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
}

export default function AnalyticsScreen() {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)
  const { percent } = useTodayProgress()
  const streak = useOverallStreak()

  const totalDays = [...new Set(completions.map((c) => c.date))].length

  return (
    <m.div {...PAGE} className="h-full flex flex-col bg-parchment">
      <StatusBar />
      <div className="flex-1 scrollable px-4 pt-4">
        <h1 className="font-display text-2xl font-semibold text-text mb-5">Analytics</h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Today's progress" value={`${percent}%`} icon="📊" />
          <StatCard label="Current streak" value={`${streak}d`} icon="🔥" />
          <StatCard label="Total habits" value={String(habits.length)} icon="📋" />
          <StatCard label="Active days" value={String(totalDays)} icon="📅" />
        </div>

        <div className="bg-surface rounded-2xl p-4 text-center text-sm text-muted">
          <p className="text-2xl mb-2">📈</p>
          <p>Detailed charts coming soon</p>
        </div>
      </div>
    </m.div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-sm">
      <p className="text-xl mb-1">{icon}</p>
      <p className="font-display text-2xl font-semibold text-text">{value}</p>
      <p className="text-xs text-muted mt-0.5">{label}</p>
    </div>
  )
}
