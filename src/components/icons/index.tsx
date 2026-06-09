import type { CSSProperties } from 'react'

interface IconProps {
  size?: number
  className?: string
  style?: CSSProperties
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 2 as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function HomeIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M3 10.6L12 3l9 7.6" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  )
}

export function HomeFillIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 3L21 10.6L18.5 10.6L18.5 20L5.5 20L5.5 10.6L3 10.6Z" />
    </svg>
  )
}

export function CalendarIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
      <path d="M3.5 9h17M8 2.5v4M16 2.5v4" />
    </svg>
  )
}

export function StatsIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M5 20V11M12 20V5M19 20v-6" />
    </svg>
  )
}

export function StarIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function StarFillIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style} stroke="none">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  )
}

export function GearIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

export function CheckIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export function PlusIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function ChevLeftIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function FlameIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style} stroke="none">
      <path
        d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-3-2-5-2-5s-1 2-3 2c-1 0-2-1-2-2s2-3 2-6z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MicIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3" />
    </svg>
  )
}

export function CloseIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function TrashIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </svg>
  )
}

export function PencilIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M4 20l4-1L19 8a2 2 0 00-3-3L5 16l-1 4z" />
    </svg>
  )
}

export function DragIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style} strokeWidth={0}>
      {[8, 12, 16].map((y) =>
        [8, 13].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} fill="currentColor" />),
      )}
    </svg>
  )
}

export function MoonIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M20 13.5A8 8 0 1110.5 4 6.5 6.5 0 0020 13.5z" />
    </svg>
  )
}

export function SunIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

export function SparkleIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    </svg>
  )
}

export function ListIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function SearchIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4-4" />
    </svg>
  )
}

export function ArrowUpIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M12 19V6M6 12l6-6 6 6" />
    </svg>
  )
}

export function ArrowDownIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M12 5v13M6 12l6 6 6-6" />
    </svg>
  )
}
