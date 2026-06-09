import { useState, useEffect, useRef } from 'react'
import { useYearHeatmap } from '../../hooks/useProgress'
import { useCompletionsStore } from '../../store/completions'
import { Ring } from '../../components/charts/Ring'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
    <div className="scrollable scroll h-full bg-bg px-[18px] pt-2.5 pb-[100px]">
      <h1 className="mt-2.5 mb-4 text-[22px] font-extrabold tracking-[-0.02em] text-ink">
        Calendar
      </h1>

      {selectedCell && (
        <div className="card mb-4 flex items-center gap-4 p-4">
          <Ring pct={selectedCell.pct} size={58} stroke={6}>
            <span className="num text-xs text-ink">{selectedCell.pct}%</span>
          </Ring>
          <div>
            <div className="text-[15px] font-bold text-ink">
              {selectedCell.d.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="mt-0.5 text-[13px] text-ink-3">
              {selectedHabits} habit{selectedHabits !== 1 ? 's' : ''} completed
              {selectedCell.due > 0 && ` of ${selectedCell.due}`}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mb-4 flex items-center gap-1.5 text-[11px] text-ink-3">
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
              <div className="eyebrow mb-1.5">{MONTHS[mi]}</div>
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
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--ink-2)',
                          lineHeight: 1,
                        }}
                      >
                        {cell.d.getDate()}
                      </span>
                      {!cell.future && cell.due > 0 && cell.pct > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: 'var(--accent)',
                            lineHeight: 1,
                          }}
                        >
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
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: 'var(--accent)',
                            lineHeight: 1,
                          }}
                        >
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
