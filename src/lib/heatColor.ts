export function heatColor(cell: { pct: number; due: number; future?: boolean }): string {
  if (cell.future) return 'transparent'
  if (cell.due === 0 || cell.pct === 0) return 'var(--surface-2)'
  const op = 0.28 + (cell.pct / 100) * 0.72
  return `color-mix(in srgb, var(--accent) ${Math.round(op * 100)}%, var(--surface-2))`
}
