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
    <div
      style={{
        height: '100%',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 0',
          }}
        >
          <ChevLeftIcon size={20} />
        </button>
        <h1
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: 'var(--ink)',
            margin: 0,
            flex: 1,
          }}
        >
          New habit
        </h1>
      </div>

      {/* Form */}
      <div className="scrollable" style={{ flex: 1, padding: '20px 18px calc(var(--safe-bottom) + 90px)', overflowY: 'auto' }}>
        <HabitForm
          onSave={handleCreate}
          onCancel={() => navigate(-1)}
          submitLabel="Create habit"
        />
      </div>
    </div>
  )
}
