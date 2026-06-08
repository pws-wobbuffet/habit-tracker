import { Database } from 'bun:sqlite'
import type { CompletionQuery, Completion, Habit, UserProfile } from './types'

const db = new Database(process.env.DATABASE_FILE ?? 'habits.db')

db.run(`CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
)`)
db.run(`CREATE TABLE IF NOT EXISTS completions (
  id TEXT PRIMARY KEY,
  habit_id TEXT NOT NULL,
  date TEXT NOT NULL,
  data TEXT NOT NULL
)`)
db.run(`CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY DEFAULT 'user',
  data TEXT NOT NULL
)`)

export function getHabits(): Habit[] {
  return db
    .query('SELECT data FROM habits')
    .all()
    .map((r: { data: string }) => JSON.parse(r.data))
}

export function putHabit(habit: Habit): void {
  db.run('INSERT OR REPLACE INTO habits (id, data) VALUES (?, ?)', [
    habit.id,
    JSON.stringify(habit),
  ])
}

export function deleteHabit(id: string): void {
  db.run('DELETE FROM habits WHERE id = ?', [id])
}

export function getCompletions(q?: CompletionQuery): Completion[] {
  let sql = 'SELECT data FROM completions WHERE 1=1'
  const params: string[] = []
  if (q?.habitId) {
    sql += ' AND habit_id = ?'
    params.push(q.habitId)
  }
  if (q?.date) {
    sql += ' AND date = ?'
    params.push(q.date)
  }
  return db
    .query(sql)
    .all(...params)
    .map((r: { data: string }) => JSON.parse(r.data))
}

export function putCompletion(c: Completion): void {
  db.run('INSERT OR REPLACE INTO completions (id, habit_id, date, data) VALUES (?, ?, ?, ?)', [
    c.id,
    c.habitId,
    c.date,
    JSON.stringify(c),
  ])
}

export function deleteCompletion(id: string): void {
  db.run('DELETE FROM completions WHERE id = ?', [id])
}

export function getProfile(): UserProfile | null {
  const row = db.query('SELECT data FROM profile WHERE id = ?').get('user') as {
    data: string
  } | null
  return row ? JSON.parse(row.data) : null
}

export function putProfile(profile: UserProfile): void {
  db.run('INSERT OR REPLACE INTO profile (id, data) VALUES (?, ?)', [
    'user',
    JSON.stringify(profile),
  ])
}
