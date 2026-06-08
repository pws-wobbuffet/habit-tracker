import { useNavigate } from 'react-router'
import { useUIStore } from '../../../store/ui'
import type { Completion } from '../../../types'

interface Props {
  completions: Completion[]
}

export function CompletionLogTab({ completions }: Props) {
  const closeSheet = useUIStore((s) => s.closeSheet)
  const navigate = useNavigate()
  const sorted = [...completions].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="pb-4">
      <div className="max-h-60 scrollable space-y-1.5">
        {sorted.length === 0 && (
          <p className="text-sm text-muted text-center py-4">No completions yet</p>
        )}
        {sorted.map((c) => (
          <div key={c.id} className="flex items-start gap-3 bg-parchment/60 rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-green mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted">{c.date}</p>
              {c.note && <p className="text-sm text-text mt-0.5 truncate">{c.note}</p>}
            </div>
          </div>
        ))}
      </div>

      {completions.length > 0 && (
        <button
          onClick={() => {
            closeSheet()
            navigate(`/habit/${completions[0].habitId}`)
          }}
          className="mt-3 w-full py-2 text-sm text-accent font-medium"
        >
          View full history →
        </button>
      )}
    </div>
  )
}
