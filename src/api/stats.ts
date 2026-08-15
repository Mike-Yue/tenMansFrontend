import { apiGet } from './client'
import type { PlayerStats } from './types'

// GET /api/users/{id}/stats — aggregated stats for a user (by Steam ID). Pass a
// seasonId to scope to one season; omit it for all-time.
export function getUserStats(
  steamId: string,
  seasonId?: number,
): Promise<PlayerStats> {
  const query =
    seasonId !== undefined ? `?season=${encodeURIComponent(seasonId)}` : ''
  return apiGet<PlayerStats>(
    `/api/users/${encodeURIComponent(steamId)}/stats${query}`,
  )
}
