import { generateId } from '../../lib/uuid'
import { useState } from 'react'
import { useHabitsStore } from '../../store/habits'
import { scheduleLabel } from '../../lib/schedule'
import { useHabitStreak } from '../../hooks/useProgress'
import { HabitForm } from '../../components/ui/HabitForm'
import { FlameIcon, PencilIcon, TrashIcon, DragIcon, PlusIcon } from '../../components/icons'
import { ConsBar } from '../../components/charts/ConsBar'
import { useUIStore } from '../../store/ui'
import type { Habit } from '../../types'
import { todayStr } from '../../lib/dates'

interface HabitRowProps {
  habit: Habit
  onEdit: (h: Habit) => void
  onDelete: (id: string) => void
  dragging: boolean
  onDragStart: () => void
  onDragOver: () => void
  onDragEnd: () => void
}

function HabitTableRow({
  habit,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
}: HabitRowProps) {
  const streak = useHabitStreak(habit.id)

  return (
    <tr
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver()
      }}
      onDragEnd={onDragEnd}
      style={{
        borderBottom: '1px solid var(--line)',
        cursor: 'grab',
      }}
    >
      <td style={{ padding: '10px 8px', width: 34 }}>
        <span style={{ color: 'var(--ink-3)' }}>
          <DragIcon size={16} />
        </span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: `color-mix(in srgb, ${habit.hex} 18%, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {habit.icon}
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{habit.name}</span>
        </div>
      </td>
      <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--ink-3)' }}>
        {scheduleLabel(habit.schedule)}
      </td>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <FlameIcon size={14} style={{ color: habit.hex }} />
          <span className="num" style={{ fontSize: 14, color: 'var(--ink)' }}>
            {streak}
          </span>
        </div>
      </td>
      <td style={{ padding: '10px 12px', width: 120 }}>
        <ConsBar pct={0} color={habit.hex} />
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button
            onClick={() => onEdit(habit)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-3)',
              padding: 4,
              borderRadius: 6,
            }}
          >
            <PencilIcon size={16} />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#e05858',
              padding: 4,
              borderRadius: 6,
            }}
          >
            <TrashIcon size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function HabitsScreen() {
  const habits = useHabitsStore((s) => s.habits)
  const addHabit = useHabitsStore((s) => s.addHabit)
  const updateHabit = useHabitsStore((s) => s.updateHabit)
  const deleteHabit = useHabitsStore((s) => s.deleteHabit)
  const reorderHabits = useHabitsStore((s) => s.reorderHabits)
  const pushToast = useUIStore((s) => s.pushToast)

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [orderedIds, setOrderedIds] = useState<string[]>(() => habits.map((h) => h.id))

  // Sync if habits change
  const allIds = habits.map((h) => h.id)
  const syncedIds = [
    ...orderedIds.filter((id) => allIds.includes(id)),
    ...allIds.filter((id) => !orderedIds.includes(id)),
  ]

  async function handleDelete(id: string) {
    await deleteHabit(id)
    setOrderedIds((prev) => prev.filter((x) => x !== id))
    pushToast('Habit deleted', 'info')
  }

  async function handleSaveEdit(data: Omit<Habit, 'id' | 'createdAt'>) {
    if (!editingHabit) return
    await updateHabit({ ...editingHabit, ...data })
    setEditingHabit(null)
    pushToast('Habit updated', 'success')
  }

  async function handleAdd(data: Omit<Habit, 'id' | 'createdAt'>) {
    const habit: Habit = {
      id: generateId(),
      createdAt: todayStr(),
      ...data,
    }
    await addHabit(habit)
    setOrderedIds((prev) => [...prev, habit.id])
    setShowAddDrawer(false)
    pushToast(`"${habit.name}" added`, 'success')
  }

  function handleDragEnd() {
    if (dragSrcIdx !== null && dragOverIdx !== null && dragSrcIdx !== dragOverIdx) {
      const newIds = [...syncedIds]
      const [moved] = newIds.splice(dragSrcIdx, 1)
      newIds.splice(dragOverIdx, 0, moved)
      setOrderedIds(newIds)
      reorderHabits(newIds)
    }
    setDragSrcIdx(null)
    setDragOverIdx(null)
  }

  const drawerOpen = editingHabit !== null || showAddDrawer

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Main table area */}
      <div
        className="scrollable scroll"
        style={{
          flex: 1,
          padding: '24px 24px 32px',
          background: 'var(--bg)',
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            margin: '0 0 20px',
          }}
        >
          Habits
        </h1>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th style={{ width: 34 }} />
                <th className="eyebrow" style={{ padding: '10px 12px', textAlign: 'left' }}>
                  Habit
                </th>
                <th className="eyebrow" style={{ padding: '10px 12px', textAlign: 'left' }}>
                  Schedule
                </th>
                <th className="eyebrow" style={{ padding: '10px 12px', textAlign: 'left' }}>
                  Streak
                </th>
                <th className="eyebrow" style={{ padding: '10px 12px', textAlign: 'left', width: 120 }}>
                  30d
                </th>
                <th style={{ padding: '10px 12px', width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {syncedIds.map((id, idx) => {
                const habit = habits.find((h) => h.id === id)
                if (!habit) return null
                return (
                  <HabitTableRow
                    key={habit.id}
                    habit={habit}
                    onEdit={setEditingHabit}
                    onDelete={handleDelete}
                    dragging={dragSrcIdx === idx}
                    onDragStart={() => setDragSrcIdx(idx)}
                    onDragOver={() => setDragOverIdx(idx)}
                    onDragEnd={handleDragEnd}
                  />
                )
              })}
            </tbody>
          </table>

          <div style={{ padding: '12px 16px' }}>
            <button
              onClick={() => setShowAddDrawer(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: '1px dashed var(--line-strong)',
                borderRadius: 10,
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--ink-3)',
              }}
            >
              <PlusIcon size={16} />
              Add a habit
            </button>
          </div>
        </div>
      </div>

      {/* Edit / Add drawer */}
      {drawerOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 380,
            background: 'var(--surface)',
            borderLeft: '1px solid var(--line)',
            padding: '24px 20px',
            overflowY: 'auto',
            zIndex: 10,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--ink)',
              margin: '0 0 20px',
            }}
          >
            {editingHabit ? 'Edit habit' : 'New habit'}
          </h2>
          <HabitForm
            initial={editingHabit ?? undefined}
            onSave={editingHabit ? handleSaveEdit : handleAdd}
            onCancel={() => {
              setEditingHabit(null)
              setShowAddDrawer(false)
            }}
            submitLabel={editingHabit ? 'Update' : 'Create'}
          />
        </div>
      )}
    </div>
  )
}
