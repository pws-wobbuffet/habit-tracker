const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface Props {
  countsByDate: Record<string, number>
}

function intensityClass(count: number): string {
  if (count === 0) return 'bg-black/5'
  if (count === 1) return 'bg-green/25'
  if (count === 2) return 'bg-green/50'
  if (count <= 4) return 'bg-green/75'
  return 'bg-green'
}

export function HeatmapGrid({ countsByDate }: Props) {
  const today = new Date()
  const year = today.getFullYear()

  return (
    <div className="space-y-6">
      {MONTHS.map((month, mi) => {
        const firstDay = new Date(year, mi, 1)
        const lastDay = new Date(year, mi + 1, 0)
        const cells = Array.from({ length: lastDay.getDate() }, (_, i) => {
          const d = new Date(year, mi, i + 1)
          const dateStr = `${year}-${String(mi + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
          const isFuture = d > today
          const count = isFuture ? -1 : (countsByDate[dateStr] ?? 0)
          return { dateStr, count, day: i + 1 }
        })

        // Offset for first day of month (Mon=0)
        const offset = (firstDay.getDay() + 6) % 7

        return (
          <div key={month}>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{month}</p>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`gap-${i}`} />
              ))}
              {cells.map(({ dateStr, count, day }) => (
                <div
                  key={dateStr}
                  title={`${dateStr}: ${count >= 0 ? count : 0} completions`}
                  className={`aspect-square rounded-sm flex items-center justify-center text-[8px] text-text/30 ${
                    count === -1 ? 'bg-transparent' : intensityClass(count)
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
