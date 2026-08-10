import { apiGet } from './client'
import type { Match } from './types'

// GET /api/matches?season={id} — season is optional; omitting it returns all.
export function listMatches(seasonId?: number): Promise<Match[]> {
  const query =
    seasonId !== undefined ? `?season=${encodeURIComponent(seasonId)}` : ''
  return apiGet<Match[]>(`/api/matches${query}`)
}

// GET /api/matches/{matchId} — a single match by id.
export function getMatch(matchId: number): Promise<Match> {
  return apiGet<Match>(`/api/matches/${matchId}`)
}
