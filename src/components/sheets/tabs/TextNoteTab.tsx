import { generateId } from '../../../lib/uuid'
import { useState } from 'react'
import { useCompletionsStore } from '../../../store/completions'
import { useUIStore } from '../../../store/ui'
import { todayStr } from '../../../lib/dates'
import type { Completion } from '../../../types'

interface Props {
  habitId: string
  completions: Completion[]
}

export function TextNoteTab({ habitId, completions }: Props) {
  const [text, setText] = useState('')
  const addCompletion = useCompletionsStore((s) => s.addCompletion)
  const isCompleted = useCompletionsStore((s) => s.isCompleted)
  const pushToast = useUIStore((s) => s.pushToast)

  const notedCompletions = completions.filter((c) => c.note)

  async function handleSave() {
    if (!text.trim()) return
    const today = todayStr()
    if (!isCompleted(habitId, today)) {
      await addCompletion({ id: generateId(), habitId, date: today, note: text.trim() })
    }
    setText('')
    pushToast('Note saved', 'success')
  }

  return (
    <div>
      <textarea
        rows={4}
        placeholder="How did it go today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%',
          resize: 'none',
          borderRadius: 10,
          border: '1px solid var(--line)',
          background: 'var(--surface-2)',
          padding: '10px 12px',
          fontSize: 14,
          color: 'var(--ink)',
          outline: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
      <button
        onClick={handleSave}
        disabled={!text.trim()}
        style={{
          marginTop: 8,
          width: '100%',
          padding: '10px 0',
          borderRadius: 10,
          border: 'none',
          background: 'var(--accent)',
          color: 'var(--on-accent)',
          fontWeight: 600,
          fontSize: 14,
          cursor: text.trim() ? 'pointer' : 'not-allowed',
          opacity: text.trim() ? 1 : 0.4,
        }}
      >
        Save note
      </button>

      {notedCompletions.length > 0 && (
        <div style={{ marginTop: 16, maxHeight: 160, overflowY: 'auto' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Past notes
          </div>
          {notedCompletions.slice(0, 10).map((c) => (
            <div
              key={c.id}
              style={{
                background: 'var(--surface-2)',
                borderRadius: 10,
                padding: '8px 12px',
                marginBottom: 6,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{c.date}</div>
              <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 2 }}>{c.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
