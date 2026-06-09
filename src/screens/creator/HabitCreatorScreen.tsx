import { generateId } from '../../lib/uuid'
import { useNavigate } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { useUIStore } from '../../store/ui'
import { HabitForm } from '../../components/ui/HabitForm'
import { ChevLeftIcon } from '../../components/icons'
import { todayStr } from '../../lib/dates'
import type { Habit } from '../../types'

export default function HabitCreatorScreen() {
  const navigate = useNavigate()
  const addHabit = useHabitsStore((s) => s.addHabit)
  const pushToast = useUIStore((s) => s.pushToast)

  async function handleCreate(data: Omit<Habit, 'id' | 'createdAt'>) {
    const habit: Habit = {
      id: generateId(),
      createdAt: todayStr(),
      ...data,
    }
    await addHabit(habit)
    pushToast(`"${habit.name}" added!`, 'success')
    navigate('/')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line px-[18px] py-3.5">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center border-none bg-none py-1 text-accent"
        >
          <ChevLeftIcon size={20} />
        </button>
        <h1 className="m-0 flex-1 text-[17px] font-bold text-ink">New habit</h1>
      </div>

      {/* Form */}
      <div
        className="scrollable flex-1 overflow-y-auto px-[18px] pt-5"
        style={{ paddingBottom: 'calc(var(--safe-bottom) + 90px)' }}
      >
        <HabitForm onSave={handleCreate} onCancel={() => navigate(-1)} submitLabel="Create habit" />
      </div>
    </div>
  )
}
