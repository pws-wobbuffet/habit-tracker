import { m, type PanInfo } from 'framer-motion'
import type { ReactNode } from 'react'

interface SheetProps {
  onClose: () => void
  children: ReactNode
  maxHeight?: string
}

export function Sheet({ onClose, children, maxHeight = '85dvh' }: SheetProps) {
  function handleDragEnd(_: unknown, info: PanInfo) {
    // Dismiss on a deliberate downward drag or a fast flick.
    if (info.offset.y > 100 || info.velocity.y > 500) onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <m.div
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(8,10,16,.42)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Sheet panel — drag down to dismiss */}
      <m.div
        className="fixed right-0 bottom-0 left-0 z-50 overflow-y-auto rounded-t-[24px] border-t border-line bg-surface"
        style={{ maxHeight, paddingBottom: 'var(--safe-bottom)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 360 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={handleDragEnd}
      >
        {/* Handle */}
        <div className="flex cursor-grab justify-center pt-3 pb-1.5 active:cursor-grabbing">
          <div className="h-[5px] w-[38px] rounded-[3px] bg-line-strong" />
        </div>
        {children}
      </m.div>
    </>
  )
}
