interface BarsProps {
  data: Array<{ pct: number; done: number; due: number }>
  height?: number
  color?: string
}

export function Bars({ data, height = 60, color = 'var(--accent)' }: BarsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 3,
        height,
        width: '100%',
      }}
    >
      {data.map((d, i) => {
        const barH = Math.max(4, (d.pct / 100) * height)
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: barH,
              background: color,
              opacity: d.pct < 35 ? 0.45 : 1,
              borderRadius: 3,
              transition: 'height 0.6s',
            }}
            title={`${d.pct}% (${d.done}/${d.due})`}
          />
        )
      })}
    </div>
  )
}
