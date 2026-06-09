import { useNavigate } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { useCompletionsStore } from '../../store/completions'
import {
  useTodayProgress,
  useOverallStreak,
  useGlobalBestStreak,
  useCompletionSeries,
  usePerHabitConsistency,
} from '../../hooks/useProgress'
import { isDueOnDay } from '../../lib/schedule'
import { todayStr } from '../../lib/dates'
import { useToggleCompletion } from '../../hooks/useCompletions'
import { Ring } from '../../components/charts/Ring'
import { Bars } from '../../components/charts/Bars'
import { ConsBar } from '../../components/charts/ConsBar'
import { CheckIcon, FlameIcon, ArrowUpIcon, ArrowDownIcon } from '../../components/icons'

function DRow({ habitId }: { habitId: string }) {
  const habit = useHabitsStore((s) => s.habits.find((h) => h.id === habitId))
  const isCompleted = useCompletionsStore((s) => s.isCompleted(habitId, todayStr()))
  const toggle = useToggleCompletion()

  if (!habit) return null

  return (
    <div
      onClick={() => toggle(habitId)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        cursor: 'pointer',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: `color-mix(in srgb, ${habit.hex} 18%, transparent)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {habit.icon}
      </div>
      <span
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 600,
          color: isCompleted ? 'var(--ink-3)' : 'var(--ink)',
          textDecoration: isCompleted ? 'line-through' : 'none',
        }}
      >
        {habit.name}
      </span>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: `2px solid ${isCompleted ? habit.hex : 'var(--line-strong)'}`,
          background: isCompleted ? habit.hex : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isCompleted && <CheckIcon size={12} style={{ color: '#fff' }} />}
      </div>
    </div>
  )
}

export default function OverviewScreen() {
  const navigate = useNavigate()
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)
  const { completed, total, percent } = useTodayProgress()
  const streak = useOverallStreak()
  const bestStreak = useGlobalBestStreak()
  const series30 = useCompletionSeries(30)
  const consistency = usePerHabitConsistency(30)

  const today = todayStr()
  const todayDate = new Date(today + 'T00:00:00')
  const todayHabits = habits.filter((h) => isDueOnDay(h, todayDate))

  // Week avg vs prev week
  const last7 = series30.slice(-7)
  const prev7 = series30.slice(-14, -7)
  const weekAvg = last7.length
    ? Math.round(last7.reduce((s, d) => s + d.pct, 0) / last7.length)
    : 0
  const prevWeekAvg = prev7.length
    ? Math.round(prev7.reduce((s, d) => s + d.pct, 0) / prev7.length)
    : 0
  const delta = weekAvg - prevWeekAvg

  // Recent notes
  const recentNotes = [...completions]
    .filter((c) => c.note)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  const avg30 =
    series30.length > 0
      ? Math.round(series30.reduce((s, d) => s + d.pct, 0) / series30.length)
      : 0

  return (
    <div
      className="scrollable scroll"
      style={{
        height: '100%',
        padding: '24px 24px 32px',
        background: 'var(--bg)',
      }}
    >
      <h1
        style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          margin: '0 0 20px',
        }}
      >
        Overview
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          gridAutoRows: 'auto',
        }}
      >
        {/* Today ring (span 2 rows) */}
        <div
          className="card"
          style={{
            padding: 20,
            gridRow: 'span 2',
            minHeight: 248,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ring pct={percent} size={150} stroke={13}>
            <span className="num" style={{ fontSize: 30, color: 'var(--ink)' }}>
              {percent}
            </span>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>%</span>
          </Ring>
          <div className="eyebrow" style={{ marginTop: 14 }}>
            Today's progress
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
            {completed} / {total} done
          </div>
        </div>

        {/* Current streak */}
        <div className="card" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Current streak
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FlameIcon size={24} style={{ color: '#e6803a' }} />
            <span className="num" style={{ fontSize: 32, color: 'var(--ink)' }}>
              {streak}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
            personal best {bestStreak} days
          </div>
        </div>

        {/* This week */}
        <div className="card" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            This week
          </div>
          <span className="num" style={{ fontSize: 32, color: 'var(--ink)' }}>
            {weekAvg}%
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 4,
              fontSize: 12,
              color: delta >= 0 ? 'var(--good)' : '#e05858',
            }}
          >
            {delta >= 0 ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
            {Math.abs(delta)}% vs last week
          </div>
        </div>

        {/* Active habits */}
        <div className="card" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Active habits
          </div>
          <span className="num" style={{ fontSize: 32, color: 'var(--ink)' }}>
            {habits.length}
          </span>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
            {completions.length} total completions
          </div>
        </div>

        {/* 30-day bars (span 3 cols) */}
        <div className="card" style={{ padding: 20, gridColumn: 'span 3' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div className="eyebrow">30-day completion</div>
            <span className="num" style={{ fontSize: 14, color: 'var(--ink-2)' }}>
              avg {avg30}%
            </span>
          </div>
          <Bars data={series30} height={88} />
        </div>

        {/* Per-habit consistency (span 2 cols, span 2 rows) */}
        <div className="card" style={{ padding: 20, gridColumn: 'span 2', gridRow: 'span 2' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div className="eyebrow">Habit consistency</div>
            <button
              onClick={() => navigate('/analytics')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                color: 'var(--accent)',
                fontWeight: 600,
              }}
            >
              Details
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {consistency.map(({ habit, pct }) => (
              <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0, width: 24, textAlign: 'center' }}>
                  {habit.icon}
                </span>
                <ConsBar pct={pct} color={habit.hex} />
                <span
                  className="num"
                  style={{ fontSize: 12, color: 'var(--ink-2)', flexShrink: 0, width: 30 }}
                >
                  {pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's checklist (span 2 cols) */}
        <div className="card" style={{ padding: 20, gridColumn: 'span 2' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div className="eyebrow">
              Today · {completed}/{total}
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                color: 'var(--accent)',
                fontWeight: 600,
              }}
            >
              Manage
            </button>
          </div>
          {todayHabits.slice(0, 4).map((h) => (
            <DRow key={h.id} habitId={h.id} />
          ))}
        </div>

        {/* Recent notes (span 2 cols) */}
        <div className="card" style={{ padding: 20, gridColumn: 'span 2' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Recent notes
          </div>
          {recentNotes.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0 }}>No notes yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentNotes.map((c) => {
                const habit = habits.find((h) => h.id === c.habitId)
                return (
                  <div
                    key={c.id}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: habit?.hex ?? 'var(--accent)',
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                        {habit?.name} · {c.date}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 2 }}>
                        {c.note}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
