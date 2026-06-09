import { useState, useEffect, useRef } from 'react'
import { useYearHeatmap } from '../../hooks/useProgress'
import { useCompletionsStore } from '../../store/completions'
import { Ring } from '../../components/charts/Ring'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function useIsDesktop() {
  const [v, setV] = useState(() => window.innerWidth >= 768)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const h = (e: MediaQueryListEvent) => setV(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return v
}

export default function CalendarScreen() {
  const cells = useYearHeatmap()
  const completions = useCompletionsStore((s) => s.completions)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const currentMonthRef = useRef<HTMLDivElement | null>(null)
  const currentMonth = new Date().getMonth()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    currentMonthRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [])

  const byMonth: Array<typeof cells> = Array.from({ length: 12 }, () => [])
  for (const cell of cells) {
    const month = cell.d.getMonth()
    byMonth[month].push(cell)
  }

  const selectedCell = selectedDate ? cells.find((c) => c.date === selectedDate) : null
  const selectedHabits = selectedDate
    ? completions.filter((c) => c.date === selectedDate).length
    : 0

  return (
    <div
      className="scrollable scroll"
      style={{
        height: '100%',
        padding: '10px 18px 100px',
        background: 'var(--bg)',
      }}
    >
      <h1
        style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          margin: '10px 0 16px',
        }}
      >
        Calendar
      </h1>

      {selectedCell && (
        <div
          className="card"
          style={{
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Ring pct={selectedCell.pct} size={58} stroke={6}>
            <span className="num" style={{ fontSize: 12, color: 'var(--ink)' }}>
              {selectedCell.pct}%
            </span>
          </Ring>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
              {selectedCell.d.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
              {selectedHabits} habit{selectedHabits !== 1 ? 's' : ''} completed
              {selectedCell.due > 0 && ` of ${selectedCell.due}`}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
          fontSize: 11,
          color: 'var(--ink-3)',
        }}
      >
        <span>Less</span>
        {[0, 25, 50, 75, 100].map((pct) => (
          <div
            key={pct}
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background:
                pct === 0
                  ? 'var(--surface-2)'
                  : `linear-gradient(to top, color-mix(in srgb, var(--accent) 40%, var(--surface-2)) ${pct}%, var(--surface-2) ${pct}%)`,
              border: '1px solid var(--line)',
            }}
          />
        ))}
        <span>More</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isDesktop ? 20 : 16 }}>
        {byMonth.map((monthCells, mi) => {
          if (!monthCells.length) return null
          const firstDay = monthCells[0].d
          const offset = (firstDay.getDay() + 6) % 7
          return (
            <div key={mi} ref={mi === currentMonth ? currentMonthRef : null}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>
                {MONTHS[mi]}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: isDesktop ? 3 : 4,
                }}
              >
                {Array.from({ length: offset }).map((_, i) => (
                  <div key={`gap-${i}`} style={isDesktop ? { height: 68 } : undefined} />
                ))}
                {monthCells.map((cell) => {
                  const fillBg =
                    cell.future || cell.due === 0 || cell.pct === 0
                      ? 'var(--surface-2)'
                      : `linear-gradient(to top, color-mix(in srgb, var(--accent) 40%, var(--surface-2)) ${cell.pct}%, var(--surface-2) ${cell.pct}%)`
                  return isDesktop ? (
                    <div
                      key={cell.date}
                      onClick={() =>
                        !cell.future &&
                        setSelectedDate(selectedDate === cell.date ? null : cell.date)
                      }
                      title={`${cell.date}: ${cell.pct}%`}
                      style={{
                        height: 68,
                        borderRadius: 6,
                        background: fillBg,
                        cursor: cell.future ? 'default' : 'pointer',
                        border:
                          selectedDate === cell.date
                            ? '2px solid var(--accent)'
                            : '1px solid var(--line)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1 }}>
                        {cell.d.getDate()}
                      </span>
                      {!cell.future && cell.due > 0 && cell.pct > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
                          {cell.pct}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      key={cell.date}
                      onClick={() =>
                        !cell.future &&
                        setSelectedDate(selectedDate === cell.date ? null : cell.date)
                      }
                      title={`${cell.date}: ${cell.pct}%`}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 4,
                        background: fillBg,
                        cursor: cell.future ? 'default' : 'pointer',
                        border:
                          selectedDate === cell.date
                            ? '2px solid var(--accent)'
                            : '2px solid transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        fontSize: 12,
                        color: 'var(--ink-3)',
                      }}
                    >
                      {cell.d.getDate()}
                      {!cell.future && cell.due > 0 && cell.pct > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
                          {cell.pct}%
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
