import type { Schedule } from '../types'
import { parseDate } from './dates'

export function isScheduledOn(schedule: Schedule, d: Date): boolean {
  const wd = (d.getDay() + 6) % 7 // Monday-based: 0=Mon, 6=Sun
  if (schedule.type === 'daily') return true
  if (schedule.type === 'weekdays') return wd <= 4
  if (schedule.type === 'days') return schedule.days.includes(wd)
  if (schedule.type === 'weekly') return true
  return true
}

export function isDueOnDay(habit: { createdAt: string; schedule: Schedule }, d: Date): boolean {
  if (parseDate(habit.createdAt) > d) return false
  return isScheduledOn(habit.schedule, d)
}

export function scheduleLabel(s: Schedule): string {
  if (s.type === 'daily') return 'Every day'
  if (s.type === 'weekdays') return 'Weekdays'
  if (s.type === 'weekly') return `${s.perWeek ?? 3}x / week`
  if (s.type === 'days') {
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    if (s.days.length === 7) return 'Every day'
    return s.days.map((i) => names[i]).join(' · ')
  }
  return ''
}
