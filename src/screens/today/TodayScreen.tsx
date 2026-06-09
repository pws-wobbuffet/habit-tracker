import { useNavigate } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { useCompletionsStore } from '../../store/completions'
import { useProfileStore } from '../../store/profile'
import { useTodayProgress, useOverallStreak, useGlobalBestStreak } from '../../hooks/useProgress'
import { isDueOnDay } from '../../lib/schedule'
import { formatDate, getGreeting, getWeekDays, isToday, todayStr } from '../../lib/dates'
import { Ring } from '../../components/charts/Ring'
import { HabitRow } from './HabitRow'
import { PlusIcon, FlameIcon } from '../../components/icons'

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function TodayScreen() {
  const navigate = useNavigate()
  const profile = useProfileStore((s) => s.profile)
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)
  const { completed, total, percent } = useTodayProgress()
  const streak = useOverallStreak()
  const bestStreak = useGlobalBestStreak()

  const today = todayStr()
  const todayDate = new Date(today + 'T00:00:00')
  const todayHabits = habits.filter((h) => isDueOnDay(h, todayDate))
  const weekDays = getWeekDays()

  const today_full = new Date()
  const dateLabel = today_full.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      className="scrollable"
      style={{
        height: '100%',
        padding: '10px 18px',
        paddingBottom: 'calc(var(--safe-bottom) + 160px)',
        background: 'var(--bg)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div className="eyebrow">{dateLabel}</div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            margin: '4px 0 4px',
            lineHeight: 1.1,
          }}
        >
          {getGreeting()},
          <br />
          {profile.name}.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0 }}>
          Build the life you want.
        </p>
      </div>

      {/* Summary card */}
      <div
        className="card"
        style={{
          padding: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 16,
        }}
      >
        <Ring pct={percent} size={92} stroke={9}>
          <span className="num" style={{ fontSize: 20, color: 'var(--ink)' }}>
            {percent}
          </span>
          <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>%</span>
        </Ring>

        <div
          style={{
            width: 1,
            alignSelf: 'stretch',
            background: 'var(--line)',
            margin: '4px 0',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FlameIcon size={26} style={{ color: '#e6803a' }} />
          <div>
            <div className="num" style={{ fontSize: 34, color: 'var(--ink)', lineHeight: 1 }}>
              {streak}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
              day streak · best {bestStreak}
            </div>
          </div>
        </div>
      </div>

      {/* Week strip */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
        {weekDays.map((d, i) => {
          const dateStr = formatDate(d)
          const isT = isToday(dateStr)
          const isFuture = dateStr > today
          const due = habits.filter((h) => isDueOnDay(h, d)).length
          const done = completions.filter((c) => c.date === dateStr).length
          const full = due > 0 && done >= due
          const partial = due > 0 && done > 0 && done < due

          let bg = 'var(--surface-2)'
          let numColor = 'var(--ink)'
          let letterColor = 'var(--ink-3)'

          if (full) {
            bg = 'var(--accent)'
            numColor = 'var(--on-accent)'
            letterColor = 'var(--on-accent)'
          } else if (partial) {
            bg = 'var(--accent-soft)'
            numColor = 'var(--accent)'
          } else if (isT) {
            bg = 'transparent'
            numColor = 'var(--accent)'
          }

          return (
            <div
              key={dateStr}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '9px 0 10px',
                borderRadius: 13,
                background: bg,
                border: isT ? '2px solid var(--accent)' : '2px solid transparent',
                opacity: isFuture ? 0.4 : 1,
                cursor: isFuture ? 'default' : 'pointer',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, color: letterColor, lineHeight: 1 }}>
                {DAY_LETTERS[i]}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: numColor,
                  marginTop: 4,
                  lineHeight: 1,
                }}
              >
                {d.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Habit list header */}
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Today · {completed}/{total}
      </div>

      {/* Habit rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {todayHabits.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 0',
              color: 'var(--ink-3)',
              fontSize: 14,
            }}
          >
            No habits scheduled for today.
          </div>
        )}
        {todayHabits.map((habit) => (
          <HabitRow key={habit.id} habit={habit} />
        ))}
      </div>


      <button
        onClick={() => navigate('/create')}
        style={{
          position: 'fixed',
          bottom: 'calc(var(--safe-bottom) + 88px)',
          right: 18,
          width: 56,
          height: 56,
          borderRadius: 18,
          background: 'var(--accent)',
          color: 'var(--on-accent)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px color-mix(in srgb, var(--accent) 40%, transparent)',
          zIndex: 40,
        }}
      >
        <PlusIcon size={24} />
      </button>
    </div>
  )
}
