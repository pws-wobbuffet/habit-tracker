const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function todayStr(): string {
  return formatDate(new Date())
}

export function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayStr()
}

export function isPast(dateStr: string): boolean {
  return dateStr < todayStr()
}

// Returns 7 dates: the week containing today (Mon -> Sun)
export function getWeekDays(): Date[] {
  const today = new Date()
  const dow = today.getDay() // 0=Sun
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function dayLetter(d: Date): string {
  return DAY_LETTERS[d.getDay()]
}

// "Monday, Jun 9"
export function formatDisplayDate(d: Date): string {
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

// Motivational greetings by time of day
export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function startOfWeek(d: Date): Date {
  // Monday-start
  const x = new Date(d)
  const wd = (x.getDay() + 6) % 7
  return addDays(x, -wd)
}

export function isSameDay(a: Date, b: Date): boolean {
  return formatDate(a) === formatDate(b)
}

// "Mon, Jun 9"
export function formatShort(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// "Monday, June 9"
export function formatLong(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
