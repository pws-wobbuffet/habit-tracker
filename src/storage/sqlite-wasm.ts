import type { Completion, Habit, UserProfile } from '../types'
import type { CompletionFilter, StorageBackend } from './types'

// SQLite WASM backend using @sqlite.org/sqlite-wasm + OPFS persistence
// Not yet implemented -- stub throws to make missing config obvious
export class SQLiteWasmBackend implements StorageBackend {
  private _notImpl(): never {
    throw new Error(
      'SQLite WASM backend is not yet implemented. Use VITE_STORAGE_BACKEND=idb (default) instead.',
    )
  }

  getHabits(): Promise<Habit[]> { return this._notImpl() }
  putHabit(_habit: Habit): Promise<void> { return this._notImpl() }
  deleteHabit(_id: string): Promise<void> { return this._notImpl() }
  getCompletions(_filter?: CompletionFilter): Promise<Completion[]> { return this._notImpl() }
  putCompletion(_completion: Completion): Promise<void> { return this._notImpl() }
  deleteCompletion(_id: string): Promise<void> { return this._notImpl() }
  getProfile(): Promise<UserProfile | null> { return this._notImpl() }
  putProfile(_profile: UserProfile): Promise<void> { return this._notImpl() }
}
