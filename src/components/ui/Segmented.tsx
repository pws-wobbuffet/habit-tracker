interface SegmentedOption {
  value: string
  label: string
}

interface SegmentedProps {
  options: SegmentedOption[]
  value: string
  onChange: (v: string) => void
  small?: boolean
}

export function Segmented({ options, value, onChange, small = false }: SegmentedProps) {
  const idx = options.findIndex((o) => o.value === value)

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        background: 'var(--surface-2)',
        borderRadius: 13,
        padding: 3,
      }}
    >
      {/* Sliding indicator */}
      <div
        style={{
          position: 'absolute',
          top: 3,
          bottom: 3,
          left: 3,
          width: `calc((100% - 6px) / ${options.length})`,
          transform: `translateX(${idx * 100}%)`,
          transition: 'transform .3s cubic-bezier(.34,1.56,.64,1)',
          background: 'var(--surface)',
          borderRadius: 9,
          boxShadow: 'var(--shadow-sm)',
        }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            position: 'relative',
            zIndex: 1,
            padding: small ? '5px 8px' : '7px 10px',
            fontSize: small ? 12.5 : 13.5,
            fontWeight: 600,
            color: opt.value === value ? 'var(--ink)' : 'var(--ink-3)',
            background: 'none',
            border: 'none',
            borderRadius: 9,
            cursor: 'pointer',
            transition: 'color .2s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
