import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

interface UIState {
  toasts: Toast[]
  activeHabitId: string | null
  pushToast(message: string, type?: Toast['type']): void
  dismissToast(id: string): void
  openSheet(habitId: string): void
  closeSheet(): void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  activeHabitId: null,

  pushToast(message, type = 'info') {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    // Auto-dismiss after 2.5s
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
}))
