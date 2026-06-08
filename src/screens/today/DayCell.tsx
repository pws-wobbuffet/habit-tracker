import { m } from 'framer-motion'
import { dayLetter, formatDate, isToday } from '../../lib/dates'
import { useCompletionsStore } from '../../store/completions'

interface Props {
  date: Date
  onTap(dateStr: string): void
}

export function DayCell({ date, onTap }: Props) {
  const dateStr = formatDate(date)
  const today = isToday(dateStr)
  const isFuture = dateStr > formatDate(new Date())
  const hasAny = useCompletionsStore((s) => s.completions.some((c) => c.date === dateStr))

  return (
    <m.button
      whileTap={isFuture ? {} : { scale: 0.92 }}
      onClick={() => !isFuture && onTap(dateStr)}
      disabled={isFuture}
      className={`flex flex-col items-center gap-1 py-2 px-2.5 rounded-xl min-w-[42px] transition-colors ${
        today ? 'ring-2 ring-accent' : ''
      } ${isFuture ? 'opacity-35 cursor-not-allowed' : ''}`}
    >
      <span className="text-[10px] font-medium text-muted uppercase">{dayLetter(date)}</span>
      <span className={`text-sm font-semibold ${today ? 'text-accent' : 'text-text'}`}>
        {date.getDate()}
      </span>
      <div
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          hasAny ? 'bg-green' : 'bg-transparent'
        }`}
      />
    </m.button>
  )
}
