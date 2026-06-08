import { m, type PanInfo } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  onClose(): void
  children: ReactNode
}

export function BottomSheet({ onClose, children }: Props) {
  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 80 || info.velocity.y > 300) {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <m.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <m.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ paddingBottom: 'var(--safe-bottom)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={handleDragEnd}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-black/15" />
        </div>
        {children}
      </m.div>
    </>
  )
}
