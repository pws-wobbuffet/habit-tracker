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
      <div className="flex max-h-60 flex-col gap-1.5 overflow-y-auto">
        {sorted.length === 0 && (
          <p className="py-4 text-center text-[13px] text-ink-3">No completions yet</p>
        )}
        {sorted.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-2.5 rounded-[10px] bg-surface-2 px-3 py-2"
          >
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-good" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-ink-3">{c.date}</div>
              {c.note && <div className="mt-0.5 truncate text-[13px] text-ink">{c.note}</div>}
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
          className="mt-3 w-full cursor-pointer border-none bg-none py-2 text-[13px] font-semibold text-accent"
        >
          View full history
        </button>
      )}
    </div>
  )
}
