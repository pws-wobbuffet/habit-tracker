import { useProfileStore } from '../../store/profile'
import { formatDisplayDate, getGreeting } from '../../lib/dates'
import { m } from 'framer-motion'

const MOTTOS = [
  'Small steps, big changes.',
  'Consistency is the key.',
  'One day at a time.',
  'Build the life you want.',
  'Progress over perfection.',
]

export function GreetingHeader() {
  const name = useProfileStore((s) => s.profile.name)
  const today = new Date()
  const motto = MOTTOS[today.getDate() % MOTTOS.length]

  return (
    <m.div
      className="px-5 pt-3 pb-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <p className="text-xs text-muted font-medium">{formatDisplayDate(today)}</p>
      <h1 className="font-display text-2xl font-semibold text-text mt-0.5">
        {getGreeting()}, {name}
      </h1>
      <p className="text-sm text-muted mt-0.5">{motto}</p>
    </m.div>
  )
}
