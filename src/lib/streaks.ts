import { formatDate, todayStr } from './dates'

// Given a set of completion date strings, compute the current streak
// (consecutive days including today, or ending yesterday if none today)
export function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0

  const dateSet = new Set(dates)
  const today = todayStr()
  const yesterday = formatDate(new Date(Date.now() - 86_400_000))

  // Start from today; if no completion today, start from yesterday
  const cursor = dateSet.has(today) ? today : dateSet.has(yesterday) ? yesterday : null
  if (!cursor) return 0

  let streak = 0
  const cursorDate = new Date(cursor + 'T00:00:00')
  while (dateSet.has(formatDate(cursorDate))) {
    streak++
    cursorDate.setDate(cursorDate.getDate() - 1)
  }
  return streak
}
