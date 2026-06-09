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
        Analytics
      </h1>

      {/* 2x2 stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Today
          </div>
          <div className="num" style={{ fontSize: 28, color: 'var(--accent)' }}>
            {percent}%
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Streak
          </div>
          <div className="num" style={{ fontSize: 28, color: 'var(--ink)' }}>
            {streak}d
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Total
          </div>
          <div className="num" style={{ fontSize: 28, color: 'var(--ink)' }}>
            {totalCompletions}
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Active days
          </div>
          <div className="num" style={{ fontSize: 28, color: 'var(--ink)' }}>
            {totalDays}
          </div>
        </div>
      </div>

      {/* 30-day bar chart */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <div className="eyebrow">30-day completion</div>
          <span className="num" style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            avg {avg30}%
          </span>
        </div>
        <Bars data={series30} height={64} />
      </div>

      {/* Per-habit consistency */}
      {consistency.length > 0 && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Habit consistency (30d)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {consistency.map(({ habit, pct }) => (
              <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0, width: 22 }}>{habit.icon}</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    flexShrink: 0,
                    minWidth: 80,
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {habit.name}
                </span>
                <ConsBar pct={pct} color={habit.hex} />
                <span
                  className="num"
                  style={{ fontSize: 12, color: 'var(--ink-2)', flexShrink: 0, width: 32 }}
                >
                  {pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best day of week */}
      <div className="card" style={{ padding: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          Best day of week
        </div>
        <DOW data={dowStats} />
      </div>
    </div>
  )
}
