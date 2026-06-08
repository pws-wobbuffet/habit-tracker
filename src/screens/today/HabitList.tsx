import { useNavigate } from 'react-router'
import { HabitCard } from './HabitCard'
import { useTodayHabits } from '../../hooks/useHabits'

export function HabitList() {
  const habits = useTodayHabits()
  const navigate = useNavigate()

  if (habits.length === 0) {
    return (
      <div className="px-4 py-12 flex flex-col items-center gap-3 text-center">
        <span className="text-4xl">🌱</span>
        <p className="text-muted text-sm">No habits scheduled for today.</p>
        <button
          onClick={() => navigate('/create')}
          className="mt-1 text-accent text-sm font-semibold"
        >
          Add your first habit →
        </button>
      </div>
    )
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">Today's habits</p>
        <button
          onClick={() => navigate('/create')}
          className="text-accent text-xs font-semibold"
        >
          + Add
        </button>
      </div>
      {habits.map((h, i) => (
        <HabitCard key={h.id} habit={h} index={i} />
      ))}
    </div>
  )
}
