import { useState, useCallback } from 'react'
import { useCompletionsStore } from '../../store/completions'
import { useUIStore } from '../../store/ui'
import { useLongPress } from '../../hooks/useLongPress'
import { useToggleCompletion } from '../../hooks/useCompletions'
import { useHabitStreak } from '../../hooks/useProgress'
import { scheduleLabel } from '../../lib/schedule'
import { todayStr } from '../../lib/dates'
import { StarFillIcon, FlameIcon, CheckIcon } from '../../components/icons'
import type { Habit } from '../../types'

interface Props {
  habit: Habit
}

export function HabitRow({ habit }: Props) {
  const isCompleted = useCompletionsStore((s) => s.isCompleted(habit.id, todayStr()))
  const openSheet = useUIStore((s) => s.openSheet)
  const toggle = useToggleCompletion()
  const streak = useHabitStreak(habit.id)
  const [justDone, setJustDone] = useState(false)

  const longPressHandlers = useLongPress(() => openSheet(habit.id))

  const handleClick = useCallback(async () => {
    await toggle(habit.id)
    if (!isCompleted) {
      setJustDone(true)
      setTimeout(() => setJustDone(false), 700)
    }
  }, [toggle, habit.id, isCompleted])

  const sweepBg = `color-mix(in srgb, ${habit.hex} 22%, transparent)`

  return (
    <div
      {...longPressHandlers}
      onClick={handleClick}
      className={`hrow relative flex cursor-pointer items-center gap-[13px] overflow-hidden rounded-[14px] border border-line bg-surface px-[15px] py-[13px] select-none${isCompleted ? ' done' : ''}${justDone ? ' just-done' : ''}`}
      style={{
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform .16s var(--ease-out), background .2s',
      }}
    >
      {/* Sweep animation div */}
      <div className="sweep" style={{ background: sweepBg }} />

      {/* Emoji box */}
      <div
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] text-[20px]"
        style={{
          background: `color-mix(in srgb, ${habit.hex} 18%, transparent)`,
          transform: isCompleted ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform .2s',
        }}
      >
        {habit.icon}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div
          className={`truncate text-[15px] font-semibold text-ink${isCompleted ? ' line-through opacity-60' : ''}`}
        >
          {habit.name}
        </div>
        <div className="mt-[3px] flex items-center gap-1.5 text-xs text-ink-3">
          <span>{scheduleLabel(habit.schedule)}</span>
          {habit.target && (
            <>
              <span>·</span>
              <span style={{ color: habit.hex, fontWeight: 600 }}>
                {habit.target.unit === 'steps'
                  ? `${habit.target.qty}k steps`
                  : `${habit.target.qty} ${habit.target.unit}`}
              </span>
            </>
          )}
          {streak > 0 && (
            <>
              <span>·</span>
              <FlameIcon size={12} style={{ color: habit.hex }} />
              <span style={{ color: habit.hex, fontWeight: 600 }}>{streak}</span>
            </>
          )}
        </div>
      </div>

      {/* Favorite star */}
      {habit.isFavorite && <StarFillIcon size={16} style={{ color: '#e6a93a', flexShrink: 0 }} />}

      {/* Check circle */}
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{
          border: `2px solid ${isCompleted ? habit.hex : 'var(--line-strong)'}`,
          background: isCompleted ? habit.hex : 'transparent',
          transform: isCompleted ? 'scale(1.05)' : 'scale(1)',
          transition: 'background .2s, border-color .2s, transform .2s var(--ease-spring)',
        }}
      >
        {isCompleted && <CheckIcon size={14} style={{ color: '#fff' }} />}
      </div>
    </div>
  )
}
