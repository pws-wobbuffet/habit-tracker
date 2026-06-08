import type { Completion, Habit } from '../types'
import { formatDate, todayStr } from './dates'

const SEED_HABITS: Habit[] = [
  {
    id: 'seed-1',
    name: 'Morning Meditation',
    icon: '🧘',
    schedule: 'daily',
    isFavorite: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'seed-2',
    name: 'Read 20 Minutes',
    icon: '📚',
    schedule: 'daily',
    isFavorite: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'seed-3',
    name: 'Exercise',
    icon: '🏃',
    schedule: { days: [1, 3, 5] }, // Mon, Wed, Fri
    isFavorite: false,
    createdAt: '2026-01-01',
  },
  {
    id: 'seed-4',
    name: 'Drink Water',
    icon: '💧',
    schedule: 'daily',
    isFavorite: false,
    createdAt: '2026-01-01',
  },
]

function pastDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return formatDate(d)
  })
}

function seedCompletions(): Completion[] {
  const completions: Completion[] = []
  const days = pastDays(14)
  let i = 0
  for (const habit of SEED_HABITS) {
    for (const date of days) {
      if (Math.random() > 0.3) {
        completions.push({ id: `seed-c-${i++}`, habitId: habit.id, date })
      }
    }
  }
  // Always complete seed-1 and seed-2 today
  completions.push({ id: 'seed-c-today-1', habitId: 'seed-1', date: todayStr() })
  completions.push({ id: 'seed-c-today-2', habitId: 'seed-2', date: todayStr() })
  return completions
}

export const SEEDS = import.meta.env.DEV
  ? { habits: SEED_HABITS, completions: seedCompletions() }
  : null
