/**
 * Formats a numeric age string (e.g. "1.11") into a human-readable Ukrainian label.
 * Format: integer part = years, decimal part = months.
 * Examples: "1.11" → "1 рік 11 місяців", "0.6" → "6 місяців", "3" → "3 роки"
 */
export function formatAge(value: string | null | undefined, fallback = 'Вік уточнюється'): string {
  if (!value || !value.trim()) return fallback

  const match = value.trim().match(/^(\d+)(?:\.(\d+))?$/)
  if (!match) return value

  const years = parseInt(match[1], 10)
  const months = match[2] ? parseInt(match[2], 10) : 0

  const parts: string[] = []

  if (years > 0) {
    const y = years % 10
    const y2 = years % 100
    const label = y2 >= 11 && y2 <= 14 ? 'років' : y === 1 ? 'рік' : y >= 2 && y <= 4 ? 'роки' : 'років'
    parts.push(`${years} ${label}`)
  }

  if (months > 0) {
    const m = months % 10
    const m2 = months % 100
    const label = m2 >= 11 && m2 <= 14 ? 'місяців' : m === 1 ? 'місяць' : m >= 2 && m <= 4 ? 'місяці' : 'місяців'
    parts.push(`${months} ${label}`)
  }

  return parts.length > 0 ? parts.join(' ') : fallback
}
