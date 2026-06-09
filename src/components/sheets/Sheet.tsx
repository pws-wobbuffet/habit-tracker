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
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(8,10,16,.42)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .25s',
        }}
      />

      {/* Sheet panel */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid var(--line)',
          maxHeight,
          overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(101%)',
          transition: 'transform .35s cubic-bezier(.34,1.56,.64,1)',
          paddingBottom: 'var(--safe-bottom)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
          <div
            style={{
              width: 38,
              height: 5,
              borderRadius: 3,
              background: 'var(--line-strong)',
            }}
          />
        </div>
        {children}
      </div>
    </>
  )
}
