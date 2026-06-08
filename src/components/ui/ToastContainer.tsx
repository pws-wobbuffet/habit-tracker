import { AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/ui'
import { Toast } from './Toast'

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)
  const dismissToast = useUIStore((s) => s.dismissToast)

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[100] pointer-events-none"
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
