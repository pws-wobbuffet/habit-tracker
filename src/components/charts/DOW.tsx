interface DOWProps {
  data: Array<{ label: string; pct: number }>
  color?: string
}

export function DOW({ data, color = 'var(--accent)' }: DOWProps) {
  const maxPct = Math.max(...data.map((d) => d.pct), 1)
  const chartH = 120

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: chartH }}>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.pct / 100) * (chartH - 20))
        const isBest = d.pct === maxPct && d.pct > 0
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: '100%',
                height: barH,
                background: isBest ? color : 'var(--surface-2)',
                borderRadius: 4,
                transition: 'height 0.6s',
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: isBest ? color : 'var(--ink-3)',
              }}
            >
              {d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
