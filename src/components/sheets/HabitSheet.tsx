import { useState } from 'react'
import { Sheet } from './Sheet'
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

const micAvailable = !!navigator.mediaDevices?.getUserMedia

const TABS: { id: Tab; label: string }[] = [
  { id: 'note', label: 'Note' },
  ...(micAvailable ? [{ id: 'voice' as Tab, label: 'Voice' }] : []),
  { id: 'log', label: 'Log' },
]

export function HabitSheet({ habitId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('note')
  const closeSheet = useUIStore((s) => s.closeSheet)
  const habit = useHabitsStore((s) => s.habits.find((h) => h.id === habitId))
  const allCompletions = useCompletionsStore((s) => s.completions)
  const completions = allCompletions.filter((c) => c.habitId === habitId)

  if (!habit) return null

  return (
    <Sheet onClose={closeSheet}>
      <div className="px-5 pb-5">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-[11px] text-[20px]"
            style={{ background: `color-mix(in srgb, ${habit.hex} 18%, var(--surface-2))` }}
          >
            {habit.icon}
          </div>
          <h2 className="m-0 text-[17px] font-bold text-ink">{habit.name}</h2>
        </div>

        {/* Tab bar */}
        <div className="mb-4 flex rounded-[11px] bg-surface-2 p-[3px]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 cursor-pointer rounded-[8px] border-none py-[7px] text-[13.5px] font-semibold transition-[background,color] duration-200 ${
                activeTab === t.id ? 'bg-surface text-ink' : 'bg-transparent text-ink-3'
              }`}
              style={{ boxShadow: activeTab === t.id ? 'var(--shadow-sm)' : 'none' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'note' && <TextNoteTab habitId={habitId} completions={completions} />}
        {activeTab === 'voice' && <VoiceMemoTab habitId={habitId} />}
        {activeTab === 'log' && <CompletionLogTab completions={completions} />}
      </div>
    </Sheet>
  )
}
