import type { Schedule } from '../../types'
import { Segmented } from './Segmented'

interface ScheduleEditorProps {
  value: Schedule
  onChange: (s: Schedule) => void
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function ScheduleEditor({ value, onChange }: ScheduleEditorProps) {
  const segValue =
    value.type === 'daily' ? 'daily' : value.type === 'weekdays' ? 'weekdays' : 'custom'

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
    <div className="flex flex-col gap-3">
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
        <div className="flex gap-1.5">
          {DAY_LABELS.map((label, idx) => {
            const active = selectedDays.includes(idx)
            return (
              <button
                key={idx}
                onClick={() => toggleDay(idx)}
                className={`flex-1 cursor-pointer rounded-[10px] border-none py-2 text-xs font-semibold transition-colors duration-150 ${
                  active ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink-2'
                }`}
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
