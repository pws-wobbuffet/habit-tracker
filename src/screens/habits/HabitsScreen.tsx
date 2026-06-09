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
      className="cursor-grab border-b border-line"
    >
      <td className="w-[34px] px-2 py-2.5">
        <span className="text-ink-3">
          <DragIcon size={16} />
        </span>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-base"
            style={{ background: `color-mix(in srgb, ${habit.hex} 18%, transparent)` }}
          >
            {habit.icon}
          </div>
          <span className="text-sm font-semibold text-ink">{habit.name}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-[13px] text-ink-3">{scheduleLabel(habit.schedule)}</td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1">
          <FlameIcon size={14} style={{ color: habit.hex }} />
          <span className="num text-sm text-ink">{streak}</span>
        </div>
      </td>
      <td className="w-[120px] px-3 py-2.5">
        <ConsBar pct={0} color={habit.hex} />
      </td>
      <td className="px-3 py-2.5 text-right">
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => onEdit(habit)}
            className="cursor-pointer rounded-md border-none bg-none p-1 text-ink-3"
          >
            <PencilIcon size={16} />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="cursor-pointer rounded-md border-none bg-none p-1"
            style={{ color: '#e05858' }}
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
    <div className="relative flex h-full overflow-hidden">
      {/* Main table area */}
      <div className="scrollable scroll flex-1 bg-bg px-6 pt-6 pb-8">
        <h1 className="mb-5 text-[22px] font-extrabold tracking-[-0.02em] text-ink">Habits</h1>

        <div className="card overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[34px]" />
                <th className="eyebrow px-3 py-2.5 text-left">Habit</th>
                <th className="eyebrow px-3 py-2.5 text-left">Schedule</th>
                <th className="eyebrow px-3 py-2.5 text-left">Streak</th>
                <th className="eyebrow w-[120px] px-3 py-2.5 text-left">30d</th>
                <th className="w-20 px-3 py-2.5" />
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

          <div className="px-4 py-3">
            <button
              onClick={() => setShowAddDrawer(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-dashed border-line-strong bg-none px-3.5 py-2 text-[13px] font-semibold text-ink-3"
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
          className="absolute top-0 right-0 bottom-0 z-10 w-[380px] overflow-y-auto border-l border-line bg-surface px-5 py-6"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <h2 className="mb-5 text-[17px] font-bold text-ink">
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
