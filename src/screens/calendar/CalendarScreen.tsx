import { m } from 'framer-motion'
import { useCompletionsStore } from '../../store/completions'
import { HeatmapGrid } from '../../components/charts/HeatmapGrid'
import { StatusBar } from '../../components/layout/StatusBar'

const PAGE = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
}

export default function CalendarScreen() {
  const completions = useCompletionsStore((s) => s.completions)

  const countsByDate = completions.reduce<Record<string, number>>((acc, c) => {
    acc[c.date] = (acc[c.date] ?? 0) + 1
    return acc
  }, {})

  return (
    <m.div {...PAGE} className="h-full flex flex-col bg-parchment">
      <StatusBar />
      <div className="flex-1 scrollable px-4 pt-4">
        <h1 className="font-display text-2xl font-semibold text-text mb-4">Calendar</h1>
        <HeatmapGrid countsByDate={countsByDate} />
      </div>
    </m.div>
  )
}
