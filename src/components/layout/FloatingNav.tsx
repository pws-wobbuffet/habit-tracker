import { useLocation, useNavigate } from 'react-router'
import { HomeIcon, HomeFillIcon, CalendarIcon, StatsIcon, StarIcon, StarFillIcon, GearIcon } from '../icons'

const TABS = [
  { path: '/', label: 'Today', Icon: HomeIcon, ActiveIcon: HomeFillIcon },
  { path: '/calendar', label: 'Calendar', Icon: CalendarIcon, ActiveIcon: CalendarIcon },
  { path: '/analytics', label: 'Stats', Icon: StatsIcon, ActiveIcon: StatsIcon },
  { path: '/achievements', label: 'Awards', Icon: StarIcon, ActiveIcon: StarFillIcon },
  { path: '/settings', label: 'Settings', Icon: GearIcon, ActiveIcon: GearIcon },
]

export function FloatingNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeIdx = TABS.findIndex((t) => {
    if (t.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(t.path)
  })

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 'calc(var(--safe-bottom) + 14px)',
        left: '50%',
        transform: 'translateX(-50%)',
        height: 54,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '0 7px',
        borderRadius: 30,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(18px) saturate(1.4)',
        boxShadow: '0 12px 30px -8px rgba(10,14,30,.4)',
        border: '1px solid var(--nav-line)',
        zIndex: 40,
      }}
    >
      {/* Sliding indicator */}
      {activeIdx >= 0 && (
        <div
          style={{
            position: 'absolute',
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'var(--accent-soft)',
            left: 7 + activeIdx * 50,
            transition: 'left .38s cubic-bezier(.34,1.56,.64,1)',
          }}
        />
      )}

      {TABS.map((tab, idx) => {
        const isActive = idx === activeIdx
        const Icon = isActive ? tab.ActiveIcon : tab.Icon
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? 'var(--accent)' : 'var(--ink-3)',
              transform: isActive ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform .2s, color .2s',
              position: 'relative',
              zIndex: 1,
            }}
            title={tab.label}
          >
            <Icon size={22} />
          </button>
        )
      })}
    </nav>
  )
}
