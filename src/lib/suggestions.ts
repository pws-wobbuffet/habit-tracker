import type { Habit } from '../types'

export interface HabitSuggestion {
  name: string
  icon: string
  hex: string
  schedule: Habit['schedule']
  target?: Habit['target']
  category: string
}

export const SUGGESTIONS: HabitSuggestion[] = [
  // Health
  {
    category: 'Health',
    name: 'Drink water',
    icon: '💧',
    hex: '#4a86ef',
    schedule: { type: 'daily' },
    target: { unit: 'L', qty: 2 },
  },
  {
    category: 'Health',
    name: 'Eat healthy',
    icon: '🥗',
    hex: '#4caf63',
    schedule: { type: 'daily' },
  },
  {
    category: 'Health',
    name: 'Take vitamins',
    icon: '💊',
    hex: '#22b3a6',
    schedule: { type: 'daily' },
    target: { unit: 'x', qty: 1 },
  },
  {
    category: 'Health',
    name: 'No junk food',
    icon: '🥑',
    hex: '#4caf63',
    schedule: { type: 'daily' },
  },
  {
    category: 'Health',
    name: 'Sleep 8 hours',
    icon: '😴',
    hex: '#9b7cf0',
    schedule: { type: 'daily' },
    target: { unit: 'hr', qty: 8 },
  },
  {
    category: 'Health',
    name: 'Brush teeth',
    icon: '🦷',
    hex: '#4a86ef',
    schedule: { type: 'daily' },
    target: { unit: 'x', qty: 2 },
  },

  // Movement
  {
    category: 'Movement',
    name: 'Morning run',
    icon: '🏃',
    hex: '#4caf63',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 30 },
  },
  {
    category: 'Movement',
    name: 'Daily walk',
    icon: '🚶',
    hex: '#22b3a6',
    schedule: { type: 'daily' },
    target: { unit: 'steps', qty: 8 },
  },
  {
    category: 'Movement',
    name: 'Cycling',
    icon: '🚴',
    hex: '#e0a23a',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 30 },
  },
  {
    category: 'Movement',
    name: 'Workout',
    icon: '💪',
    hex: '#d2774a',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 45 },
  },
  {
    category: 'Movement',
    name: 'Yoga',
    icon: '🧘',
    hex: '#9b7cf0',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 20 },
  },
  {
    category: 'Movement',
    name: 'Swimming',
    icon: '🏊',
    hex: '#4a86ef',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 30 },
  },

  // Mind
  {
    category: 'Mind',
    name: 'Meditate',
    icon: '🌿',
    hex: '#22b3a6',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 10 },
  },
  {
    category: 'Mind',
    name: 'Read',
    icon: '📖',
    hex: '#9b7cf0',
    schedule: { type: 'daily' },
    target: { unit: 'pages', qty: 20 },
  },
  { category: 'Mind', name: 'Journal', icon: '📝', hex: '#e0a23a', schedule: { type: 'daily' } },
  {
    category: 'Mind',
    name: 'Learn something',
    icon: '🧠',
    hex: '#4a86ef',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 20 },
  },
  {
    category: 'Mind',
    name: 'No screens at night',
    icon: '📱',
    hex: '#d2774a',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 60 },
  },

  // Lifestyle
  {
    category: 'Lifestyle',
    name: 'Take the sun',
    icon: '🌞',
    hex: '#e0a23a',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 20 },
  },
  {
    category: 'Lifestyle',
    name: 'Tidy up',
    icon: '🧹',
    hex: '#4caf63',
    schedule: { type: 'daily' },
  },
  {
    category: 'Lifestyle',
    name: 'Track spending',
    icon: '💰',
    hex: '#22b3a6',
    schedule: { type: 'daily' },
  },
  {
    category: 'Lifestyle',
    name: 'Practice music',
    icon: '🎸',
    hex: '#ee6d84',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 30 },
  },
  {
    category: 'Lifestyle',
    name: 'Water plants',
    icon: '🌱',
    hex: '#4caf63',
    schedule: { type: 'daily' },
  },
  {
    category: 'Lifestyle',
    name: 'Cold shower',
    icon: '🚿',
    hex: '#3fa9e0',
    schedule: { type: 'daily' },
  },

  // Productivity
  {
    category: 'Productivity',
    name: 'Review tasks',
    icon: '✅',
    hex: '#4a86ef',
    schedule: { type: 'daily' },
  },
  {
    category: 'Productivity',
    name: 'Deep focus',
    icon: '🎯',
    hex: '#d2774a',
    schedule: { type: 'daily' },
    target: { unit: 'min', qty: 45 },
  },
  {
    category: 'Productivity',
    name: 'Study',
    icon: '📚',
    hex: '#9b7cf0',
    schedule: { type: 'daily' },
    target: { unit: 'hr', qty: 1 },
  },
  {
    category: 'Productivity',
    name: 'No social media',
    icon: '🚫',
    hex: '#ee6d84',
    schedule: { type: 'daily' },
  },
]

export const SUGGESTION_CATEGORIES = [...new Set(SUGGESTIONS.map((s) => s.category))]
