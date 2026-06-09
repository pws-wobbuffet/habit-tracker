import { useLocation, useNavigate } from 'react-router'
import {
  HomeIcon,
  HomeFillIcon,
  CalendarIcon,
  StatsIcon,
  StarIcon,
  StarFillIcon,
  GearIcon,
} from '../icons'

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
      className="fixed left-1/2 z-40 flex h-[54px] -translate-x-1/2 items-center gap-1 rounded-[30px] border px-[7px]"
      style={{
        bottom: 'calc(var(--safe-bottom) + 14px)',
        background: 'var(--nav-bg)',
        borderColor: 'var(--nav-line)',
        backdropFilter: 'blur(18px) saturate(1.4)',
        boxShadow: '0 12px 30px -8px rgba(10,14,30,.4)',
      }}
    >
      {/* Sliding indicator — left offset is computed from the active index */}
      {activeIdx >= 0 && (
        <div
          className="absolute h-[46px] w-[46px] rounded-full bg-accent-soft"
          style={{
            left: 7 + activeIdx * 50,
            transition: 'left .38s var(--ease-spring)',
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
            className="relative z-[1] flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full border-none bg-transparent transition-[transform,color] duration-200"
            style={{
              color: isActive ? 'var(--accent)' : 'var(--ink-3)',
              transform: isActive ? 'scale(1.08)' : 'scale(1)',
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
