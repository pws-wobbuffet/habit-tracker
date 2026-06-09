const PALETTE = [
  { name: 'Moss', hex: '#4caf63' },
  { name: 'Teal', hex: '#22b3a6' },
  { name: 'Ocean', hex: '#4a86ef' },
  { name: 'Iris', hex: '#9b7cf0' },
  { name: 'Amber', hex: '#e0a23a' },
  { name: 'Rose', hex: '#ee6d84' },
  { name: 'Clay', hex: '#d2774a' },
  { name: 'Sky', hex: '#3fa9e0' },
]

interface ColorPickerProps {
  value: string
  onChange: (hex: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {PALETTE.map((c) => (
        <button
          key={c.hex}
          title={c.name}
          onClick={() => onChange(c.hex)}
          className="h-[34px] w-[34px] cursor-pointer rounded-full border-none transition-[transform,box-shadow] duration-200"
          style={{
            background: c.hex,
            boxShadow: value === c.hex ? `0 0 0 3px var(--surface), 0 0 0 5px ${c.hex}` : undefined,
            transform: value === c.hex ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  )
}
