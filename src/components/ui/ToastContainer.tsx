import { AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/ui'
import { Toast } from './Toast'

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)
  const dismissToast = useUIStore((s) => s.dismissToast)

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 100,
        pointerEvents: 'none',
        bottom: 'calc(var(--safe-bottom) + 80px)',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <Toast toast={t} onDismiss={dismissToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
