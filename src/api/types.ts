// Mirrors the Go users.User JSON shape. steamId is an int64 on the backend and
// can exceed JS's safe-integer range, so it is carried as a string (see the
// BigInt-preserving parser in client.ts).
export interface User {
  id: number
  steamId: string
  steamUsername: string | null
  createdAt: string
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
