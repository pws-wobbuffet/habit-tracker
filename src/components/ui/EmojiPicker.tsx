const EMOJI = [
  '🏃', '💧', '📖', '🧘', '🍎', '🛌', '💪', '🥗', '✍️', '🎯',
  '🧠', '☀️', '🚶', '🚴', '🏊', '⛰️', '🎸', '🎨', '🎹', '📷',
  '💊', '🦷', '🧹', '💰', '📵', '🌿', '☕', '🍵', '🥦', '🚭',
  '📚', '🗣️', '😴', '🧴', '🪥',
]

interface EmojiPickerProps {
  value: string
  onChange: (e: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 6,
      }}
    >
      {EMOJI.map((e) => (
        <button
          key={e}
          onClick={() => onChange(e)}
          style={{
            fontSize: 22,
            padding: '6px 4px',
            borderRadius: 10,
            border: value === e ? '2px solid var(--accent)' : '2px solid transparent',
            background: value === e ? 'var(--accent-soft)' : 'transparent',
            cursor: 'pointer',
            transition: 'background .15s',
          }}
        >
          {e}
        </button>
      ))}
    </div>
  )
}
