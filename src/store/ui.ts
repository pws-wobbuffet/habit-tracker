import { generateId } from '../lib/uuid'
import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

interface UIState {
  toasts: Toast[]
  activeHabitId: string | null
  theme: 'auto' | 'light' | 'dark'
  accent: string
  pushToast(message: string, type?: Toast['type']): void
  dismissToast(id: string): void
  openSheet(habitId: string): void
  closeSheet(): void
  setTheme(t: 'auto' | 'light' | 'dark'): void
  setAccent(hex: string): void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  activeHabitId: null,
  theme: (localStorage.getItem('habitus-theme') as 'auto' | 'light' | 'dark') ?? 'auto',
  accent: localStorage.getItem('habitus-accent') ?? '#3b5bdb',

  pushToast(message, type = 'info') {
    const id = generateId()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 2500)
  },

  dismissToast(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },

  openSheet(habitId) {
    set({ activeHabitId: habitId })
  },

  closeSheet() {
    set({ activeHabitId: null })
  },

  setTheme(t) {
    if (t === 'auto') localStorage.removeItem('habitus-theme')
    else localStorage.setItem('habitus-theme', t)
    set({ theme: t })
  },

  setAccent(hex) {
    localStorage.setItem('habitus-accent', hex)
    set({ accent: hex })
  },
}))
