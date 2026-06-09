import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { SUGGESTIONS, SUGGESTION_CATEGORIES } from '../../lib/suggestions'
import { generateId } from '../../lib/uuid'
import { todayStr } from '../../lib/dates'
import { SparkleIcon } from '../../components/icons'

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const addHabit = useHabitsStore((s) => s.addHabit)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  async function handleStart() {
    setLoading(true)
    localStorage.setItem('habitus-onboarding-done', '1')
    const chosen = SUGGESTIONS.filter((s) => selected.has(s.name))
    await Promise.all(
      chosen.map((s) =>
        addHabit({
          id: generateId(),
          name: s.name,
          icon: s.icon,
          hex: s.hex,
          schedule: s.schedule,
          isFavorite: false,
          createdAt: todayStr(),
          target: s.target,
        }),
      ),
    )
    navigate('/', { replace: true })
  }

  function handleSkip() {
    localStorage.setItem('habitus-onboarding-done', '1')
    navigate('/', { replace: true })
  }

  return (
    <div
      className="scrollable scroll"
      style={{
        height: '100%',
        background: 'var(--bg)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ padding: '28px 22px 0', flexShrink: 0 }}>
        {!isDesktop && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SparkleIcon size={18} />
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
              }}
            >
              habitus
            </span>
          </div>
        )}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            margin: '0 0 6px',
          }}
        >
          Which habits do you
          <br />
          want to build?
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 20px' }}>
          Pick a few to get started. You can always add or remove later.
        </p>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUGGESTION_CATEGORIES.map((cat) => {
            const count = SUGGESTIONS.filter(
              (s) => s.category === cat && selected.has(s.name),
            ).length
            return (
              <a
                key={cat}
                href={`#cat-${cat}`}
                style={{
                  padding: '6px 13px',
                  borderRadius: 20,
                  border: '1.5px solid var(--line)',
                  background: count > 0 ? 'var(--accent-soft)' : 'var(--surface-2)',
                  color: count > 0 ? 'var(--accent)' : 'var(--ink-2)',
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  textDecoration: 'none',
                }}
              >
                {cat}
                {count > 0 ? ` ${count}` : ''}
              </a>
            )
          })}
        </div>
      </div>

      {/* Habit grid */}
      <div style={{ padding: '16px 22px 20px' }}>
        {SUGGESTION_CATEGORIES.map((cat) => (
          <div key={cat} id={`cat-${cat}`} style={{ marginBottom: 28 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              {cat}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {SUGGESTIONS.filter((s) => s.category === cat).map((s) => {
                const on = selected.has(s.name)
                return (
                  <button
                    key={s.name}
                    onClick={() => toggle(s.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 14px',
                      borderRadius: 24,
                      border: `2px solid ${on ? s.hex : 'var(--line)'}`,
                      background: on
                        ? `color-mix(in srgb, ${s.hex} 15%, var(--surface))`
                        : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'border-color .15s, background .15s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                        {s.name}
                      </div>
                      {s.target && (
                        <div
                          style={{
                            fontSize: 11,
                            color: on ? s.hex : 'var(--ink-3)',
                            fontWeight: 600,
                          }}
                        >
                          {s.target.unit === 'steps'
                            ? `${s.target.qty}k steps`
                            : `${s.target.qty} ${s.target.unit}`}
                        </div>
                      )}
                    </div>
                    {on && (
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: s.hex,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: 2,
                          flexShrink: 0,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '14px 22px',
          paddingBottom: 'max(var(--safe-bottom), 14px)',
          borderTop: '1px solid var(--line)',
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <button
          onClick={handleStart}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 14,
            border: 'none',
            background: selected.size > 0 ? 'var(--accent)' : 'var(--surface-2)',
            color: selected.size > 0 ? 'var(--on-accent)' : 'var(--ink-3)',
            fontWeight: 700,
            fontSize: 15,
            cursor: selected.size > 0 ? 'pointer' : 'default',
            transition: 'background .2s, color .2s',
          }}
        >
          {selected.size > 0
            ? `Start with ${selected.size} habit${selected.size > 1 ? 's' : ''}`
            : 'Select habits above'}
        </button>
        <button
          onClick={handleSkip}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 14,
            border: 'none',
            background: 'none',
            color: 'var(--ink-3)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Start fresh, I'll add my own
        </button>
      </div>
    </div>
  )
}
