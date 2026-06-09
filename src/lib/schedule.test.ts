import { describe, expect, it } from 'bun:test'
import { isScheduledOn, isDueOnDay, scheduleLabel } from './schedule'

// Reference dates (June 2026): 8th = Monday, 13th = Saturday, 14th = Sunday
const MON = new Date(2026, 5, 8)
const SAT = new Date(2026, 5, 13)
const SUN = new Date(2026, 5, 14)

describe('isScheduledOn', () => {
  it('daily is scheduled every day', () => {
    expect(isScheduledOn({ type: 'daily' }, MON)).toBe(true)
    expect(isScheduledOn({ type: 'daily' }, SUN)).toBe(true)
  })

  it('weekdays excludes the weekend', () => {
    expect(isScheduledOn({ type: 'weekdays' }, MON)).toBe(true)
    expect(isScheduledOn({ type: 'weekdays' }, SAT)).toBe(false)
    expect(isScheduledOn({ type: 'weekdays' }, SUN)).toBe(false)
  })

  it('days matches Monday-based indices', () => {
    // 0 = Monday, 6 = Sunday
    expect(isScheduledOn({ type: 'days', days: [0, 6] }, MON)).toBe(true)
    expect(isScheduledOn({ type: 'days', days: [0, 6] }, SUN)).toBe(true)
    expect(isScheduledOn({ type: 'days', days: [0, 6] }, SAT)).toBe(false)
  })

  it('weekly is scheduled every day (frequency handled elsewhere)', () => {
    expect(isScheduledOn({ type: 'weekly', perWeek: 3 }, SAT)).toBe(true)
  })
})

describe('isDueOnDay', () => {
  it('is not due before the habit was created', () => {
    const habit = { createdAt: '2026-06-10', schedule: { type: 'daily' as const } }
    expect(isDueOnDay(habit, MON)).toBe(false)
  })

  it('is due on the creation day itself', () => {
    const habit = { createdAt: '2026-06-08', schedule: { type: 'daily' as const } }
    expect(isDueOnDay(habit, MON)).toBe(true)
  })

  it('combines creation date with schedule', () => {
    const habit = { createdAt: '2026-06-01', schedule: { type: 'weekdays' as const } }
    expect(isDueOnDay(habit, MON)).toBe(true)
    expect(isDueOnDay(habit, SAT)).toBe(false)
  })
})

describe('scheduleLabel', () => {
  it('labels each schedule type', () => {
    expect(scheduleLabel({ type: 'daily' })).toBe('Every day')
    expect(scheduleLabel({ type: 'weekdays' })).toBe('Weekdays')
    expect(scheduleLabel({ type: 'weekly', perWeek: 4 })).toBe('4x / week')
    expect(scheduleLabel({ type: 'weekly' })).toBe('3x / week')
  })

  it('joins specific days and collapses a full week to "Every day"', () => {
    expect(scheduleLabel({ type: 'days', days: [0, 2, 4] })).toBe('Mon · Wed · Fri')
    expect(scheduleLabel({ type: 'days', days: [0, 1, 2, 3, 4, 5, 6] })).toBe('Every day')
  })
})
