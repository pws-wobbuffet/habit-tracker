import { useState, useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useProfileStore } from '../../store/profile'
import { useUIStore } from '../../store/ui'
import { Segmented } from '../../components/ui/Segmented'
import { CheckIcon } from '../../components/icons'

const ACCENT_OPTIONS = [
  { name: 'Indigo', hex: '#3b5bdb' },
  { name: 'Violet', hex: '#7c5cd6' },
  { name: 'Teal', hex: '#1f9c93' },
  { name: 'Emerald', hex: '#3b9b5b' },
  { name: 'Rose', hex: '#d65a72' },
  { name: 'Amber', hex: '#cf8a2b' },
]

export default function SettingsScreen() {
  const profile = useProfileStore((s) => s.profile)
  const updateProfile = useProfileStore((s) => s.updateProfile)
  const { theme, setTheme, accent, setAccent } = useUIStore()
  const [name, setName] = useState(profile.name)
  const [saved, setSaved] = useState(false)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleSave() {
    await updateProfile({ name: name.trim() || 'You' })
    setSaved(true)
    if (savedTimer.current) clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="scrollable scroll flex h-full flex-col bg-bg px-[18px] pt-2.5 pb-[100px]">
      <h1 className="mt-2.5 mb-5 text-[22px] font-extrabold tracking-[-0.02em] text-ink">
        Settings
      </h1>

      <div className="flex flex-1 flex-col gap-[14px]">
        {/* Name card */}
        <div className="card p-4">
          <label className="eyebrow mb-2.5 block">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="box-border w-full rounded-[10px] border border-line bg-surface-2 px-3.5 py-2.5 font-[inherit] text-sm text-ink outline-none"
          />
        </div>

        {/* Appearance card */}
        <div className="card p-4">
          <div className="eyebrow mb-3.5">Appearance</div>

          <div className="mb-4">
            <div className="mb-2 text-[13px] font-semibold text-ink-2">Theme</div>
            <Segmented
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
              value={theme}
              onChange={(v) => setTheme(v as 'auto' | 'light' | 'dark')}
            />
          </div>

          <div>
            <div className="mb-2.5 text-[13px] font-semibold text-ink-2">Accent color</div>
            <div className="flex flex-wrap gap-2.5">
              {ACCENT_OPTIONS.map((opt) => (
                <div key={opt.hex} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setAccent(opt.hex)}
                    title={opt.name}
                    className="h-9 w-9 cursor-pointer rounded-full border-none transition-[transform,box-shadow] duration-200"
                    style={{
                      background: opt.hex,
                      boxShadow:
                        accent === opt.hex
                          ? `0 0 0 3px var(--surface), 0 0 0 5px ${opt.hex}`
                          : undefined,
                      transform: accent === opt.hex ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                  <span className="text-[10px] text-ink-3">{opt.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="card p-4 text-center text-xs text-ink-3">
          <p className="m-0 mb-1">habitus - open source</p>
          <p className="m-0">Joined {profile.joinDate}</p>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          className="btn-save flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[14px] border-none py-[13px] text-[15px] font-bold text-white"
          style={{
            background: saved ? '#22a35a' : 'var(--accent)',
            transition: 'background .3s',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <m.span
                key="saved"
                className="flex items-center gap-2"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <m.span
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 12, delay: 0.05 }}
                >
                  <CheckIcon size={18} />
                </m.span>
                Saved
              </m.span>
            ) : (
              <m.span
                key="save"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Save
              </m.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}
