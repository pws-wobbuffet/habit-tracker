import { m } from 'framer-motion'
import { StatusBar } from '../../components/layout/StatusBar'
import { GreetingHeader } from './GreetingHeader'
import { SummaryStrip } from './SummaryStrip'
import { WeekStrip } from './WeekStrip'
import { HabitList } from './HabitList'

const PAGE = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
}

export default function TodayScreen() {
  return (
    <m.div {...PAGE} className="h-full flex flex-col bg-parchment">
      <StatusBar />
      <div className="flex-1 scrollable">
        <GreetingHeader />
        <SummaryStrip />
        <WeekStrip />
        <HabitList />
        {/* Bottom padding so last card isn't hidden behind nav */}
        <div className="h-6" />
      </div>
    </m.div>
  )
}
