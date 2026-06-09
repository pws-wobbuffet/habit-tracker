import { describe, expect, it } from 'bun:test'
import {
  formatDate,
  parseDate,
  isToday,
  isPast,
  todayStr,
  addDays,
  startOfWeek,
  isSameDay,
  dayLetter,
  getWeekDays,
  formatDisplayDate,
} from './dates'

describe('formatDate', () => {
  it('formats with zero-padded month and day', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('formats a double-digit month and day', () => {
    expect(formatDate(new Date(2026, 11, 25))).toBe('2026-12-25')
  })
})

describe('parseDate', () => {
  it('parses to local midnight', () => {
    const d = parseDate('2026-06-09')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(5)
    expect(d.getDate()).toBe(9)
    expect(d.getHours()).toBe(0)
  })

  it('round-trips with formatDate', () => {
    expect(formatDate(parseDate('2026-03-17'))).toBe('2026-03-17')
  })
})

describe('isToday / isPast', () => {
  it('recognizes today', () => {
    expect(isToday(todayStr())).toBe(true)
  })

  it('treats yesterday as past and not today', () => {
    const yesterday = formatDate(addDays(new Date(), -1))
    expect(isPast(yesterday)).toBe(true)
    expect(isToday(yesterday)).toBe(false)
  })

  it('treats today and the future as not past', () => {
    expect(isPast(todayStr())).toBe(false)
    expect(isPast(formatDate(addDays(new Date(), 1)))).toBe(false)
  })
})

describe('addDays', () => {
  it('adds and subtracts across a month boundary', () => {
    expect(formatDate(addDays(new Date(2026, 5, 30), 1))).toBe('2026-07-01')
    expect(formatDate(addDays(new Date(2026, 6, 1), -1))).toBe('2026-06-30')
  })

  it('does not mutate the input date', () => {
    const d = new Date(2026, 5, 9)
    addDays(d, 5)
    expect(formatDate(d)).toBe('2026-06-09')
  })
})

describe('startOfWeek', () => {
  it('returns the Monday for a mid-week date', () => {
    // 2026-06-10 is a Wednesday
    expect(formatDate(startOfWeek(new Date(2026, 5, 10)))).toBe('2026-06-08')
  })

  it('returns the same day when given a Monday', () => {
    expect(formatDate(startOfWeek(new Date(2026, 5, 8)))).toBe('2026-06-08')
  })

  it('maps Sunday back to the preceding Monday', () => {
    // 2026-06-14 is a Sunday
    expect(formatDate(startOfWeek(new Date(2026, 5, 14)))).toBe('2026-06-08')
  })
})

describe('isSameDay', () => {
  it('ignores the time component', () => {
    expect(isSameDay(new Date(2026, 5, 9, 8), new Date(2026, 5, 9, 23))).toBe(true)
  })

  it('distinguishes different days', () => {
    expect(isSameDay(new Date(2026, 5, 9), new Date(2026, 5, 10))).toBe(false)
  })
})

describe('dayLetter', () => {
  it('maps weekday to its letter', () => {
    expect(dayLetter(new Date(2026, 5, 8))).toBe('M') // Monday
    expect(dayLetter(new Date(2026, 5, 14))).toBe('S') // Sunday
  })
})

describe('getWeekDays', () => {
  it('returns 7 consecutive days starting on Monday', () => {
    const week = getWeekDays()
    expect(week).toHaveLength(7)
    expect(week[0].getDay()).toBe(1) // Monday
    for (let i = 1; i < 7; i++) {
      expect(formatDate(week[i])).toBe(formatDate(addDays(week[i - 1], 1)))
    }
  })
})

describe('formatDisplayDate', () => {
  it('formats as "Weekday, Mon D"', () => {
    expect(formatDisplayDate(new Date(2026, 5, 9))).toBe('Tuesday, Jun 9')
  })
})
