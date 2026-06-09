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
      className={`hrow${isCompleted ? ' done' : ''}${justDone ? ' just-done' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '13px 15px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform .16s var(--ease-out), background .2s',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      {/* Sweep animation div */}
      <div className="sweep" style={{ background: sweepBg }} />

      {/* Emoji box */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: `color-mix(in srgb, ${habit.hex} 18%, transparent)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
          transform: isCompleted ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform .2s',
        }}
      >
        {habit.icon}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--ink)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            opacity: isCompleted ? 0.6 : 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {habit.name}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 3,
            fontSize: 12,
            color: 'var(--ink-3)',
          }}
        >
          <span>{scheduleLabel(habit.schedule)}</span>
          {habit.target && (
            <>
              <span>·</span>
              <span style={{ color: habit.hex, fontWeight: 600 }}>
                {habit.target.unit === 'steps' ? `${habit.target.qty}k steps` : `${habit.target.qty} ${habit.target.unit}`}
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
      {habit.isFavorite && (
        <StarFillIcon size={16} style={{ color: '#e6a93a', flexShrink: 0 }} />
      )}

      {/* Check circle */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `2px solid ${isCompleted ? habit.hex : 'var(--line-strong)'}`,
          background: isCompleted ? habit.hex : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transform: isCompleted ? 'scale(1.05)' : 'scale(1)',
          transition: 'background .2s, border-color .2s, transform .2s var(--ease-spring)',
        }}
      >
        {isCompleted && <CheckIcon size={14} style={{ color: '#fff' }} />}
      </div>
    </div>
  )
}
