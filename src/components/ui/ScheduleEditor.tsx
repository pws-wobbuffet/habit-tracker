import type { Schedule } from '../../types'
import { Segmented } from './Segmented'

interface ScheduleEditorProps {
  value: Schedule
  onChange: (s: Schedule) => void
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function ScheduleEditor({ value, onChange }: ScheduleEditorProps) {
  const segValue =
    value.type === 'daily'
      ? 'daily'
      : value.type === 'weekdays'
        ? 'weekdays'
        : 'custom'

  function handleSegChange(v: string) {
    if (v === 'daily') onChange({ type: 'daily' })
    else if (v === 'weekdays') onChange({ type: 'weekdays' })
    else onChange({ type: 'days', days: [] })
  }

  function toggleDay(idx: number) {
    if (value.type !== 'days') return
    const days = value.days.includes(idx)
      ? value.days.filter((d) => d !== idx)
      : [...value.days, idx].sort((a, b) => a - b)
    onChange({ type: 'days', days })
  }

  const selectedDays = value.type === 'days' ? value.days : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Segmented
        options={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekdays', label: 'Weekdays' },
          { value: 'custom', label: 'Custom' },
        ]}
        value={segValue}
        onChange={handleSegChange}
      />
      {segValue === 'custom' && (
        <div style={{ display: 'flex', gap: 6 }}>
          {DAY_LABELS.map((label, idx) => {
            const active = selectedDays.includes(idx)
            return (
              <button
                key={idx}
                onClick={() => toggleDay(idx)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: active ? 'var(--accent)' : 'var(--surface-2)',
                  color: active ? 'var(--on-accent)' : 'var(--ink-2)',
                  transition: 'background .15s, color .15s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
