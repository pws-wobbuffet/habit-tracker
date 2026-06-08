import { useHabitsStore } from '../store/habits'
import { useCompletionsStore } from '../store/completions'
import { computeStreak } from '../lib/streaks'
import { isScheduledOn } from '../lib/schedule'
import { todayStr } from '../lib/dates'

export function useTodayProgress(): { completed: number; total: number; percent: number } {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)
  const today = todayStr()
  const todayDate = new Date(today + 'T00:00:00')

  const todayHabits = habits.filter((h) => isScheduledOn(h.schedule, todayDate))
  const completed = todayHabits.filter((h) =>
    completions.some((c) => c.habitId === h.id && c.date === today),
  ).length

  return {
    completed,
    total: todayHabits.length,
    percent: todayHabits.length ? Math.round((completed / todayHabits.length) * 100) : 0,
  }
}

export function useHabitStreak(habitId: string): number {
  return useCompletionsStore((s) => {
    const dates = s.completions
      .filter((c) => c.habitId === habitId)
      .map((c) => c.date)
    return computeStreak(dates)
  })
}

export function useOverallStreak(): number {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)
  if (!habits.length) return 0

  // A day counts if at least one habit was completed
  const datesWithCompletions = [...new Set(completions.map((c) => c.date))]
  return computeStreak(datesWithCompletions)
}
