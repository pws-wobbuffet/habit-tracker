import type { Completion, Habit, UserProfile } from '../types'
import type { CompletionFilter, StorageBackend } from './types'

export class RemoteBackend implements StorageBackend {
  private readonly base: string
  constructor(base: string) {
    this.base = base
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.base}${path}`)
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
    return res.json() as Promise<T>
  }

  private async put<T>(path: string, body: T): Promise<void> {
    const res = await fetch(`${this.base}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`)
  }

  private async del(path: string): Promise<void> {
    const res = await fetch(`${this.base}${path}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`)
  }

  getHabits() {
    return this.get<Habit[]>('/habits')
  }
  putHabit(habit: Habit) {
    return this.put(`/habits/${habit.id}`, habit)
  }
  deleteHabit(id: string) {
    return this.del(`/habits/${id}`)
  }

  getCompletions(filter?: CompletionFilter) {
    const params = new URLSearchParams()
    if (filter?.habitId) params.set('habitId', filter.habitId)
    if (filter?.date) params.set('date', filter.date)
    const qs = params.toString()
    return this.get<Completion[]>(`/completions${qs ? `?${qs}` : ''}`)
  }

  putCompletion(completion: Completion) {
    return this.put(`/completions/${completion.id}`, completion)
  }

  deleteCompletion(id: string) {
    return this.del(`/completions/${id}`)
  }

  getProfile() {
    return this.get<UserProfile | null>('/profile')
  }
  putProfile(profile: UserProfile) {
    return this.put('/profile', profile)
  }
}
