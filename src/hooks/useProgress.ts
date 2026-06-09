import { useHabitsStore } from '../store/habits'
import { useCompletionsStore } from '../store/completions'
import { computeStreak } from '../lib/streaks'
import { isDueOnDay } from '../lib/schedule'
import { todayStr, formatDate, addDays } from '../lib/dates'
import type { Habit } from '../types'

export function useTodayProgress(): { completed: number; total: number; percent: number } {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)
  const today = todayStr()
  const todayDate = new Date(today + 'T00:00:00')

  const todayHabits = habits.filter((h) => isDueOnDay(h, todayDate))
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
    const dates = s.completions.filter((c) => c.habitId === habitId).map((c) => c.date)
    return computeStreak(dates)
  })
}

export function useOverallStreak(): number {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)
  if (!habits.length) return 0

  const datesWithCompletions = [...new Set(completions.map((c) => c.date))]
  return computeStreak(datesWithCompletions)
}

export function useGlobalBestStreak(): number {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)
  if (!habits.length) return 0

  let best = 0
  for (const habit of habits) {
    const dates = completions.filter((c) => c.habitId === habit.id).map((c) => c.date)
    if (!dates.length) continue
    const sorted = [...new Set(dates)].sort()
    let current = 1
    let max = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1] + 'T00:00:00')
      const curr = new Date(sorted[i] + 'T00:00:00')
      const diff = (curr.getTime() - prev.getTime()) / 86400000
      if (diff === 1) {
        current++
        max = Math.max(max, current)
      } else {
        current = 1
      }
    }
    best = Math.max(best, max)
  }
  return best
}

export function useCompletionSeries(
  days: number,
): Array<{ pct: number; done: number; due: number; date: string }> {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)

  const result: Array<{ pct: number; done: number; due: number; date: string }> = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(today, -i)
    const dateStr = formatDate(d)
    const due = habits.filter((h) => isDueOnDay(h, d)).length
    const done = completions.filter(
      (c) => c.date === dateStr && habits.some((h) => h.id === c.habitId),
    ).length
    result.push({
      date: dateStr,
      due,
      done,
      pct: due > 0 ? Math.round((done / due) * 100) : 0,
    })
  }
  return result
}

export function usePerHabitConsistency(days: number): Array<{ habit: Habit; pct: number }> {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return habits
    .map((habit) => {
      let due = 0
      let done = 0
      for (let i = 0; i < days; i++) {
        const d = addDays(today, -i)
        if (isDueOnDay(habit, d)) {
          due++
          const dateStr = formatDate(d)
          if (completions.some((c) => c.habitId === habit.id && c.date === dateStr)) {
            done++
          }
        }
      }
      return { habit, pct: due > 0 ? Math.round((done / due) * 100) : 0 }
    })
    .sort((a, b) => b.pct - a.pct)
}

export function useDayOfWeekStats(): Array<{ label: string; pct: number }> {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const totals = new Array(7).fill(0)
  const dones = new Array(7).fill(0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 90; i++) {
    const d = addDays(today, -i)
    const wd = (d.getDay() + 6) % 7 // Monday-based
    const dateStr = formatDate(d)
    const due = habits.filter((h) => isDueOnDay(h, d)).length
    if (due === 0) continue
    totals[wd] += due
    dones[wd] += completions.filter(
      (c) => c.date === dateStr && habits.some((h) => h.id === c.habitId),
    ).length
  }

  return labels.map((label, i) => ({
    label,
    pct: totals[i] > 0 ? Math.round((dones[i] / totals[i]) * 100) : 0,
  }))
}

export function useYearHeatmap(): Array<{
  date: string
  d: Date
  pct: number
  done: number
  due: number
  future?: boolean
}> {
  const habits = useHabitsStore((s) => s.habits)
  const completions = useCompletionsStore((s) => s.completions)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const year = today.getFullYear()
  const result = []

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day)
      const dateStr = formatDate(d)
      const future = d > today

      if (future) {
        result.push({ date: dateStr, d, pct: 0, done: 0, due: 0, future: true })
        continue
      }

      const due = habits.filter((h) => isDueOnDay(h, d)).length
      const done = completions.filter(
        (c) => c.date === dateStr && habits.some((h) => h.id === c.habitId),
      ).length

      result.push({
        date: dateStr,
        d,
        pct: due > 0 ? Math.round((done / due) * 100) : 0,
        done,
        due,
      })
    }
  }
  return result
}
