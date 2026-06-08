import { useNavigate, useParams } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { useCompletionsStore } from '../../store/completions'
import { useUIStore } from '../../store/ui'
import { ScheduleLabel } from '../../components/ui/ScheduleLabel'
import { useHabitStreak } from '../../hooks/useProgress'
import { PageWrapper } from '../../components/layout/PageWrapper'

export default function HabitDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const habit = useHabitsStore((s) => s.habits.find((h) => h.id === id))
  const deleteHabit = useHabitsStore((s) => s.deleteHabit)
  const allCompletions = useCompletionsStore((s) => s.completions)
  const completions = allCompletions.filter((c) => c.habitId === id)
  const pushToast = useUIStore((s) => s.pushToast)
  const streak = useHabitStreak(id ?? '')

  if (!habit) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Habit not found</p>
      </div>
    )
  }

  const sorted = [...completions].sort((a, b) => b.date.localeCompare(a.date))

  async function handleDelete() {
    if (!habit) return
    await deleteHabit(habit.id)
    pushToast(`"${habit.name}" deleted`, 'info')
    navigate('/')
  }

  return (
    <PageWrapper className="bg-parchment">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="text-accent text-sm font-medium">
          ← Back
        </button>
      </div>

      <div className="flex-1 scrollable px-4">
        <div className="flex items-center gap-4 bg-surface rounded-2xl p-4 mb-4 shadow-sm">
          <span className="text-4xl">{habit.icon}</span>
          <div>
            <h1 className="font-display text-xl font-semibold text-text">{habit.name}</h1>
            <ScheduleLabel schedule={habit.schedule} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-display font-bold text-accent">{streak}</p>
            <p className="text-xs text-muted mt-1">day streak</p>
          </div>
          <div className="bg-surface rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-display font-bold text-text">{completions.length}</p>
            <p className="text-xs text-muted mt-1">total completions</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
            Completion history
          </p>
          {sorted.length === 0 && (
            <p className="text-sm text-muted text-center py-4">No completions yet</p>
          )}
          <div className="space-y-2 max-h-80 scrollable">
            {sorted.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-text">{c.date}</p>
                  {c.note && <p className="text-xs text-muted mt-0.5">{c.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="w-full mt-4 mb-8 py-3 rounded-2xl text-red-500 bg-red-50 text-sm font-semibold"
        >
          Delete habit
        </button>
      </div>
    </PageWrapper>
  )
}
