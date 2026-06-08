import { createPortal } from 'react-dom'
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router'
import { BottomNav } from './components/layout/BottomNav'
import { SideNav } from './components/layout/SideNav'
import { HabitSheet } from './components/sheets/HabitSheet'
import { ToastContainer } from './components/ui/ToastContainer'
import { useUIStore } from './store/ui'
import TodayScreen from './screens/today/TodayScreen'
import HabitCreatorScreen from './screens/creator/HabitCreatorScreen'
import CalendarScreen from './screens/calendar/CalendarScreen'
import AnalyticsScreen from './screens/analytics/AnalyticsScreen'
import AchievementsScreen from './screens/achievements/AchievementsScreen'
import SettingsScreen from './screens/settings/SettingsScreen'
import HabitDetailScreen from './screens/detail/HabitDetailScreen'

export default function App() {
  const location = useLocation()
  const activeHabitId = useUIStore((s) => s.activeHabitId)

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex h-dvh bg-parchment" style={{ paddingTop: 'var(--safe-top)' }}>
        <SideNav />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<TodayScreen />} />
                <Route path="/create" element={<HabitCreatorScreen />} />
                <Route path="/calendar" element={<CalendarScreen />} />
                <Route path="/analytics" element={<AnalyticsScreen />} />
                <Route path="/achievements" element={<AchievementsScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="/habit/:id" element={<HabitDetailScreen />} />
              </Routes>
            </AnimatePresence>
          </div>
          <BottomNav />
        </div>
      </div>

      {activeHabitId && createPortal(<HabitSheet habitId={activeHabitId} />, document.body)}
      {createPortal(<ToastContainer />, document.body)}
    </LazyMotion>
  )
}
