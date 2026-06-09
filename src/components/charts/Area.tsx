interface AreaProps {
  data: Array<{ pct: number }>
  color?: string
  width?: number
  height?: number
  fill?: boolean
}

export function Area({
  data,
  color = 'var(--accent)',
  width = 320,
  height = 90,
  fill = true,
}: AreaProps) {
  if (data.length < 2) return null

  const pad = 2
  const w = width - pad * 2
  const h = height - pad * 2

  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * w,
    y: pad + h - (d.pct / 100) * h,
  }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  const areaPath =
    linePath +
    ` L${points[points.length - 1].x.toFixed(1)},${(pad + h).toFixed(1)}` +
    ` L${points[0].x.toFixed(1)},${(pad + h).toFixed(1)} Z`

  const gradId = `area-grad-${Math.random().toString(36).slice(2, 7)}`

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      {fill && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={areaPath} fill={`url(#${gradId})`} />}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
