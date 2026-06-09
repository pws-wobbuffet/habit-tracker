import { describe, expect, it } from 'bun:test'
import { heatColor } from './heatColor'

describe('heatColor', () => {
  it('is transparent for future days', () => {
    expect(heatColor({ pct: 100, due: 3, future: true })).toBe('transparent')
  })

  it('uses the empty surface when nothing was due', () => {
    expect(heatColor({ pct: 0, due: 0 })).toBe('var(--surface-2)')
  })

  it('uses the empty surface at 0% completion', () => {
    expect(heatColor({ pct: 0, due: 3 })).toBe('var(--surface-2)')
  })

  it('blends accent proportionally to completion', () => {
    // op = 0.28 + (50/100) * 0.72 = 0.64 -> 64%
    expect(heatColor({ pct: 50, due: 2 })).toBe(
      'color-mix(in srgb, var(--accent) 64%, var(--surface-2))',
    )
  })

  it('reaches full accent at 100%', () => {
    expect(heatColor({ pct: 100, due: 1 })).toBe(
      'color-mix(in srgb, var(--accent) 100%, var(--surface-2))',
    )
  })
})
