import { generateId } from '../../lib/uuid'
import { getWeekDays } from '../../lib/dates'
import { DayCell } from './DayCell'
import { useHabitsStore } from '../../store/habits'
import { useCompletionsStore } from '../../store/completions'
import { useUIStore } from '../../store/ui'

export function WeekStrip() {
  const days = getWeekDays()
  const habits = useHabitsStore((s) => s.habits)
  const addCompletion = useCompletionsStore((s) => s.addCompletion)
  const removeCompletion = useCompletionsStore((s) => s.removeCompletion)
  const completions = useCompletionsStore((s) => s.completions)
  const pushToast = useUIStore((s) => s.pushToast)

  async function handleDayTap(dateStr: string) {
    // Toggle completions for all habits on that day
    const dayCompletions = completions.filter((c) => c.date === dateStr)
    if (dayCompletions.length > 0) {
      await Promise.all(dayCompletions.map((c) => removeCompletion(c.id)))
      pushToast('Day cleared', 'info')
    } else {
      await Promise.all(
        habits.map((h) => addCompletion({ id: generateId(), habitId: h.id, date: dateStr })),
      )
      pushToast('All habits marked!', 'success')
    }
  }

  return (
    <div className="px-4 mb-4">
      <div className="flex justify-between">
        {days.map((d) => (
          <DayCell key={d.toISOString()} date={d} onTap={handleDayTap} />
        ))}
      </div>
    </div>
  )
}
