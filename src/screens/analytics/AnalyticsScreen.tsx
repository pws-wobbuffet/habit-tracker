import {
  useTodayProgress,
  useOverallStreak,
  useCompletionSeries,
  usePerHabitConsistency,
  useDayOfWeekStats,
} from '../../hooks/useProgress'
import { useCompletionsStore } from '../../store/completions'
import { Bars } from '../../components/charts/Bars'
import { ConsBar } from '../../components/charts/ConsBar'
import { DOW } from '../../components/charts/DOW'

export default function AnalyticsScreen() {
  const { percent } = useTodayProgress()
  const streak = useOverallStreak()
  const totalCompletions = useCompletionsStore((s) => s.completions.length)
  const totalDays = useCompletionsStore((s) => new Set(s.completions.map((c) => c.date)).size)
  const series30 = useCompletionSeries(30)
  const consistency = usePerHabitConsistency(30)
  const dowStats = useDayOfWeekStats()

  const avg30 = series30.length
    ? Math.round(series30.reduce((s, d) => s + d.pct, 0) / series30.length)
    : 0

  return (
    <div className="scrollable scroll h-full bg-bg px-[18px] pt-2.5 pb-[100px]">
      <h1 className="mt-2.5 mb-4 text-[22px] font-extrabold tracking-[-0.02em] text-ink">
        Analytics
      </h1>

      {/* 2x2 stat cards */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="eyebrow mb-1.5">Today</div>
          <div className="num text-[28px] text-accent">{percent}%</div>
        </div>
        <div className="card p-4">
          <div className="eyebrow mb-1.5">Streak</div>
          <div className="num text-[28px] text-ink">{streak}d</div>
        </div>
        <div className="card p-4">
          <div className="eyebrow mb-1.5">Total</div>
          <div className="num text-[28px] text-ink">{totalCompletions}</div>
        </div>
        <div className="card p-4">
          <div className="eyebrow mb-1.5">Active days</div>
          <div className="num text-[28px] text-ink">{totalDays}</div>
        </div>
      </div>

      {/* 30-day bar chart */}
      <div className="card mb-4 p-4">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="eyebrow">30-day completion</div>
          <span className="num text-[13px] text-ink-2">avg {avg30}%</span>
        </div>
        <Bars data={series30} height={64} />
      </div>

      {/* Per-habit consistency */}
      {consistency.length > 0 && (
        <div className="card mb-4 p-4">
          <div className="eyebrow mb-3.5">Habit consistency (30d)</div>
          <div className="flex flex-col gap-3">
            {consistency.map(({ habit, pct }) => (
              <div key={habit.id} className="flex items-center gap-2.5">
                <span className="w-[22px] shrink-0 text-base">{habit.icon}</span>
                <span className="max-w-[120px] min-w-20 shrink-0 truncate text-[13px] font-semibold text-ink">
                  {habit.name}
                </span>
                <ConsBar pct={pct} color={habit.hex} />
                <span className="num w-8 shrink-0 text-xs text-ink-2">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best day of week */}
      <div className="card p-4">
        <div className="eyebrow mb-3.5">Best day of week</div>
        <DOW data={dowStats} />
      </div>
    </div>
  )
}
