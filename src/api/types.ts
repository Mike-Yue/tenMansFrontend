// Mirrors the Go users.User JSON shape. steamId is an int64 on the backend and
// can exceed JS's safe-integer range, so it is carried as a string (see the
// BigInt-preserving parser in client.ts).
export interface User {
  id: number
  steamId: string
  steamUsername: string | null
  createdAt: string
}

// Mirrors the Go stats.PlayerStats aggregate (GET /api/users/{id}/stats).
// winrate is a fraction in [0,1]; the UI formats it as a percentage.
export interface PlayerStats {
  kills: number
  deaths: number
  assists: number
  mvps: number
  winrate: number
}

// A match moves through this lifecycle from upload to parsed.
export type MatchStatus =
  | 'pending'
  | 'uploaded'
  | 'processing'
  | 'processed'
  | 'failed'

// Mirrors the Go matches.MatchResponse DTO (note: uploadHash/storageKey are
// intentionally omitted by the backend). The parse-derived fields are null until
// the parser has run.
export interface Match {
  id: number
  map: string | null
  playedAt: string | null
  uploadedAt: string | null
  status: MatchStatus
  seasonId: number
  totalRounds: number | null
  createdAt: string | null
}

// One player's scoreboard line within a team. steamId is carried as a string
// for the same BigInt-precision reason as User.steamId.
export interface PlayerStat {
  playerId: number
  steamId: string
  steamUsername: string | null
  kills: number
  deaths: number
  assists: number
  kdRatio: number
  mvps: number
  damageAssists: number
  flashAssists: number
  headshotKills: number
  totalDamage: number
  utilityDamage: number
  roundsPlayed: number
}

// One side of a match plus its players.
export interface MatchTeam {
  id: number
  teamSlot: string
  startingSide: string
  roundsWon: number
  result: 'win' | 'loss' | 'tie'
  players: PlayerStat[]
}

// Mirrors the Go matches.MatchDetailResponse DTO (GET /api/matches/{matchId}):
// the base match fields plus each team's scoreboard.
export interface MatchDetail extends Match {
  teams: MatchTeam[]
}
