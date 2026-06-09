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
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {PALETTE.map((c) => (
        <button
          key={c.hex}
          title={c.name}
          onClick={() => onChange(c.hex)}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: c.hex,
            border: 'none',
            cursor: 'pointer',
            boxShadow: value === c.hex ? `0 0 0 3px var(--surface), 0 0 0 5px ${c.hex}` : undefined,
            transform: value === c.hex ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform .2s, box-shadow .2s',
          }}
        />
      ))}
    </div>
  )
}
