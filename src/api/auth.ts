import { apiGet, apiPost } from './client'

// The signed-in user's identity. Mirrors the Go auth.meResponse DTO. steamId is
// carried as a string for the same BigInt-precision reason as User.steamId.
// steamUsername is null for viewers who have never appeared in a match.
export interface Me {
  steamId: string
  steamUsername: string | null
}

// GET /api/auth/me — returns the current user, or throws ApiError(401) when not
// signed in (the gate uses that 401 to show the login screen).
export function getMe(): Promise<Me> {
  return apiGet<Me>('/api/auth/me')
}

// POST /api/auth/logout — clears the session cookie.
export function logout(): Promise<void> {
  return apiPost<void>('/api/auth/logout')
}

// The backend endpoint that starts the Steam OpenID redirect. This must be a
// full-page navigation (not fetch), so callers assign window.location to it.
export const STEAM_LOGIN_PATH = '/api/auth/steam/login'
