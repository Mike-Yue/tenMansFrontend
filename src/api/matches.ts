import { apiGet, apiPost } from './client'
import type { Match, MatchDetail } from './types'

// GET /api/matches?season={id} — season is optional; omitting it returns all.
export function listMatches(seasonId?: number): Promise<Match[]> {
  const query =
    seasonId !== undefined ? `?season=${encodeURIComponent(seasonId)}` : ''
  return apiGet<Match[]>(`/api/matches${query}`)
}

// GET /api/matches/{matchId} — a single match with its teams and player stats.
export function getMatch(matchId: number): Promise<MatchDetail> {
  return apiGet<MatchDetail>(`/api/matches/${matchId}`)
}

// POST /api/matches/random — fabricate a fully formed random match (dev stand-in
// for the real upload/parse pipeline). Returns the created match.
export function createMatch(): Promise<Match> {
  return apiPost<Match>('/api/matches/random')
}
