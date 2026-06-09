import { describe, expect, it } from 'bun:test'
import { generateId } from './uuid'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('generateId', () => {
  it('returns a v4 UUID', () => {
    expect(generateId()).toMatch(UUID_RE)
  })

  it('returns a different value on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})
