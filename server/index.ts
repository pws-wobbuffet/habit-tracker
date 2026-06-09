import * as sqlite from './sqlite'
import * as postgres from './postgres'
import type { CompletionQuery } from './types'

const backend = process.env.BACKEND === 'postgres' ? postgres : sqlite

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

Bun.serve({
  port: Number(process.env.PORT ?? 3001),
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

    // Habits
    if (path === '/habits' && method === 'GET') return json(await backend.getHabits())
    if (/^\/habits\/[^/]+$/.test(path) && method === 'PUT') {
      const habit = await req.json()
      await backend.putHabit(habit)
      return json({ ok: true })
    }
    if (/^\/habits\/[^/]+$/.test(path) && method === 'DELETE') {
      const id = path.split('/').pop()!
      await backend.deleteHabit(id)
      return json({ ok: true })
    }

    // Completions
    if (path === '/completions' && method === 'GET') {
      const q: CompletionQuery = {
        habitId: url.searchParams.get('habitId') ?? undefined,
        date: url.searchParams.get('date') ?? undefined,
      }
      return json(await backend.getCompletions(q))
    }
    if (/^\/completions\/[^/]+$/.test(path) && method === 'PUT') {
      const completion = await req.json()
      await backend.putCompletion(completion)
      return json({ ok: true })
    }
    if (/^\/completions\/[^/]+$/.test(path) && method === 'DELETE') {
      const id = path.split('/').pop()!
      await backend.deleteCompletion(id)
      return json({ ok: true })
    }

    // Profile
    if (path === '/profile' && method === 'GET') return json(await backend.getProfile())
    if (path === '/profile' && method === 'PUT') {
      const profile = await req.json()
      await backend.putProfile(profile)
      return json({ ok: true })
    }

    return new Response('Not found', { status: 404 })
  },
})

console.log(
  `Habitus server running on :${process.env.PORT ?? 3001} (${process.env.BACKEND ?? 'sqlite'})`,
)
