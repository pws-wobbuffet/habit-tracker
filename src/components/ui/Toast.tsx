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
      className="cursor-pointer rounded-[14px] px-[18px] py-[11px] text-[13px] font-semibold whitespace-nowrap text-white select-none"
      style={{
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        background: BG[toast.type],
      }}
    >
      {toast.message}
    </m.div>
  )
}
