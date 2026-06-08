import { describe, expect, it } from 'bun:test'
import { computeStreak } from './streaks'
import { formatDate } from './dates'

function daysAgo(n: number): string {
  return formatDate(new Date(Date.now() - n * 86_400_000))
}

describe('computeStreak', () => {
  it('returns 0 for empty dates', () => {
    expect(computeStreak([])).toBe(0)
  })

  it('returns 0 when last completion was 2+ days ago', () => {
    expect(computeStreak([daysAgo(2), daysAgo(3)])).toBe(0)
  })

  it('counts streak starting from today', () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(2)]
    expect(computeStreak(dates)).toBe(3)
  })

  it('counts streak starting from yesterday when no completion today', () => {
    const dates = [daysAgo(1), daysAgo(2), daysAgo(3)]
    expect(computeStreak(dates)).toBe(3)
  })

  it('stops streak at first gap', () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(3)]
    expect(computeStreak(dates)).toBe(2)
  })

  it('handles a single completion today', () => {
    expect(computeStreak([daysAgo(0)])).toBe(1)
  })
})
