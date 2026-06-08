import { create } from 'zustand'
import { backend } from '../storage'
import type { Habit } from '../types'

interface HabitsState {
  habits: Habit[]
  hydrated: boolean
  hydrate(): Promise<void>
  addHabit(habit: Habit): Promise<void>
  updateHabit(habit: Habit): Promise<void>
  deleteHabit(id: string): Promise<void>
  toggleFavorite(id: string): Promise<void>
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  hydrated: false,

  async hydrate() {
    const habits = await backend.getHabits()
    set({ habits, hydrated: true })
  },

  async addHabit(habit) {
    await backend.putHabit(habit)
    set((s) => ({ habits: [...s.habits, habit] }))
  },

  async updateHabit(habit) {
    await backend.putHabit(habit)
    set((s) => ({ habits: s.habits.map((h) => (h.id === habit.id ? habit : h)) }))
  },

  async deleteHabit(id) {
    await backend.deleteHabit(id)
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }))
  },

  async toggleFavorite(id) {
    const habit = get().habits.find((h) => h.id === id)
    if (!habit) return
    const updated = { ...habit, isFavorite: !habit.isFavorite }
    await backend.putHabit(updated)
    set((s) => ({ habits: s.habits.map((h) => (h.id === id ? updated : h)) }))
  },
}))
