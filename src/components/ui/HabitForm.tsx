import { useState } from 'react'
import type { Habit, HabitTarget, Schedule } from '../../types'
import { scheduleLabel } from '../../lib/schedule'
import { SUGGESTIONS, SUGGESTION_CATEGORIES } from '../../lib/suggestions'
import { EmojiPicker } from './EmojiPicker'
import { ColorPicker } from './ColorPicker'
import { ScheduleEditor } from './ScheduleEditor'
import { StarFillIcon, StarIcon, ChevLeftIcon } from '../icons'

const UNITS: Array<{
  id: string; label: string; short: string
  min: number; max: number; step: number; def: number
}> = [
  { id: 'min',   label: 'Minutes',  short: 'min',   min: 5,    max: 180,   step: 5,    def: 30   },
  { id: 'hr',    label: 'Hours',    short: 'hr',    min: 0.5,  max: 8,     step: 0.5,  def: 1    },
  { id: 'L',     label: 'Liters',   short: 'L',     min: 0.25, max: 4,     step: 0.25, def: 2    },
  { id: 'ml',    label: 'ml',       short: 'ml',    min: 100,  max: 2000,  step: 100,  def: 500  },
  { id: 'km',    label: 'km',       short: 'km',    min: 0.5,  max: 30,    step: 0.5,  def: 5    },
  { id: 'mi',    label: 'Miles',    short: 'mi',    min: 0.5,  max: 20,    step: 0.5,  def: 3    },
  { id: 'x',     label: 'Times',    short: '×',     min: 1,    max: 30,    step: 1,    def: 3    },
  { id: 'reps',  label: 'Reps',     short: 'reps',  min: 5,    max: 100,   step: 5,    def: 20   },
  { id: 'pages', label: 'Pages',    short: 'pg',    min: 5,    max: 100,   step: 5,    def: 20   },
  { id: 'steps', label: 'Steps',    short: 'k',     min: 1,    max: 20,    step: 0.5,  def: 8    },
  { id: 'kcal',  label: 'Calories', short: 'kcal',  min: 50,   max: 1000,  step: 50,   def: 300  },
]

function formatQty(unit: typeof UNITS[number], qty: number): string {
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
  const [selectedUnit, setSelectedUnit] = useState<typeof UNITS[number]>(
    initial?.target ? (UNITS.find(u => u.id === initial.target!.unit) ?? UNITS[0]) : UNITS[0]
  )
  const [qty, setQty] = useState<number>(initial?.target?.qty ?? UNITS[0].def)

  function applySuggestion(s: typeof SUGGESTIONS[number]) {
    setName(s.name)
    setIcon(s.icon)
    setHex(s.hex)
    setSchedule(s.schedule)
    if (s.target) {
      setTargetEnabled(true)
      const u = UNITS.find(u => u.id === s.target!.unit) ?? UNITS[0]
      setSelectedUnit(u)
      setQty(s.target.qty)
    } else {
      setTargetEnabled(false)
    }
    setSuggestionsOpen(false)
  }

  function handleUnitChange(unit: typeof UNITS[number]) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Suggestions dropdown */}
      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'var(--surface)',
        }}
      >
        <button
          onClick={() => setSuggestionsOpen(!suggestionsOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '13px 16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink)',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <span>✨ Suggestions</span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--ink-3)',
              transform: suggestionsOpen ? 'rotate(-90deg)' : 'rotate(90deg)',
              transition: 'transform .2s',
            }}
          >
            <ChevLeftIcon size={18} />
          </span>
        </button>

        {suggestionsOpen && (
          <div style={{ borderTop: '1px solid var(--line)', padding: '12px 16px 16px' }}>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
              {SUGGESTION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    border: 'none',
                    background: activeCat === cat ? 'var(--accent)' : 'var(--surface-2)',
                    color: activeCat === cat ? 'var(--on-accent)' : 'var(--ink-2)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Suggestion chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTIONS.filter((s) => s.category === activeCat).map((s) => (
                <button
                  key={s.name}
                  onClick={() => applySuggestion(s)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 13px',
                    borderRadius: 22,
                    border: `1.5px solid var(--line)`,
                    background: `color-mix(in srgb, ${s.hex} 10%, var(--surface))`,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span>{s.name}</span>
                  {s.target && (
                    <span style={{ fontSize: 11, color: s.hex, fontWeight: 700 }}>
                      {s.target.qty}{s.target.unit}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: `color-mix(in srgb, ${hex} 20%, var(--surface))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name || 'New habit'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
            {scheduleLabel(schedule)}
            {targetEnabled && (
              <span style={{ marginLeft: 6, color: 'var(--accent)' }}>
                · {formatQty(selectedUnit, qty)}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isFavorite ? '#e6a93a' : 'var(--ink-3)',
            flexShrink: 0,
            padding: 4,
          }}
        >
          {isFavorite ? <StarFillIcon size={20} /> : <StarIcon size={20} />}
        </button>
      </div>

      {/* Name input */}
      <div>
        <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
          Habit name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run"
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid var(--line)',
            background: 'var(--surface-2)',
            color: 'var(--ink)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Emoji picker */}
      <div>
        <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
          Icon
        </label>
        <EmojiPicker value={icon} onChange={setIcon} />
      </div>

      {/* Color picker */}
      <div>
        <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
          Color
        </label>
        <ColorPicker value={hex} onChange={setHex} />
      </div>

      {/* Schedule editor */}
      <div>
        <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
          Schedule
        </label>
        <ScheduleEditor value={schedule} onChange={setSchedule} />
      </div>

      {/* Target (optional) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: targetEnabled ? 14 : 0 }}>
          <label className="eyebrow">Target (optional)</label>
          <button
            onClick={() => setTargetEnabled(!targetEnabled)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: '1px solid var(--line)',
              background: targetEnabled ? 'var(--accent)' : 'var(--surface-2)',
              color: targetEnabled ? 'var(--on-accent)' : 'var(--ink-2)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background .15s, color .15s',
            }}
          >
            {targetEnabled ? 'On' : 'Off'}
          </button>
        </div>

        {targetEnabled && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Unit grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {UNITS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleUnitChange(u)}
                  style={{
                    padding: '6px 13px',
                    borderRadius: 20,
                    border: `1.5px solid ${selectedUnit.id === u.id ? 'var(--accent)' : 'var(--line)'}`,
                    background: selectedUnit.id === u.id ? 'var(--accent-soft)' : 'var(--surface-2)',
                    color: selectedUnit.id === u.id ? 'var(--accent)' : 'var(--ink-2)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background .12s, border-color .12s, color .12s',
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>

            {/* Quantity slider */}
            <div
              style={{
                background: 'var(--surface-2)',
                borderRadius: 14,
                padding: '16px 18px',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.03em' }}>
                  {qty}
                </span>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-3)', marginLeft: 5 }}>
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
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--ink-3)' }}>
                <span>{selectedUnit.min} {selectedUnit.short}</span>
                <span>{selectedUnit.max} {selectedUnit.short}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 12,
              border: '1px solid var(--line)',
              background: 'var(--surface-2)',
              color: 'var(--ink-2)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          style={{
            flex: 2,
            padding: '12px 0',
            borderRadius: 12,
            border: 'none',
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            fontWeight: 600,
            fontSize: 14,
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            opacity: name.trim() ? 1 : 0.4,
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
