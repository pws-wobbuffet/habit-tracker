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
      await addCompletion({ id: crypto.randomUUID(), habitId, date: today, note: text.trim() })
    }
    setText('')
    pushToast('Note saved', 'success')
  }

  return (
    <div>
      <textarea
        className="w-full resize-none rounded-xl border border-black/10 bg-parchment/50 p-3 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-accent/30 scrollable"
        rows={4}
        placeholder="How did it go today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSave}
        disabled={!text.trim()}
        className="mt-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold disabled:opacity-40 transition-opacity"
      >
        Save note
      </button>

      {notedCompletions.length > 0 && (
        <div className="mt-4 space-y-2 max-h-40 scrollable">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">Past notes</p>
          {notedCompletions.slice(0, 10).map((c) => (
            <div key={c.id} className="bg-parchment/60 rounded-lg px-3 py-2">
              <p className="text-xs text-muted">{c.date}</p>
              <p className="text-sm text-text mt-0.5">{c.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
