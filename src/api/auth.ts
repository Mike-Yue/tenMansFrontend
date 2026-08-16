import { apiGet } from './client'
import { clearToken } from '../auth/token'

// The signed-in user's identity. Mirrors the Go auth.meResponse DTO. steamId is
// carried as a string for the same BigInt-precision reason as User.steamId.
// steamUsername and avatarUrl come from the Steam Web API (null when it's
// unavailable — e.g. no STEAM_API_KEY on the backend).
export interface Me {
  steamId: string
  steamUsername: string | null
  avatarUrl: string | null
}

// GET /api/auth/me — returns the current user, or throws ApiError(401) when not
// signed in (the gate uses that 401 to show the login screen).
export function getMe(): Promise<Me> {
  return apiGet<Me>('/api/auth/me')
}

// Logout is entirely client-side: tokens are stateless, so signing out just means
// discarding the stored token. Callers should refresh auth state afterwards.
export function logout(): void {
  clearToken()
}

// The backend endpoint that starts the Steam OpenID redirect. This must be a
// full-page navigation (not fetch), so callers assign window.location to it.
export const STEAM_LOGIN_PATH = '/api/auth/steam/login'
