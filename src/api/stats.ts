import { apiGet } from './client'
import type { PlayerStats } from './types'

// GET /api/users/{id}/stats — aggregated all-time stats for a user (by Steam ID).
export function getUserStats(steamId: string): Promise<PlayerStats> {
  return apiGet<PlayerStats>(
    `/api/users/${encodeURIComponent(steamId)}/stats`,
  )
}
