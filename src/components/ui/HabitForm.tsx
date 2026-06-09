import { useState } from 'react'
import type { Habit, HabitTarget, Schedule } from '../../types'
import { scheduleLabel } from '../../lib/schedule'
import { SUGGESTIONS, SUGGESTION_CATEGORIES } from '../../lib/suggestions'
import { EmojiPicker } from './EmojiPicker'
import { ColorPicker } from './ColorPicker'
import { ScheduleEditor } from './ScheduleEditor'
import { StarFillIcon, StarIcon, ChevLeftIcon } from '../icons'

const UNITS: Array<{
  id: string
  label: string
  short: string
  min: number
  max: number
  step: number
  def: number
}> = [
  { id: 'min', label: 'Minutes', short: 'min', min: 5, max: 180, step: 5, def: 30 },
  { id: 'hr', label: 'Hours', short: 'hr', min: 0.5, max: 8, step: 0.5, def: 1 },
  { id: 'L', label: 'Liters', short: 'L', min: 0.25, max: 4, step: 0.25, def: 2 },
  { id: 'ml', label: 'ml', short: 'ml', min: 100, max: 2000, step: 100, def: 500 },
  { id: 'km', label: 'km', short: 'km', min: 0.5, max: 30, step: 0.5, def: 5 },
  { id: 'mi', label: 'Miles', short: 'mi', min: 0.5, max: 20, step: 0.5, def: 3 },
  { id: 'x', label: 'Times', short: '×', min: 1, max: 30, step: 1, def: 3 },
  { id: 'reps', label: 'Reps', short: 'reps', min: 5, max: 100, step: 5, def: 20 },
  { id: 'pages', label: 'Pages', short: 'pg', min: 5, max: 100, step: 5, def: 20 },
  { id: 'steps', label: 'Steps', short: 'k', min: 1, max: 20, step: 0.5, def: 8 },
  { id: 'kcal', label: 'Calories', short: 'kcal', min: 50, max: 1000, step: 50, def: 300 },
]

function formatQty(unit: (typeof UNITS)[number], qty: number): string {
  if (unit.id === 'steps') return `${qty}k steps`
  if (unit.step < 1) return `${qty} ${unit.short}`
  return `${qty} ${unit.short}`
}

interface HabitFormProps {
  initial?: Partial<Habit>
  onSave: (data: Omit<Habit, 'id' | 'createdAt'>) => void
  onCancel?: () => void
  submitLabel?: string
}

export function HabitForm({ initial, onSave, onCancel, submitLabel = 'Save' }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? '🎯')
  const [hex, setHex] = useState(initial?.hex ?? '#4a86ef')
  const [schedule, setSchedule] = useState<Schedule>(initial?.schedule ?? { type: 'daily' })
  const [isFavorite, setIsFavorite] = useState(initial?.isFavorite ?? false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [activeCat, setActiveCat] = useState(SUGGESTION_CATEGORIES[0])
  const [targetEnabled, setTargetEnabled] = useState(!!initial?.target)
  const [selectedUnit, setSelectedUnit] = useState<(typeof UNITS)[number]>(
    initial?.target ? (UNITS.find((u) => u.id === initial.target!.unit) ?? UNITS[0]) : UNITS[0],
  )
  const [qty, setQty] = useState<number>(initial?.target?.qty ?? UNITS[0].def)

  function applySuggestion(s: (typeof SUGGESTIONS)[number]) {
    setName(s.name)
    setIcon(s.icon)
    setHex(s.hex)
    setSchedule(s.schedule)
    if (s.target) {
      setTargetEnabled(true)
      const u = UNITS.find((u) => u.id === s.target!.unit) ?? UNITS[0]
      setSelectedUnit(u)
      setQty(s.target.qty)
    } else {
      setTargetEnabled(false)
    }
    setSuggestionsOpen(false)
  }

  function handleUnitChange(unit: (typeof UNITS)[number]) {
    setSelectedUnit(unit)
    setQty(unit.def)
  }

  function handleSubmit() {
    if (!name.trim()) return
    const target: HabitTarget | undefined = targetEnabled
      ? { unit: selectedUnit.id, qty }
      : undefined
    onSave({ name: name.trim(), icon, hex, schedule, isFavorite, target })
  }

  return (
    <div className="flex flex-col gap-[22px]">
      {/* Suggestions dropdown */}
      <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
        <button
          onClick={() => setSuggestionsOpen(!suggestionsOpen)}
          className="flex w-full cursor-pointer items-center justify-between border-none bg-none px-4 py-[13px] text-sm font-semibold text-ink"
        >
          <span>✨ Suggestions</span>
          <span
            className="flex items-center text-ink-3"
            style={{
              transform: suggestionsOpen ? 'rotate(-90deg)' : 'rotate(90deg)',
              transition: 'transform .2s',
            }}
          >
            <ChevLeftIcon size={18} />
          </span>
        </button>

        {suggestionsOpen && (
          <div className="border-t border-line px-4 pt-3 pb-4">
            {/* Category tabs */}
            <div className="mb-3.5 flex gap-1.5 overflow-x-auto pb-0.5">
              {SUGGESTION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`shrink-0 cursor-pointer rounded-[20px] border-none px-3 py-[5px] text-xs font-semibold whitespace-nowrap ${
                    activeCat === cat ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink-2'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.filter((s) => s.category === activeCat).map((s) => (
                <button
                  key={s.name}
                  onClick={() => applySuggestion(s)}
                  className="flex cursor-pointer items-center gap-[7px] rounded-[22px] border-[1.5px] border-line px-[13px] py-2 text-[13px] font-semibold text-ink"
                  style={{ background: `color-mix(in srgb, ${s.hex} 10%, var(--surface))` }}
                >
                  <span className="text-base">{s.icon}</span>
                  <span>{s.name}</span>
                  {s.target && (
                    <span className="text-[11px] font-bold" style={{ color: s.hex }}>
                      {s.target.qty}
                      {s.target.unit}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview row */}
      <div className="flex items-center gap-3.5">
        <div
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] text-[22px]"
          style={{ background: `color-mix(in srgb, ${hex} 20%, var(--surface))` }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold text-ink">{name || 'New habit'}</div>
          <div className="mt-0.5 text-xs text-ink-3">
            {scheduleLabel(schedule)}
            {targetEnabled && (
              <span className="ml-1.5 text-accent">· {formatQty(selectedUnit, qty)}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="shrink-0 cursor-pointer border-none bg-none p-1"
          style={{ color: isFavorite ? '#e6a93a' : 'var(--ink-3)' }}
        >
          {isFavorite ? <StarFillIcon size={20} /> : <StarIcon size={20} />}
        </button>
      </div>

      {/* Name input */}
      <div>
        <label className="eyebrow mb-2 block">Habit name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run"
          className="w-full rounded-[10px] border border-line bg-surface-2 px-3.5 py-2.5 font-[inherit] text-sm text-ink outline-none"
        />
      </div>

      {/* Emoji picker */}
      <div>
        <label className="eyebrow mb-2 block">Icon</label>
        <EmojiPicker value={icon} onChange={setIcon} />
      </div>

      {/* Color picker */}
      <div>
        <label className="eyebrow mb-2 block">Color</label>
        <ColorPicker value={hex} onChange={setHex} />
      </div>

      {/* Schedule editor */}
      <div>
        <label className="eyebrow mb-2 block">Schedule</label>
        <ScheduleEditor value={schedule} onChange={setSchedule} />
      </div>

      {/* Target (optional) */}
      <div>
        <div className={`flex items-center justify-between ${targetEnabled ? 'mb-3.5' : ''}`}>
          <label className="eyebrow">Target (optional)</label>
          <button
            onClick={() => setTargetEnabled(!targetEnabled)}
            className={`cursor-pointer rounded-[20px] border border-line px-3 py-1 text-xs font-semibold transition-[background,color] duration-150 ${
              targetEnabled ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink-2'
            }`}
          >
            {targetEnabled ? 'On' : 'Off'}
          </button>
        </div>

        {targetEnabled && (
          <div className="flex flex-col gap-4">
            {/* Unit grid */}
            <div className="flex flex-wrap gap-[7px]">
              {UNITS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleUnitChange(u)}
                  className="cursor-pointer rounded-[20px] border-[1.5px] px-[13px] py-1.5 text-[13px] font-semibold transition-[background,border-color,color] duration-100"
                  style={{
                    borderColor: selectedUnit.id === u.id ? 'var(--accent)' : 'var(--line)',
                    background:
                      selectedUnit.id === u.id ? 'var(--accent-soft)' : 'var(--surface-2)',
                    color: selectedUnit.id === u.id ? 'var(--accent)' : 'var(--ink-2)',
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>

            {/* Quantity slider */}
            <div className="rounded-[14px] border border-line bg-surface-2 px-[18px] py-4">
              <div className="mb-3.5 text-center">
                <span className="text-[36px] font-extrabold tracking-[-0.03em] text-accent">
                  {qty}
                </span>
                <span className="ml-[5px] text-base font-semibold text-ink-3">
                  {selectedUnit.short}
                </span>
              </div>
              <input
                type="range"
                min={selectedUnit.min}
                max={selectedUnit.max}
                step={selectedUnit.step}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink-3">
                <span>
                  {selectedUnit.min} {selectedUnit.short}
                </span>
                <span>
                  {selectedUnit.max} {selectedUnit.short}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2.5">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-[12px] border border-line bg-surface-2 py-3 text-sm font-semibold text-ink-2"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="flex-[2] cursor-pointer rounded-[12px] border-none bg-accent py-3 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
