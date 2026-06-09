import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { SUGGESTIONS, SUGGESTION_CATEGORIES } from '../../lib/suggestions'
import { generateId } from '../../lib/uuid'
import { todayStr } from '../../lib/dates'
import { useIsDesktop } from '../../hooks/useIsDesktop'
import { SparkleIcon } from '../../components/icons'

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const addHabit = useHabitsStore((s) => s.addHabit)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const isDesktop = useIsDesktop()

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
    <div className="scrollable scroll h-full overflow-y-auto bg-bg">
      {/* Header */}
      <div className="shrink-0 px-[22px] pt-7">
        {!isDesktop && (
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent text-on-accent">
              <SparkleIcon size={18} />
            </div>
            <span className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">habitus</span>
          </div>
        )}
        <h1 className="mb-1.5 text-[26px] font-extrabold tracking-[-0.03em] text-ink">
          Which habits do you
          <br />
          want to build?
        </h1>
        <p className="mt-0 mb-5 text-sm text-ink-2">
          Pick a few to get started. You can always add or remove later.
        </p>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTION_CATEGORIES.map((cat) => {
            const count = SUGGESTIONS.filter(
              (s) => s.category === cat && selected.has(s.name),
            ).length
            return (
              <a
                key={cat}
                href={`#cat-${cat}`}
                className={`shrink-0 rounded-[20px] border-[1.5px] border-line px-[13px] py-1.5 text-xs font-semibold whitespace-nowrap no-underline ${
                  count > 0 ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-ink-2'
                }`}
              >
                {cat}
                {count > 0 ? ` ${count}` : ''}
              </a>
            )
          })}
        </div>
      </div>

      {/* Habit grid */}
      <div className="px-[22px] pt-4 pb-5">
        {SUGGESTION_CATEGORIES.map((cat) => (
          <div key={cat} id={`cat-${cat}`} className="mb-7">
            <div className="eyebrow mb-3">{cat}</div>
            <div className="flex flex-wrap gap-[9px]">
              {SUGGESTIONS.filter((s) => s.category === cat).map((s) => {
                const on = selected.has(s.name)
                return (
                  <button
                    key={s.name}
                    onClick={() => toggle(s.name)}
                    className="flex cursor-pointer items-center gap-2 rounded-[24px] border-2 px-3.5 py-[9px]"
                    style={{
                      borderColor: on ? s.hex : 'var(--line)',
                      background: on
                        ? `color-mix(in srgb, ${s.hex} 15%, var(--surface))`
                        : 'var(--surface)',
                      transition: 'border-color .15s, background .15s',
                    }}
                  >
                    <span className="text-[18px]">{s.icon}</span>
                    <div className="text-left">
                      <div className="text-[13px] font-semibold text-ink">{s.name}</div>
                      {s.target && (
                        <div
                          className="text-[11px] font-semibold"
                          style={{ color: on ? s.hex : 'var(--ink-3)' }}
                        >
                          {s.target.unit === 'steps'
                            ? `${s.target.qty}k steps`
                            : `${s.target.qty} ${s.target.unit}`}
                        </div>
                      )}
                    </div>
                    {on && (
                      <div
                        className="ml-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
                        style={{ background: s.hex }}
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
        className="sticky bottom-0 flex flex-col gap-2.5 border-t border-line bg-surface px-[22px] pt-3.5"
        style={{ paddingBottom: 'max(var(--safe-bottom), 14px)' }}
      >
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full rounded-[14px] border-none py-3.5 text-[15px] font-bold"
          style={{
            background: selected.size > 0 ? 'var(--accent)' : 'var(--surface-2)',
            color: selected.size > 0 ? 'var(--on-accent)' : 'var(--ink-3)',
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
          className="w-full cursor-pointer rounded-[14px] border-none bg-none py-2.5 text-[13px] font-semibold text-ink-3"
        >
          Start fresh, I'll add my own
        </button>
      </div>
    </div>
  )
}
