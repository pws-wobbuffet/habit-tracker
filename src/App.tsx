import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router'
import { SideNav } from './components/layout/SideNav'
import { FloatingNav } from './components/layout/FloatingNav'
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
import OverviewScreen from './screens/overview/OverviewScreen'
import HabitsScreen from './screens/habits/HabitsScreen'
import OnboardingScreen from './screens/onboarding/OnboardingScreen'
import { useHabitsStore } from './store/habits'
import type { CSSProperties } from 'react'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

function useSystemDark() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return dark
}

export default function App() {
  const { theme, accent, activeHabitId } = useUIStore()
  const habitCount = useHabitsStore((s) => s.habits.length)
  const onboardingDone = localStorage.getItem('habitus-onboarding-done')
  const showOnboarding = habitCount === 0 && !onboardingDone
  const location = useLocation()
  const isDesktop = useIsDesktop()
  const systemDark = useSystemDark()

  const effectiveDark = theme === 'auto' ? systemDark : theme === 'dark'
  const mode = !effectiveDark ? 'light' : isDesktop ? 'dark-slate' : 'dark-oled'

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'light') root.removeAttribute('data-mode')
    else root.setAttribute('data-mode', mode)
    root.style.background = mode === 'dark-oled' ? '#000000' : mode === 'dark-slate' ? '#0e1220' : '#f6f7f9'
  }, [mode])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-2', `color-mix(in srgb, ${accent} 80%, #000)`)
    root.style.setProperty('--accent-soft', `color-mix(in srgb, ${accent} ${theme === 'light' ? '14%' : '30%'}, var(--surface))`)
  }, [accent, theme])

  const accentStyle = {
    '--accent': accent,
    '--accent-2': `color-mix(in srgb, ${accent} 80%, #000)`,
    '--accent-soft': `color-mix(in srgb, ${accent} ${theme === 'light' ? '14%' : '30%'}, var(--surface))`,
  } as CSSProperties

  return (
    <LazyMotion features={domAnimation}>
      <div
        className="app-root"
        data-mode={mode === 'light' ? undefined : mode}
        style={{
          ...accentStyle,
          paddingTop: 'var(--safe-top)',
          height: '100dvh',
          display: 'flex',
        }}
      >
        {isDesktop && <SideNav />}

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <Routes location={location}>
              <Route path="/" element={showOnboarding ? <OnboardingScreen /> : isDesktop ? <OverviewScreen /> : <TodayScreen />} />
              <Route path="/overview" element={<OverviewScreen />} />
              <Route path="/create" element={<HabitCreatorScreen />} />
              <Route path="/calendar" element={<CalendarScreen />} />
              <Route path="/analytics" element={<AnalyticsScreen />} />
              <Route path="/achievements" element={<AchievementsScreen />} />
              <Route path="/habits" element={<HabitsScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/habit/:id" element={<HabitDetailScreen />} />
            </Routes>
          </div>
        </div>

        {!isDesktop && !showOnboarding && <FloatingNav />}
      </div>

      {activeHabitId && createPortal(<HabitSheet habitId={activeHabitId} />, document.body)}
      {createPortal(<ToastContainer />, document.body)}
    </LazyMotion>
  )
}
