import { useLocation, useNavigate } from 'react-router'
import { useProfileStore } from '../../store/profile'
import { useUIStore } from '../../store/ui'
import {
  HomeIcon,
  HomeFillIcon,
  StatsIcon,
  CalendarIcon,
  ListIcon,
  StarIcon,
  StarFillIcon,
  GearIcon,
  SparkleIcon,
  MoonIcon,
  SunIcon,
} from '../icons'

const NAV_ITEMS = [
  { path: '/', label: 'Overview', Icon: HomeIcon, ActiveIcon: HomeFillIcon },
  { path: '/analytics', label: 'Analytics', Icon: StatsIcon, ActiveIcon: StatsIcon },
  { path: '/calendar', label: 'Calendar', Icon: CalendarIcon, ActiveIcon: CalendarIcon },
  { path: '/habits', label: 'Habits', Icon: ListIcon, ActiveIcon: ListIcon },
  { path: '/achievements', label: 'Awards', Icon: StarIcon, ActiveIcon: StarFillIcon },
  { path: '/settings', label: 'Settings', Icon: GearIcon, ActiveIcon: GearIcon },
]

export function SideNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const profile = useProfileStore((s) => s.profile)
  const { theme, setTheme } = useUIStore()

  const THEME_CYCLE: Array<'auto' | 'light' | 'dark'> = ['auto', 'light', 'dark']
  function cycleTheme() {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length]
    setTheme(next)
  }
  const themeIcon =
    theme === 'dark' ? (
      <MoonIcon size={18} />
    ) : theme === 'light' ? (
      <SunIcon size={18} />
    ) : (
      <SparkleIcon size={18} />
    )
  const themeLabel = theme === 'dark' ? 'Dark mode' : theme === 'light' ? 'Light mode' : 'Auto'

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="flex h-full w-[224px] shrink-0 flex-col border-r border-line bg-surface px-[14px] py-[22px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-2.5 pb-[22px]">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-accent text-on-accent">
          <SparkleIcon size={16} />
        </div>
        <span className="text-[20px] font-extrabold tracking-[-0.02em] text-ink">habitus</span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/' || location.pathname === '/overview'
              : location.pathname.startsWith(item.path)
          const Icon = isActive ? item.ActiveIcon : item.Icon
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border-none px-3 py-[9px] text-left text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-surface-2 font-semibold text-ink'
                  : 'bg-transparent font-medium text-ink-2'
              }`}
            >
              <span className={isActive ? 'text-accent' : ''}>
                <Icon size={18} />
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto">
        <button
          onClick={cycleTheme}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border-none bg-transparent px-3 py-[9px] text-left text-sm font-medium text-ink-2"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center">{themeIcon}</span>
          {themeLabel}
        </button>

        <div className="mt-2 flex items-center gap-2.5 border-t border-line pt-3 pl-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
            {initials || '?'}
          </div>
          <span className="truncate text-[13px] font-semibold text-ink">{profile.name}</span>
        </div>
      </div>
    </aside>
  )
}
