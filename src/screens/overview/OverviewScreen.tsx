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
      className="flex cursor-pointer items-center gap-2.5 border-b border-line py-2"
    >
      <div
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] text-base"
        style={{ background: `color-mix(in srgb, ${habit.hex} 18%, transparent)` }}
      >
        {habit.icon}
      </div>
      <span
        className={`flex-1 text-sm font-semibold ${isCompleted ? 'text-ink-3 line-through' : 'text-ink'}`}
      >
        {habit.name}
      </span>
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{
          border: `2px solid ${isCompleted ? habit.hex : 'var(--line-strong)'}`,
          background: isCompleted ? habit.hex : 'transparent',
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
  const weekAvg = last7.length ? Math.round(last7.reduce((s, d) => s + d.pct, 0) / last7.length) : 0
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
    series30.length > 0 ? Math.round(series30.reduce((s, d) => s + d.pct, 0) / series30.length) : 0

  return (
    <div className="scrollable scroll h-full bg-bg px-6 pt-6 pb-8">
      <h1 className="mb-5 text-[22px] font-extrabold tracking-[-0.02em] text-ink">Overview</h1>

      <div className="grid grid-cols-4 gap-4">
        {/* Today ring (span 2 rows) */}
        <div className="card row-span-2 flex min-h-[248px] flex-col items-center justify-center p-5">
          <Ring pct={percent} size={150} stroke={13}>
            <span className="num text-[30px] text-ink">{percent}</span>
            <span className="text-xs text-ink-3">%</span>
          </Ring>
          <div className="eyebrow mt-3.5">Today's progress</div>
          <div className="mt-1 text-[13px] text-ink-3">
            {completed} / {total} done
          </div>
        </div>

        {/* Current streak */}
        <div className="card p-5">
          <div className="eyebrow mb-2">Current streak</div>
          <div className="flex items-center gap-2">
            <FlameIcon size={24} style={{ color: '#e6803a' }} />
            <span className="num text-[32px] text-ink">{streak}</span>
          </div>
          <div className="mt-1 text-xs text-ink-3">personal best {bestStreak} days</div>
        </div>

        {/* This week */}
        <div className="card p-5">
          <div className="eyebrow mb-2">This week</div>
          <span className="num text-[32px] text-ink">{weekAvg}%</span>
          <div
            className="mt-1 flex items-center gap-1 text-xs"
            style={{ color: delta >= 0 ? 'var(--good)' : '#e05858' }}
          >
            {delta >= 0 ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
            {Math.abs(delta)}% vs last week
          </div>
        </div>

        {/* Active habits */}
        <div className="card p-5">
          <div className="eyebrow mb-2">Active habits</div>
          <span className="num text-[32px] text-ink">{habits.length}</span>
          <div className="mt-1 text-xs text-ink-3">{completions.length} total completions</div>
        </div>

        {/* 30-day bars (span 3 cols) */}
        <div className="card col-span-3 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="eyebrow">30-day completion</div>
            <span className="num text-sm text-ink-2">avg {avg30}%</span>
          </div>
          <Bars data={series30} height={88} />
        </div>

        {/* Per-habit consistency (span 2 cols, span 2 rows) */}
        <div className="card col-span-2 row-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="eyebrow">Habit consistency</div>
            <button
              onClick={() => navigate('/analytics')}
              className="cursor-pointer border-none bg-none text-xs font-semibold text-accent"
            >
              Details
            </button>
          </div>
          <div className="flex flex-col gap-3.5">
            {consistency.map(({ habit, pct }) => (
              <div key={habit.id} className="flex items-center gap-2.5">
                <span className="w-6 shrink-0 text-center text-base">{habit.icon}</span>
                <ConsBar pct={pct} color={habit.hex} />
                <span className="num w-[30px] shrink-0 text-xs text-ink-2">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's checklist (span 2 cols) */}
        <div className="card col-span-2 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="eyebrow">
              Today · {completed}/{total}
            </div>
            <button
              onClick={() => navigate('/')}
              className="cursor-pointer border-none bg-none text-xs font-semibold text-accent"
            >
              Manage
            </button>
          </div>
          {todayHabits.slice(0, 4).map((h) => (
            <DRow key={h.id} habitId={h.id} />
          ))}
        </div>

        {/* Recent notes (span 2 cols) */}
        <div className="card col-span-2 p-5">
          <div className="eyebrow mb-3">Recent notes</div>
          {recentNotes.length === 0 ? (
            <p className="m-0 text-[13px] text-ink-3">No notes yet</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentNotes.map((c) => {
                const habit = habits.find((h) => h.id === c.habitId)
                return (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <div
                      className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                      style={{ background: habit?.hex ?? 'var(--accent)' }}
                    />
                    <div>
                      <div className="text-[11px] text-ink-3">
                        {habit?.name} · {c.date}
                      </div>
                      <div className="mt-0.5 text-[13px] text-ink">{c.note}</div>
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
