export type Schedule =
  | { type: 'daily' }
  | { type: 'weekdays' }
  | { type: 'days'; days: number[] } // 0=Mon, 1=Tue, ..., 6=Sun (Monday-based)
  | { type: 'weekly'; perWeek?: number }

export interface HabitTarget {
  unit: string
  qty: number
}

export interface Habit {
  id: string
  name: string
  icon: string // emoji
  hex: string // habit color e.g. '#4caf63'
  schedule: Schedule
  isFavorite: boolean
  createdAt: string // "YYYY-MM-DD"
  target?: HabitTarget
}

export interface Completion {
  id: string
  habitId: string
  date: string // "YYYY-MM-DD"
  note?: string
  voiceMemoUrl?: string
}

export interface UserProfile {
  name: string
  joinDate: string
  themeMode: 'light' | 'dark'
  accent: string // hex color e.g. '#3b5bdb'
}
