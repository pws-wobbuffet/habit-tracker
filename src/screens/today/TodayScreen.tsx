import { GreetingHeader } from './GreetingHeader'
import { SummaryStrip } from './SummaryStrip'
import { WeekStrip } from './WeekStrip'
import { HabitList } from './HabitList'
import { PageWrapper } from '../../components/layout/PageWrapper'

export default function TodayScreen() {
  return (
    <PageWrapper className="bg-parchment">
      <div className="flex-1 scrollable">
        <GreetingHeader />
        <SummaryStrip />
        <WeekStrip />
        <HabitList />
        <div className="h-6" />
      </div>
    </PageWrapper>
  )
}
