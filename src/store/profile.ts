import { create } from 'zustand'
import { backend } from '../storage'
import { todayStr } from '../lib/dates'
import type { UserProfile } from '../types'

const DEFAULT_PROFILE: UserProfile = {
  name: 'You',
  joinDate: todayStr(),
  themeMode: 'light',
  accent: '#3b5bdb',
}

interface ProfileState {
  profile: UserProfile
  hydrated: boolean
  hydrate(): Promise<void>
  updateProfile(updates: Partial<UserProfile>): Promise<void>
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  hydrated: false,

  async hydrate() {
    const stored = await backend.getProfile()
    set({ profile: stored ?? DEFAULT_PROFILE, hydrated: true })
  },

  async updateProfile(updates) {
    const next = { ...get().profile, ...updates }
    await backend.putProfile(next)
    set({ profile: next })
  },
}))
