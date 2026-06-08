export type Schedule = 'daily' | 'weekly' | { days: number[] }

export interface Habit {
  id: string
  name: string
  icon: string
  schedule: Schedule
  isFavorite: boolean
  createdAt: string // "YYYY-MM-DD"
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
  joinDate: string // "YYYY-MM-DD"
  themeMode: 'light' | 'dark'
}
