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
    <div
      className="scrollable scroll"
      style={{
        height: '100%',
        padding: '10px 18px 100px',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1
        style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          margin: '10px 0 20px',
        }}
      >
        Settings
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {/* Name card */}
        <div className="card" style={{ padding: 16 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 10 }}>
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid var(--line)',
              background: 'var(--surface-2)',
              color: 'var(--ink)',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Appearance card */}
        <div className="card" style={{ padding: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Appearance
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 8 }}
            >
              Theme
            </div>
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
            <div
              style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 10 }}
            >
              Accent color
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {ACCENT_OPTIONS.map((opt) => (
                <div
                  key={opt.hex}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <button
                    onClick={() => setAccent(opt.hex)}
                    title={opt.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: opt.hex,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow:
                        accent === opt.hex
                          ? `0 0 0 3px var(--surface), 0 0 0 5px ${opt.hex}`
                          : undefined,
                      transform: accent === opt.hex ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform .2s, box-shadow .2s',
                    }}
                  />
                  <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>{opt.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info card */}
        <div
          className="card"
          style={{ padding: 16, textAlign: 'center', fontSize: 12, color: 'var(--ink-3)' }}
        >
          <p style={{ margin: '0 0 4px' }}>habitus - open source</p>
          <p style={{ margin: 0 }}>Joined {profile.joinDate}</p>
        </div>
      </div>

      <div style={{ paddingTop: 16 }}>
        <button
          onClick={handleSave}
          className="btn-save"
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 14,
            border: 'none',
            background: saved ? '#22a35a' : 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background .3s',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <m.span
                key="saved"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
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
