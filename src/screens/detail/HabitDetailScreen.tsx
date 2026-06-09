import { useNavigate, useParams } from 'react-router'
import { useHabitsStore } from '../../store/habits'
import { useCompletionsStore } from '../../store/completions'
import { useUIStore } from '../../store/ui'
import { scheduleLabel } from '../../lib/schedule'
import { useHabitStreak, useGlobalBestStreak } from '../../hooks/useProgress'
import { Area } from '../../components/charts/Area'
import { ChevLeftIcon, StarFillIcon, StarIcon, TrashIcon } from '../../components/icons'

function BestStreakDisplay() {
  const best = useGlobalBestStreak()
  return <>{best}d</>
}

export default function HabitDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const habit = useHabitsStore((s) => s.habits.find((h) => h.id === id))
  const deleteHabit = useHabitsStore((s) => s.deleteHabit)
  const toggleFavorite = useHabitsStore((s) => s.toggleFavorite)
  const allCompletions = useCompletionsStore((s) => s.completions)
  const completions = allCompletions.filter((c) => c.habitId === id)
  const pushToast = useUIStore((s) => s.pushToast)
  const streak = useHabitStreak(id ?? '')

  if (!habit) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--ink-3)',
        }}
      >
        Habit not found
      </div>
    )
  }

  const sorted = [...completions].sort((a, b) => b.date.localeCompare(a.date))

  // Build 12-week sparkline
  const weeks12: Array<{ pct: number }> = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let w = 11; w >= 0; w--) {
    let done = 0
    for (let d = 0; d < 7; d++) {
      const day = new Date(today)
      day.setDate(today.getDate() - w * 7 - d)
      const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
      if (completions.some((c) => c.date === dateStr)) done++
    }
    weeks12.push({ pct: Math.round((done / 7) * 100) })
  }

  // 30-day pct
  const today2 = new Date()
  const ago30 = new Date(today2)
  ago30.setDate(today2.getDate() - 30)
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const recent30 = completions.filter((c) => c.date >= fmt(ago30))
  const pct30 = Math.round((recent30.length / 30) * 100)

  async function handleDelete() {
    const habitId = habit!.id
    const habitName = habit!.name
    await deleteHabit(habitId)
    pushToast(`"${habitName}" deleted`, 'info')
    navigate('/')
  }

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevLeftIcon size={20} />
        </button>
        <button
          onClick={() => toggleFavorite(habit.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: habit.isFavorite ? '#e6a93a' : 'var(--ink-3)',
          }}
        >
          {habit.isFavorite ? <StarFillIcon size={22} /> : <StarIcon size={22} />}
        </button>
      </div>

      <div className="scrollable" style={{ flex: 1, padding: '20px 18px 80px' }}>
        {/* Habit identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 18,
              background: `color-mix(in srgb, ${habit.hex} 18%, var(--surface))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              flexShrink: 0,
              border: '1px solid var(--line)',
            }}
          >
            {habit.icon}
          </div>
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
                margin: '0 0 4px',
              }}
            >
              {habit.name}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              {scheduleLabel(habit.schedule)}
            </div>
          </div>
        </div>

        {/* 4 stat chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              background: 'var(--surface-2)',
              borderRadius: 12,
              padding: '12px 8px',
            }}
          >
            <div className="num" style={{ fontSize: 20, color: 'var(--ink)' }}>
              {streak}d
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>Streak</div>
          </div>
          <div
            style={{
              textAlign: 'center',
              background: 'var(--surface-2)',
              borderRadius: 12,
              padding: '12px 8px',
            }}
          >
            <div className="num" style={{ fontSize: 20, color: 'var(--ink)' }}>
              <BestStreakDisplay />
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>Best</div>
          </div>
          <div
            style={{
              textAlign: 'center',
              background: 'var(--surface-2)',
              borderRadius: 12,
              padding: '12px 8px',
            }}
          >
            <div className="num" style={{ fontSize: 20, color: 'var(--ink)' }}>
              {completions.length}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>Total</div>
          </div>
          <div
            style={{
              textAlign: 'center',
              background: 'var(--surface-2)',
              borderRadius: 12,
              padding: '12px 8px',
            }}
          >
            <div className="num" style={{ fontSize: 20, color: 'var(--ink)' }}>
              {pct30}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>30d</div>
          </div>
        </div>

        {/* 12-week sparkline */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Last 12 weeks
          </div>
          <Area data={weeks12} color={habit.hex} height={80} />
        </div>

        {/* History */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Completion history
          </div>
          {sorted.length === 0 && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--ink-3)',
                textAlign: 'center',
                padding: '16px 0',
              }}
            >
              No completions yet
            </p>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            {sorted.map((c) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: habit.hex,
                    marginTop: 5,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
                    {c.date}
                  </div>
                  {c.note && (
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                      {c.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 14,
            border: 'none',
            background: 'rgba(224,88,88,.1)',
            color: '#e05858',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <TrashIcon size={16} />
          Delete habit
        </button>
      </div>
    </div>
  )
}
