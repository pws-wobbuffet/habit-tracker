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
    <div className="relative flex rounded-[13px] bg-surface-2 p-[3px]">
      {/* Sliding indicator — width/offset are computed per option count, so it stays inline */}
      <div
        className="absolute top-[3px] bottom-[3px] left-[3px] rounded-[9px] bg-surface"
        style={{
          width: `calc((100% - 6px) / ${options.length})`,
          transform: `translateX(${idx * 100}%)`,
          transition: 'transform .3s var(--ease-spring)',
          boxShadow: 'var(--shadow-sm)',
        }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative z-[1] flex-1 cursor-pointer rounded-[9px] border-none bg-transparent font-semibold transition-colors ${
            small ? 'px-2 py-[5px] text-[12.5px]' : 'px-[10px] py-[7px] text-[13.5px]'
          } ${opt.value === value ? 'text-ink' : 'text-ink-3'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
