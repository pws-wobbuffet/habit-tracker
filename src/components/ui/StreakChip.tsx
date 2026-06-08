interface Props {
  streak: number
  size?: 'sm' | 'md'
}

export function StreakChip({ streak, size = 'sm' }: Props) {
  if (streak === 0) return null
  const cls = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full bg-accent/10 text-accent font-semibold ${cls}`}
    >
      🔥 {streak}
    </span>
  )
}
