import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BottomSheet } from './BottomSheet'
import { useHabitsStore } from '../../store/habits'
import { useCompletionsStore } from '../../store/completions'
import { useUIStore } from '../../store/ui'
import { TextNoteTab } from './tabs/TextNoteTab'
import { VoiceMemoTab } from './tabs/VoiceMemoTab'
import { CompletionLogTab } from './tabs/CompletionLogTab'

interface Props {
  habitId: string
}

type Tab = 'note' | 'voice' | 'log'

const TABS: { id: Tab; label: string }[] = [
  { id: 'note', label: 'Note' },
  { id: 'voice', label: 'Voice' },
  { id: 'log', label: 'Log' },
]

export function HabitSheet({ habitId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('note')
  const closeSheet = useUIStore((s) => s.closeSheet)
  const habit = useHabitsStore((s) => s.habits.find((h) => h.id === habitId))
  const completions = useCompletionsStore((s) => s.getForHabit(habitId))

  if (!habit) return null

  return (
    <AnimatePresence>
      <BottomSheet onClose={closeSheet}>
        <div className="px-5 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{habit.icon}</span>
            <h2 className="font-display text-lg font-semibold text-text">{habit.name}</h2>
          </div>

          {/* Tab bar */}
          <div className="flex bg-parchment rounded-xl p-1 mb-4">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === t.id ? 'bg-surface shadow text-text' : 'text-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'note' && <TextNoteTab habitId={habitId} completions={completions} />}
          {activeTab === 'voice' && <VoiceMemoTab habitId={habitId} />}
          {activeTab === 'log' && <CompletionLogTab completions={completions} />}
        </div>
      </BottomSheet>
    </AnimatePresence>
  )
}
