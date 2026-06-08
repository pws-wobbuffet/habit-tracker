import type { Schedule } from '../../types'

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface Props {
  schedule: Schedule
}

export function ScheduleLabel({ schedule }: Props) {
  let label: string
  if (schedule === 'daily') {
    label = 'Every day'
  } else if (schedule === 'weekly') {
    label = 'Weekly'
  } else {
    label = schedule.days.map((d) => DAY_SHORT[d]).join(', ')
  }
  return <span className="text-xs text-muted">{label}</span>
}
