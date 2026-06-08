import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Completion, Habit, UserProfile } from '../types'
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

function getDB(): Promise<IDBPDatabase<HabitTrackerDB>> {
  if (!dbPromise) {
    dbPromise = openDB<HabitTrackerDB>('habit-tracker', 1, {
      upgrade(db) {
        db.createObjectStore('habits', { keyPath: 'id' })
        const cs = db.createObjectStore('completions', { keyPath: 'id' })
        cs.createIndex('by-habit', 'habitId')
        cs.createIndex('by-date', 'date')
        cs.createIndex('by-habit-date', ['habitId', 'date'])
        db.createObjectStore('profile', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

export class IDBBackend implements StorageBackend {
  async getHabits() {
    return (await getDB()).getAll('habits')
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
    return profile as UserProfile
  }

  async putProfile(profile: UserProfile) {
    await (await getDB()).put('profile', { ...profile, id: 'user' })
  }
}
