import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { useUIStore } from '../../store/ui'
import type { Schedule } from '../../types'
import { PageWrapper } from '../../components/layout/PageWrapper'

const ICONS = [
  '🧘',
  '📚',
  '🏃',
  '💧',
  '🥗',
  '😴',
  '💪',
  '🎯',
  '✍️',
  '🎨',
  '🧹',
  '📝',
  '🌿',
  '🚴',
  '🧗',
  '🎵',
  '🌅',
  '🧴',
  '💊',
  '📵',
  '🧠',
  '🫁',
  '🏊',
  '🎭',
  '📸',
]

const SCHEDULE_OPTIONS: { value: 'daily' | 'weekly'; label: string }[] = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Weekly (Mon)' },
]

export default function HabitCreatorScreen() {
  const navigate = useNavigate()
  const addHabit = useHabitsStore((s) => s.addHabit)
  const pushToast = useUIStore((s) => s.pushToast)

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🎯')
  const [schedule, setSchedule] = useState<Schedule>('daily')

  async function handleCreate() {
    if (!name.trim()) return
    await addHabit({
      id: crypto.randomUUID(),
      name: name.trim(),
      icon,
      schedule,
      isFavorite: false,
      createdAt: new Date().toISOString().slice(0, 10),
    })
    pushToast(`"${name.trim()}" added!`, 'success')
    navigate('/')
  }

  return (
    <PageWrapper className="bg-parchment">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="text-accent text-sm font-medium">
          ← Back
        </button>
        <h1 className="font-display text-xl font-semibold text-text flex-1">New Habit</h1>
      </div>

      <div className="flex-1 scrollable px-5 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
            Habit name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning run"
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface text-text placeholder:text-muted/60 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
            Icon
          </label>
          <div className="grid grid-cols-8 gap-2">
            {ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`text-xl p-1.5 rounded-lg transition-all ${
                  icon === ic ? 'bg-accent/15 ring-2 ring-accent/40 scale-110' : 'bg-surface'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
            Schedule
          </label>
          <div className="flex gap-2">
            {SCHEDULE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSchedule(opt.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  schedule === opt.value
                    ? 'bg-accent text-white'
                    : 'bg-surface text-muted border border-black/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-8 pt-4">
        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="w-full py-3.5 rounded-2xl bg-accent text-white font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          Create habit
        </button>
      </div>
    </PageWrapper>
  )
}
