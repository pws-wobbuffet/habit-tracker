import type { Schedule } from '../../types'
import { scheduleLabel } from '../../lib/schedule'

interface Props {
  schedule: Schedule
}

export function ScheduleLabel({ schedule }: Props) {
  return <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{scheduleLabel(schedule)}</span>
}
