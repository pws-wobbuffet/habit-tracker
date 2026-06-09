import type { ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  maxHeight?: string
}

export function Sheet({ open, onClose, children, maxHeight = '85dvh' }: SheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(8,10,16,.42)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .25s',
        }}
      />

      {/* Sheet panel */}
      <div
        className="fixed right-0 bottom-0 left-0 z-50 overflow-y-auto rounded-t-[24px] border-t border-line bg-surface"
        style={{
          maxHeight,
          transform: open ? 'translateY(0)' : 'translateY(101%)',
          transition: 'transform .35s var(--ease-spring)',
          paddingBottom: 'var(--safe-bottom)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1.5">
          <div className="h-[5px] w-[38px] rounded-[3px] bg-line-strong" />
        </div>
        {children}
      </div>
    </>
  )
}
