import { m } from 'framer-motion'

interface Props {
  percent: number
  completed: number
  total: number
}

const R = 40
const CIRCUMFERENCE = 2 * Math.PI * R

export function ProgressRing({ percent, completed, total }: Props) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE

  return (
    <div className="relative flex items-center justify-center" style={{ width: 88, height: 88 }}>
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
        <m.circle
          cx="44"
          cy="44"
          r={R}
          fill="none"
          stroke="#3a8a5a"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-display font-semibold text-xl leading-none">{percent}%</span>
        <span className="text-white/60 text-[10px] mt-0.5">{completed}/{total}</span>
      </div>
    </div>
  )
}
