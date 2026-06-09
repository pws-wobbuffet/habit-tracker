import { m } from 'framer-motion'
import type { Toast as ToastType } from '../../store/ui'

interface Props {
  toast: ToastType
  onDismiss(id: string): void
}

const BG: Record<ToastType['type'], string> = {
  success: '#22a35a',
  info: '#1c1e2e',
  error: '#e05858',
}

export function Toast({ toast, onDismiss }: Props) {
  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={() => onDismiss(toast.id)}
      style={{
        padding: '11px 18px',
        borderRadius: 14,
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        userSelect: 'none',
        background: BG[toast.type],
        color: '#ffffff',
        whiteSpace: 'nowrap',
      }}
    >
      {toast.message}
    </m.div>
  )
}
