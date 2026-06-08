import { useCompletionsStore } from '../store/completions'
import { useUIStore } from '../store/ui'
import { todayStr } from '../lib/dates'
import type { Completion } from '../types'

export function useToggleCompletion() {
  const completions = useCompletionsStore((s) => s.completions)
  const addCompletion = useCompletionsStore((s) => s.addCompletion)
  const removeCompletion = useCompletionsStore((s) => s.removeCompletion)
  const isCompleted = useCompletionsStore((s) => s.isCompleted)
  const pushToast = useUIStore((s) => s.pushToast)

  return async (habitId: string, date: string = todayStr()) => {
    if (isCompleted(habitId, date)) {
      const existing = completions.find((c) => c.habitId === habitId && c.date === date)
      if (existing) {
        await removeCompletion(existing.id)
        pushToast('Habit unmarked', 'info')
      }
    } else {
      const completion: Completion = {
        id: crypto.randomUUID(),
        habitId,
        date,
      }
      await addCompletion(completion)
      pushToast('Habit completed!', 'success')
    }
  }
}
