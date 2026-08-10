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

// Mirrors the Go matches.MatchResponse DTO (note: uploadHash is intentionally
// omitted by the backend).
export interface Match {
  id: number
  map: string
  playedAt: string
  uploadedAt: string
  processed: boolean
  seasonId: number
  totalRounds: number
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
