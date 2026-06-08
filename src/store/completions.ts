import { create } from 'zustand'
import { backend } from '../storage'
import type { Completion } from '../types'

interface CompletionsState {
  completions: Completion[]
  hydrated: boolean
  hydrate(): Promise<void>
  addCompletion(completion: Completion): Promise<void>
  removeCompletion(id: string): Promise<void>
  isCompleted(habitId: string, date: string): boolean
  getForDate(date: string): Completion[]
  getForHabit(habitId: string): Completion[]
}

export const useCompletionsStore = create<CompletionsState>((set, get) => ({
  completions: [],
  hydrated: false,

  async hydrate() {
    const completions = await backend.getCompletions()
    set({ completions, hydrated: true })
  },

  async addCompletion(completion) {
    await backend.putCompletion(completion)
    set((s) => ({ completions: [...s.completions, completion] }))
  },

  async removeCompletion(id) {
    await backend.deleteCompletion(id)
    set((s) => ({ completions: s.completions.filter((c) => c.id !== id) }))
  },

  isCompleted(habitId, date) {
    return get().completions.some((c) => c.habitId === habitId && c.date === date)
  },

  getForDate(date) {
    return get().completions.filter((c) => c.date === date)
  },

  getForHabit(habitId) {
    return get().completions.filter((c) => c.habitId === habitId)
  },
}))
