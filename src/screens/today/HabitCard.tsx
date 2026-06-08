import { m } from 'framer-motion'
import { useCompletionsStore } from '../../store/completions'
import { useHabitsStore } from '../../store/habits'
import { useUIStore } from '../../store/ui'
import { useLongPress } from '../../hooks/useLongPress'
import { useToggleCompletion } from '../../hooks/useCompletions'
import { useHabitStreak } from '../../hooks/useProgress'
import { StreakChip } from '../../components/ui/StreakChip'
import { FavoriteStar } from '../../components/ui/FavoriteStar'
import { ScheduleLabel } from '../../components/ui/ScheduleLabel'
import { todayStr } from '../../lib/dates'
import type { Habit } from '../../types'

interface Props {
  habit: Habit
  index: number
}

export function HabitCard({ habit, index }: Props) {
  const isCompleted = useCompletionsStore((s) => s.isCompleted(habit.id, todayStr()))
  const toggleFavorite = useHabitsStore((s) => s.toggleFavorite)
  const openSheet = useUIStore((s) => s.openSheet)
  const toggle = useToggleCompletion()
  const streak = useHabitStreak(habit.id)

  const longPressHandlers = useLongPress(() => openSheet(habit.id))

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      {...longPressHandlers}
      onClick={() => toggle(habit.id)}
      className={`relative flex items-center gap-3 p-4 rounded-2xl mb-3 shadow-sm transition-colors select-none overflow-hidden ${
        isCompleted ? 'bg-green/8 border border-green/20' : 'bg-surface border border-black/5'
      }`}
    >
      {/* Green completion sweep */}
      {isCompleted && (
        <m.div
          className="absolute inset-0 bg-green/5 pointer-events-none"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Icon */}
      <m.div
        animate={isCompleted ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl w-10 text-center shrink-0"
      >
        {habit.icon}
      </m.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`font-medium text-sm leading-tight ${isCompleted ? 'text-green line-through decoration-green/50' : 'text-text'}`}
          >
            {habit.name}
          </span>
          {isCompleted && (
            <m.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              ✓
            </m.span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <ScheduleLabel schedule={habit.schedule} />
          <StreakChip streak={streak} />
        </div>
      </div>

      <FavoriteStar active={habit.isFavorite} onToggle={() => toggleFavorite(habit.id)} />
    </m.div>
  )
}
