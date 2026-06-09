import { IDBBackend } from './idb'
import { RemoteBackend } from './remote'
import type { StorageBackend } from './types'

export type { StorageBackend, CompletionFilter } from './types'

function createBackend(): StorageBackend {
  const type = import.meta.env.VITE_STORAGE_BACKEND ?? 'idb'
  switch (type) {
    case 'remote': {
      const url = import.meta.env.VITE_API_URL
      if (!url) throw new Error('VITE_API_URL is required when VITE_STORAGE_BACKEND=remote')
      return new RemoteBackend(url)
    }
    default:
      return new IDBBackend()
  }
}

// Module-level singleton -- created once, used directly by stores
export const backend: StorageBackend = createBackend()
