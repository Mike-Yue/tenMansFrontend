import { apiDelete, apiGet } from './client'
import type { User } from './types'

// GET /api/users — list all users.
export function listUsers(): Promise<User[]> {
  return apiGet<User[]>('/api/users')
}

// GET /api/users/{id} — the id is the user's Steam ID.
export function getUser(steamId: string): Promise<User> {
  return apiGet<User>(`/api/users/${encodeURIComponent(steamId)}`)
}

// DELETE /api/users/{id} — the id is the user's Steam ID. Only succeeds if the
// user has no associated stats (the backend returns 409 otherwise).
export function deleteUser(steamId: string): Promise<void> {
  return apiDelete<void>(`/api/users/${encodeURIComponent(steamId)}`)
}
