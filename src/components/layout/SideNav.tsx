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
    <aside
      style={{
        width: 224,
        flexShrink: 0,
        borderRight: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 14px',
        background: 'var(--surface)',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{ padding: '0 10px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SparkleIcon size={16} />
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
          }}
        >
          habitus
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'var(--surface-2)' : 'transparent',
                color: isActive ? 'var(--ink)' : 'var(--ink-2)',
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                textAlign: 'left',
                transition: 'background .15s, color .15s',
                width: '100%',
              }}
            >
              <span style={{ color: isActive ? 'var(--accent)' : 'inherit' }}>
                <Icon size={18} />
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={cycleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--ink-2)',
            fontWeight: 500,
            fontSize: 14,
            width: '100%',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {themeIcon}
          </span>
          {themeLabel}
        </button>

        <div
          style={{
            borderTop: '1px solid var(--line)',
            marginTop: 8,
            paddingTop: 12,
            paddingLeft: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            {initials || '?'}
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {profile.name}
          </span>
        </div>
      </div>
    </aside>
  )
}
