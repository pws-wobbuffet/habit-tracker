import type { Schedule } from '../types'

// Is a habit with this schedule due on the given date?
export function isScheduledOn(schedule: Schedule, date: Date): boolean {
  if (schedule === 'daily') return true
  if (schedule === 'weekly') return date.getDay() === 1 // Monday
  return schedule.days.includes(date.getDay())
}
