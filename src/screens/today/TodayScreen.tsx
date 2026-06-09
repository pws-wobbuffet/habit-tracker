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

  const todayFull = new Date()
  const dateLabel = todayFull.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      className="scrollable h-full bg-bg px-[18px] pt-2.5"
      style={{ paddingBottom: 'calc(var(--safe-bottom) + 160px)' }}
    >
      {/* Header */}
      <div className="mb-[18px]">
        <div className="eyebrow">{dateLabel}</div>
        <h1 className="my-1 text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink">
          {getGreeting()},
          <br />
          {profile.name}.
        </h1>
        <p className="m-0 text-sm text-ink-2">Build the life you want.</p>
      </div>

      {/* Summary card */}
      <div className="card mb-4 flex items-center gap-[18px] p-[18px]">
        <Ring pct={percent} size={92} stroke={9}>
          <span className="num text-[20px] text-ink">{percent}</span>
          <span className="text-[10px] text-ink-3">%</span>
        </Ring>

        <div className="my-1 w-px self-stretch bg-line" />

        <div className="flex items-center gap-2">
          <FlameIcon size={26} style={{ color: '#e6803a' }} />
          <div>
            <div className="num text-[34px] leading-none text-ink">{streak}</div>
            <div className="mt-0.5 text-xs text-ink-3">day streak · best {bestStreak}</div>
          </div>
        </div>
      </div>

      {/* Week strip */}
      <div className="mb-[22px] flex gap-1.5">
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
              className="flex-1 rounded-[13px] pt-[9px] pb-2.5 text-center"
              style={{
                background: bg,
                border: isT ? '2px solid var(--accent)' : '2px solid transparent',
                opacity: isFuture ? 0.4 : 1,
                cursor: isFuture ? 'default' : 'pointer',
              }}
            >
              <div
                className="text-[10px] leading-none font-semibold"
                style={{ color: letterColor }}
              >
                {DAY_LETTERS[i]}
              </div>
              <div
                className="mt-1 text-[15px] leading-none font-semibold"
                style={{ color: numColor }}
              >
                {d.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Habit list header */}
      <div className="eyebrow mb-3">
        Today · {completed}/{total}
      </div>

      {/* Habit rows */}
      <div className="flex flex-col gap-2.5">
        {todayHabits.length === 0 && (
          <div className="py-10 text-center text-sm text-ink-3">No habits scheduled for today.</div>
        )}
        {todayHabits.map((habit) => (
          <HabitRow key={habit.id} habit={habit} />
        ))}
      </div>

      <button
        onClick={() => navigate('/create')}
        className="fixed right-[18px] z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-[18px] border-none bg-accent text-on-accent"
        style={{
          bottom: 'calc(var(--safe-bottom) + 88px)',
          boxShadow: '0 4px 16px color-mix(in srgb, var(--accent) 40%, transparent)',
        }}
      >
        <PlusIcon size={24} />
      </button>
    </div>
  )
}
