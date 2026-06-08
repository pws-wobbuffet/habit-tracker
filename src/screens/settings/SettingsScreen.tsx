import { useState } from 'react'
import { m } from 'framer-motion'
import { StatusBar } from '../../components/layout/StatusBar'
import { useProfileStore } from '../../store/profile'
import { useUIStore } from '../../store/ui'

const PAGE = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
}

export default function SettingsScreen() {
  const profile = useProfileStore((s) => s.profile)
  const updateProfile = useProfileStore((s) => s.updateProfile)
  const pushToast = useUIStore((s) => s.pushToast)
  const [name, setName] = useState(profile.name)

  async function handleSave() {
    await updateProfile({ name: name.trim() || 'You' })
    pushToast('Settings saved', 'success')
  }

  return (
    <m.div {...PAGE} className="h-full flex flex-col bg-parchment">
      <StatusBar />
      <div className="flex-1 scrollable px-4 pt-4">
        <h1 className="font-display text-2xl font-semibold text-text mb-5">Settings</h1>

        <div className="space-y-4">
          <div className="bg-surface rounded-2xl p-4">
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-parchment text-sm text-text outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div className="bg-surface rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">Dark mode</p>
              <p className="text-xs text-muted mt-0.5">Coming soon</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-black/10 opacity-40" />
          </div>

          <div className="bg-surface rounded-2xl p-4 text-xs text-muted text-center">
            <p>Joined {profile.joinDate}</p>
            <p className="mt-1">Habit Tracker — open source</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 pt-2">
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-accent text-white font-semibold"
        >
          Save
        </button>
      </div>
    </m.div>
  )
}
