import type { ReactNode } from 'react'

interface RingProps {
  pct: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: ReactNode
}

export function Ring({
  pct,
  size = 120,
  stroke = 11,
  color = 'var(--accent)',
  track = 'var(--ring-track)',
  children,
}: RingProps) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.max(0, Math.min(100, pct)) / 100) * circ
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-grid',
        placeItems: 'center',
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .7s cubic-bezier(0.22, 0.61, 0.36, 1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          lineHeight: 1.05,
        }}
      >
        {children}
      </div>
    </div>
  )
}
