import type { Completion, Habit, UserProfile } from '../src/types'

export type { Completion, Habit, UserProfile }

export interface CompletionQuery {
  habitId?: string
  date?: string
}
