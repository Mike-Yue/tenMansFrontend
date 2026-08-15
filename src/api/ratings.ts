import { apiGet } from './client'
import type { PlayerSeasonRating } from './types'

// GET /api/users/{id}/ratings — a player's per-season ratings (by Steam ID).
export function getUserRatings(steamId: string): Promise<PlayerSeasonRating[]> {
  return apiGet<PlayerSeasonRating[]>(
    `/api/users/${encodeURIComponent(steamId)}/ratings`,
  )
}
