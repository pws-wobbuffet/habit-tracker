import { m } from 'framer-motion'
import type { ReactNode } from 'react'

const MOBILE = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
}

const DESKTOP = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const },
}

function isDesktop() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
}

interface Props {
  children: ReactNode
  className?: string
}

export function PageWrapper({ children, className = '' }: Props) {
  const variants = isDesktop() ? DESKTOP : MOBILE
  return (
    <m.div {...variants} className={`h-full flex flex-col ${className}`}>
      {children}
    </m.div>
  )
}
