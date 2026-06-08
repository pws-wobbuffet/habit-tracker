interface Props {
  streak: number
}

export function StreakBadge({ streak }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <span className="text-3xl leading-none">🔥</span>
      <span className="text-white font-display font-semibold text-2xl leading-none">{streak}</span>
      <span className="text-white/60 text-xs">day streak</span>
    </div>
  )
}
