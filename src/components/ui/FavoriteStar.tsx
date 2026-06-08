import { m } from 'framer-motion'

interface Props {
  active: boolean
  onToggle(): void
}

export function FavoriteStar({ active, onToggle }: Props) {
  return (
    <m.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className="p-1 -mr-1"
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? '#c17a3a' : 'none'}
        stroke={active ? '#c17a3a' : '#8b7355'}
        strokeWidth={2}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </m.button>
  )
}
