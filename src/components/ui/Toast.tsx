import { m } from 'framer-motion'
import type { Toast as ToastType } from '../../store/ui'

interface Props {
  toast: ToastType
  onDismiss(id: string): void
}

const COLORS: Record<ToastType['type'], string> = {
  success: 'bg-green text-white',
  info: 'bg-text text-white',
  error: 'bg-red-600 text-white',
}

export function Toast({ toast, onDismiss }: Props) {
  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`px-4 py-3 rounded-2xl shadow-lg text-sm font-medium cursor-pointer select-none ${COLORS[toast.type]}`}
      onClick={() => onDismiss(toast.id)}
    >
      {toast.message}
    </m.div>
  )
}
