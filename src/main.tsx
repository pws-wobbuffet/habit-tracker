import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/globals.css'
import './styles/animations.css'
import App from './App'
import { useHabitsStore } from './store/habits'
import { useCompletionsStore } from './store/completions'
import { useProfileStore } from './store/profile'

async function bootstrap() {
  await Promise.all([
    useHabitsStore.getState().hydrate(),
    useCompletionsStore.getState().hydrate(),
    useProfileStore.getState().hydrate(),
  ])

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

bootstrap()
