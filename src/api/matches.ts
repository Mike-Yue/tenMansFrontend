import { apiDelete, apiGet, apiPost } from './client'
import type { InitiateUploadResponse, Match, MatchDetail } from './types'

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

// DELETE /api/matches/{matchId} — removes the match and its teams/stats.
export function deleteMatch(matchId: number): Promise<void> {
  return apiDelete<void>(`/api/matches/${matchId}`)
}

// POST /api/matches/random — fabricate a fully formed random match. This is a
// testing-only stand-in for the real upload/parse pipeline. Returns the created
// match.
export function createRandomMatch(): Promise<Match> {
  return apiPost<Match>('/api/matches/random')
}

// POST /api/matches — reserve a pending match for a real demo upload, keyed by
// the demo's content hash (its SHA-256). The backend dedups on the hash and
// returns the reserved match id, its storage key, and a presigned upload URL. The
// match stays `pending` until the parser hydrates it via POST /api/matches/upload.
export function initiateUpload(
  contentHash: string,
  sizeBytes?: number,
): Promise<InitiateUploadResponse> {
  return apiPost<InitiateUploadResponse>('/api/matches', {
    contentHash,
    sizeBytes,
  })
}
