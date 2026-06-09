import type { Schedule } from '../../types'
import { scheduleLabel } from '../../lib/schedule'

interface Props {
  schedule: Schedule
}

export function ScheduleLabel({ schedule }: Props) {
  return <span className="text-xs text-ink-3">{scheduleLabel(schedule)}</span>
}
