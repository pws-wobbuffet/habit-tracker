import { useCompletionsStore } from '../../store/completions'
import { HeatmapGrid } from '../../components/charts/HeatmapGrid'
import { PageWrapper } from '../../components/layout/PageWrapper'

export default function CalendarScreen() {
  const completions = useCompletionsStore((s) => s.completions)

  const countsByDate = completions.reduce<Record<string, number>>((acc, c) => {
    acc[c.date] = (acc[c.date] ?? 0) + 1
    return acc
  }, {})

  return (
    <PageWrapper className="bg-parchment">
      <div className="flex-1 scrollable px-4 pt-4">
        <h1 className="font-display text-2xl font-semibold text-text mb-4">Calendar</h1>
        <HeatmapGrid countsByDate={countsByDate} />
      </div>
    </PageWrapper>
  )
}
