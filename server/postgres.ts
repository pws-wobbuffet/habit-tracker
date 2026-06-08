// PostgreSQL backend using the `pg` package
// Install: pnpm add pg @types/pg  (in server/)
import type { CompletionQuery, Completion, Habit, UserProfile } from './types'

// Lazy import to avoid hard dep when using sqlite backend
let pool: unknown

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool as Awaited<ReturnType<(typeof import('pg'))['Pool']['prototype']['query']>> & {
    query: (...args: unknown[]) => Promise<{ rows: unknown[] }>
  }
}

export async function getHabits(): Promise<Habit[]> {
  const p = await getPool()
  const { rows } = await p.query('SELECT data FROM habits')
  return rows.map((r: { data: string }) => JSON.parse(r.data))
}

export async function putHabit(habit: Habit): Promise<void> {
  const p = await getPool()
  await p.query(
    'INSERT INTO habits (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2',
    [habit.id, JSON.stringify(habit)],
  )
}

export async function deleteHabit(id: string): Promise<void> {
  const p = await getPool()
  await p.query('DELETE FROM habits WHERE id = $1', [id])
}

export async function getCompletions(q?: CompletionQuery): Promise<Completion[]> {
  const p = await getPool()
  const clauses: string[] = ['1=1']
  const params: string[] = []
  if (q?.habitId) {
    clauses.push(`habit_id = $${params.push(q.habitId)}`)
  }
  if (q?.date) {
    clauses.push(`date = $${params.push(q.date)}`)
  }
  const { rows } = await p.query(
    `SELECT data FROM completions WHERE ${clauses.join(' AND ')}`,
    params,
  )
  return rows.map((r: { data: string }) => JSON.parse(r.data))
}

export async function putCompletion(c: Completion): Promise<void> {
  const p = await getPool()
  await p.query(
    'INSERT INTO completions (id, habit_id, date, data) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET data = $4',
    [c.id, c.habitId, c.date, JSON.stringify(c)],
  )
}

export async function deleteCompletion(id: string): Promise<void> {
  const p = await getPool()
  await p.query('DELETE FROM completions WHERE id = $1', [id])
}

export async function getProfile(): Promise<UserProfile | null> {
  const p = await getPool()
  const { rows } = await p.query('SELECT data FROM profile WHERE id = $1', ['user'])
  return rows[0] ? JSON.parse(rows[0].data) : null
}

export async function putProfile(profile: UserProfile): Promise<void> {
  const p = await getPool()
  await p.query(
    'INSERT INTO profile (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2',
    ['user', JSON.stringify(profile)],
  )
}
