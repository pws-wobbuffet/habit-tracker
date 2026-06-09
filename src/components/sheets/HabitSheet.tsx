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
    <Sheet open={true} onClose={closeSheet}>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: `color-mix(in srgb, ${habit.hex} 18%, var(--surface-2))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {habit.icon}
          </div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>
            {habit.name}
          </h2>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            background: 'var(--surface-2)',
            borderRadius: 11,
            padding: 3,
            marginBottom: 16,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1,
                padding: '7px 0',
                fontSize: 13.5,
                fontWeight: 600,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === t.id ? 'var(--surface)' : 'transparent',
                color: activeTab === t.id ? 'var(--ink)' : 'var(--ink-3)',
                boxShadow: activeTab === t.id ? 'var(--shadow-sm)' : 'none',
                transition: 'background .2s, color .2s',
              }}
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
