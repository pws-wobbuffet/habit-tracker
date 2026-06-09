const EMOJI = [
  '🏃',
  '💧',
  '📖',
  '🧘',
  '🍎',
  '🛌',
  '💪',
  '🥗',
  '✍️',
  '🎯',
  '🧠',
  '☀️',
  '🚶',
  '🚴',
  '🏊',
  '⛰️',
  '🎸',
  '🎨',
  '🎹',
  '📷',
  '💊',
  '🦷',
  '🧹',
  '💰',
  '📵',
  '🌿',
  '☕',
  '🍵',
  '🥦',
  '🚭',
  '📚',
  '🗣️',
  '😴',
  '🧴',
  '🪥',
]

interface EmojiPickerProps {
  value: string
  onChange: (e: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {EMOJI.map((e) => (
        <button
          key={e}
          onClick={() => onChange(e)}
          className={`cursor-pointer rounded-[10px] border-2 px-1 py-1.5 text-[22px] transition-colors duration-150 ${
            value === e ? 'border-accent bg-accent-soft' : 'border-transparent bg-transparent'
          }`}
        >
          {e}
        </button>
      ))}
    </div>
  )
}
