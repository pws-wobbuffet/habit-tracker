import { AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/ui'
import { Toast } from './Toast'

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)
  const dismissToast = useUIStore((s) => s.dismissToast)

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2"
      style={{ bottom: 'calc(var(--safe-bottom) + 80px)' }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onDismiss={dismissToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
