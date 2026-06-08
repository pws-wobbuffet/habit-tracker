import { useHabitsStore } from '../store/habits'
import { isScheduledOn } from '../lib/schedule'
import { todayStr } from '../lib/dates'
import type { Habit } from '../types'

// All habits scheduled for today, favorites first then alphabetical
export function useTodayHabits(): Habit[] {
  const habits = useHabitsStore((s) => s.habits)
  const today = todayStr()
  const todayDate = new Date(today + 'T00:00:00')

  return habits
    .filter((h) => isScheduledOn(h.schedule, todayDate))
    .sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}
