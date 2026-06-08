import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/globals.css'
import './styles/animations.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useHabitsStore } from './store/habits'
import { useCompletionsStore } from './store/completions'
import { useProfileStore } from './store/profile'
import { backend } from './storage'
import { SEEDS } from './lib/seeds'

async function bootstrap() {
  await Promise.all([
    useHabitsStore.getState().hydrate(),
    useCompletionsStore.getState().hydrate(),
    useProfileStore.getState().hydrate(),
  ])

  if (SEEDS && useHabitsStore.getState().habits.length === 0) {
    await Promise.all([
      ...SEEDS.habits.map((h) => backend.putHabit(h)),
      ...SEEDS.completions.map((c) => backend.putCompletion(c)),
    ])
    await Promise.all([
      useHabitsStore.getState().hydrate(),
      useCompletionsStore.getState().hydrate(),
    ])
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>,
  )
}

bootstrap()
