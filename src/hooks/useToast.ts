import { useUIStore } from '../store/ui'

export function useToast() {
  return useUIStore((s) => s.pushToast)
}
