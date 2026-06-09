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
    <div style={{ paddingBottom: 16 }}>
      <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.length === 0 && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--ink-3)',
              textAlign: 'center',
              padding: '16px 0',
            }}
          >
            No completions yet
          </p>
        )}
        {sorted.map((c) => (
          <div
            key={c.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: 'var(--surface-2)',
              borderRadius: 10,
              padding: '8px 12px',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--good)',
                marginTop: 4,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{c.date}</div>
              {c.note && (
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--ink)',
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.note}
                </div>
              )}
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
          style={{
            marginTop: 12,
            width: '100%',
            padding: '8px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--accent)',
          }}
        >
          View full history
        </button>
      )}
    </div>
  )
}
