import { useNavigate, useParams } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { useCompletionsStore } from '../../store/completions'
import { useUIStore } from '../../store/ui'
import { scheduleLabel } from '../../lib/schedule'
import { useHabitStreak, useGlobalBestStreak } from '../../hooks/useProgress'
import { Area } from '../../components/charts/Area'
import { ChevLeftIcon, StarFillIcon, StarIcon, TrashIcon } from '../../components/icons'

function BestStreakDisplay() {
  const best = useGlobalBestStreak()
  return <>{best}d</>
}

export default function HabitDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const habit = useHabitsStore((s) => s.habits.find((h) => h.id === id))
  const deleteHabit = useHabitsStore((s) => s.deleteHabit)
  const toggleFavorite = useHabitsStore((s) => s.toggleFavorite)
  const allCompletions = useCompletionsStore((s) => s.completions)
  const completions = allCompletions.filter((c) => c.habitId === id)
  const pushToast = useUIStore((s) => s.pushToast)
  const streak = useHabitStreak(id ?? '')

  if (!habit) {
    return <div className="flex h-full items-center justify-center text-ink-3">Habit not found</div>
  }

  const sorted = [...completions].sort((a, b) => b.date.localeCompare(a.date))

  // Build 12-week sparkline
  const weeks12: Array<{ pct: number }> = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let w = 11; w >= 0; w--) {
    let done = 0
    for (let d = 0; d < 7; d++) {
      const day = new Date(today)
      day.setDate(today.getDate() - w * 7 - d)
      const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
      if (completions.some((c) => c.date === dateStr)) done++
    }
    weeks12.push({ pct: Math.round((done / 7) * 100) })
  }

  // 30-day pct
  const today2 = new Date()
  const ago30 = new Date(today2)
  ago30.setDate(today2.getDate() - 30)
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const recent30 = completions.filter((c) => c.date >= fmt(ago30))
  const pct30 = Math.round((recent30.length / 30) * 100)

  async function handleDelete() {
    const habitId = habit!.id
    const habitName = habit!.name
    await deleteHabit(habitId)
    pushToast(`"${habitName}" deleted`, 'info')
    navigate('/')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-line px-[18px] py-3.5">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center border-none bg-none text-accent"
        >
          <ChevLeftIcon size={20} />
        </button>
        <button
          onClick={() => toggleFavorite(habit.id)}
          className="cursor-pointer border-none bg-none"
          style={{ color: habit.isFavorite ? '#e6a93a' : 'var(--ink-3)' }}
        >
          {habit.isFavorite ? <StarFillIcon size={22} /> : <StarIcon size={22} />}
        </button>
      </div>

      <div className="scrollable flex-1 px-[18px] pt-5 pb-20">
        {/* Habit identity */}
        <div className="mb-5 flex items-center gap-3.5">
          <div
            className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-[18px] border border-line text-[28px]"
            style={{ background: `color-mix(in srgb, ${habit.hex} 18%, var(--surface))` }}
          >
            {habit.icon}
          </div>
          <div>
            <h1 className="mb-1 text-2xl font-extrabold tracking-[-0.02em] text-ink">
              {habit.name}
            </h1>
            <div className="text-[13px] text-ink-3">{scheduleLabel(habit.schedule)}</div>
          </div>
        </div>

        {/* 4 stat chips */}
        <div className="mb-4 grid grid-cols-4 gap-2">
          <div className="rounded-[12px] bg-surface-2 px-2 py-3 text-center">
            <div className="num text-xl text-ink">{streak}d</div>
            <div className="mt-[3px] text-[11px] text-ink-3">Streak</div>
          </div>
          <div className="rounded-[12px] bg-surface-2 px-2 py-3 text-center">
            <div className="num text-xl text-ink">
              <BestStreakDisplay />
            </div>
            <div className="mt-[3px] text-[11px] text-ink-3">Best</div>
          </div>
          <div className="rounded-[12px] bg-surface-2 px-2 py-3 text-center">
            <div className="num text-xl text-ink">{completions.length}</div>
            <div className="mt-[3px] text-[11px] text-ink-3">Total</div>
          </div>
          <div className="rounded-[12px] bg-surface-2 px-2 py-3 text-center">
            <div className="num text-xl text-ink">{pct30}%</div>
            <div className="mt-[3px] text-[11px] text-ink-3">30d</div>
          </div>
        </div>

        {/* 12-week sparkline */}
        <div className="card mb-4 p-4">
          <div className="eyebrow mb-2.5">Last 12 weeks</div>
          <Area data={weeks12} color={habit.hex} height={80} />
        </div>

        {/* History */}
        <div className="card mb-4 p-4">
          <div className="eyebrow mb-3">Completion history</div>
          {sorted.length === 0 && (
            <p className="py-4 text-center text-[13px] text-ink-3">No completions yet</p>
          )}
          <div className="flex max-h-[300px] flex-col gap-2.5 overflow-y-auto">
            {sorted.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <div
                  className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                  style={{ background: habit.hex }}
                />
                <div>
                  <div className="text-xs font-semibold text-ink">{c.date}</div>
                  {c.note && <div className="mt-0.5 text-xs text-ink-3">{c.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border-none py-[13px] text-sm font-bold"
          style={{ background: 'rgba(224,88,88,.1)', color: '#e05858' }}
        >
          <TrashIcon size={16} />
          Delete habit
        </button>
      </div>
    </div>
  )
}
