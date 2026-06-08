import type { Completion, Habit, UserProfile } from '../types'

export interface CompletionFilter {
  habitId?: string
  date?: string
}

export interface StorageBackend {
  getHabits(): Promise<Habit[]>
  putHabit(habit: Habit): Promise<void>
  deleteHabit(id: string): Promise<void>
  getCompletions(filter?: CompletionFilter): Promise<Completion[]>
  putCompletion(completion: Completion): Promise<void>
  deleteCompletion(id: string): Promise<void>
  getProfile(): Promise<UserProfile | null>
  putProfile(profile: UserProfile): Promise<void>
}
