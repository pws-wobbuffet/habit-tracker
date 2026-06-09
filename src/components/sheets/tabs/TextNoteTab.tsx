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
        className="box-border w-full resize-none rounded-[10px] border border-line bg-surface-2 px-3 py-2.5 font-[inherit] text-sm text-ink outline-none"
      />
      <button
        onClick={handleSave}
        disabled={!text.trim()}
        className="mt-2 w-full cursor-pointer rounded-[10px] border-none bg-accent py-2.5 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save note
      </button>

      {notedCompletions.length > 0 && (
        <div className="mt-4 max-h-40 overflow-y-auto">
          <div className="eyebrow mb-2">Past notes</div>
          {notedCompletions.slice(0, 10).map((c) => (
            <div key={c.id} className="mb-1.5 rounded-[10px] bg-surface-2 px-3 py-2">
              <div className="text-[11px] text-ink-3">{c.date}</div>
              <div className="mt-0.5 text-[13px] text-ink">{c.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
