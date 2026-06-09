interface ConsBarProps {
  pct: number
  color: string
}

export function ConsBar({ pct, color }: ConsBarProps) {
  return (
    <div
      style={{
        height: 8,
        borderRadius: 6,
        background: 'var(--surface-2)',
        overflow: 'hidden',
        flex: 1,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 6,
          transition: 'width .8s cubic-bezier(.22,.61,.36,1)',
        }}
      />
    </div>
  )
}
