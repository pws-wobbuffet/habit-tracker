import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Completion, Habit, Schedule, UserProfile } from '../types'
import type { CompletionFilter, StorageBackend } from './types'

interface HabitTrackerDB extends DBSchema {
  habits: { key: string; value: Habit }
  completions: {
    key: string
    value: Completion
    indexes: { 'by-habit': string; 'by-date': string; 'by-habit-date': [string, string] }
  }
  profile: { key: string; value: UserProfile & { id: string } }
}

let dbPromise: Promise<IDBPDatabase<HabitTrackerDB>> | null = null

function migrateSchedule(raw: unknown): Schedule {
  if (raw === 'daily' || raw === 'weekly') return { type: 'daily' }
  if (typeof raw === 'object' && raw !== null && 'type' in raw) {
    return raw as Schedule
  }
  if (typeof raw === 'object' && raw !== null && 'days' in raw) {
    return { type: 'days', days: (raw as { days: number[] }).days }
  }
  return { type: 'daily' }
}

function migrateHabit(raw: Record<string, unknown>): Habit {
  return {
    id: raw.id as string,
    name: raw.name as string,
    icon: raw.icon as string,
    hex: (raw.hex as string) ?? '#4a86ef',
    schedule: migrateSchedule(raw.schedule),
    isFavorite: Boolean(raw.isFavorite),
    createdAt: raw.createdAt as string,
  }
}

function getDB(): Promise<IDBPDatabase<HabitTrackerDB>> {
  if (!dbPromise) {
    dbPromise = openDB<HabitTrackerDB>('habit-tracker', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('habits', { keyPath: 'id' })
          const cs = db.createObjectStore('completions', { keyPath: 'id' })
          cs.createIndex('by-habit', 'habitId')
          cs.createIndex('by-date', 'date')
          cs.createIndex('by-habit-date', ['habitId', 'date'])
          db.createObjectStore('profile', { keyPath: 'id' })
        }
        // v2: no structural changes, data migration happens in getHabits/getProfile
      },
    })
  }
  return dbPromise
}

export class IDBBackend implements StorageBackend {
  async getHabits() {
    const raw = await (await getDB()).getAll('habits')
    // Migrate old records that may lack hex or use old Schedule format
    return raw.map((h) => migrateHabit(h as unknown as Record<string, unknown>))
  }

  async putHabit(habit: Habit) {
    await (await getDB()).put('habits', habit)
  }

  async deleteHabit(id: string) {
    await (await getDB()).delete('habits', id)
  }

  async getCompletions(filter?: CompletionFilter) {
    const db = await getDB()
    if (filter?.habitId && filter.date) {
      const key = IDBKeyRange.only([filter.habitId, filter.date])
      return db.getAllFromIndex('completions', 'by-habit-date', key)
    }
    if (filter?.habitId) {
      return db.getAllFromIndex('completions', 'by-habit', filter.habitId)
    }
    if (filter?.date) {
      return db.getAllFromIndex('completions', 'by-date', filter.date)
    }
    return db.getAll('completions')
  }

  async putCompletion(completion: Completion) {
    await (await getDB()).put('completions', completion)
  }

  async deleteCompletion(id: string) {
    await (await getDB()).delete('completions', id)
  }

  async getProfile() {
    const stored = await (await getDB()).get('profile', 'user')
    if (!stored) return null
    const { id: _id, ...profile } = stored
    const result = profile as UserProfile
    if (!result.accent) result.accent = '#3b5bdb'
    return result
  }

  async putProfile(profile: UserProfile) {
    await (await getDB()).put('profile', { ...profile, id: 'user' })
  }
}
