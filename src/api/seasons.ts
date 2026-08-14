import { apiDelete, apiGet, apiPost } from './client'
import type { Season } from './types'

// GET /api/seasons — list all seasons, newest first.
export function listSeasons(): Promise<Season[]> {
  return apiGet<Season[]>('/api/seasons')
}

// POST /api/seasons — create a season. Dates are "YYYY-MM-DD" strings. The
// backend validates the format/order and returns the created season.
export function createSeason(
  name: string,
  startAt: string,
  endAt: string,
): Promise<Season> {
  return apiPost<Season>('/api/seasons', { name, startAt, endAt })
}

// DELETE /api/seasons/{id} — only succeeds if no matches reference the season
// (the backend returns 409 otherwise).
export function deleteSeason(id: number): Promise<void> {
  return apiDelete<void>(`/api/seasons/${id}`)
}
