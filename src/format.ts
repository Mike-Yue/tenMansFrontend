// Formatting helpers for values coming off the API.

// formatDateTime renders an ISO 8601 timestamp (e.g. "2026-08-11T21:33:45.545583Z")
// in the browser's local timezone, rounded to the second: "2026-08-11 21:33:45".
//
// Null/empty values render as an em dash. Anything that doesn't parse as a date is
// returned unchanged, so a malformed value degrades to the raw string rather than
// "Invalid Date".
//
// Note: this is for full timestamps only. Date-only values like a season's
// "2026-08-09" must NOT be passed here — parsing a bare date as UTC midnight and
// then shifting to local time can roll it back a day.
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value

  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  return `${date} ${time}`
}
