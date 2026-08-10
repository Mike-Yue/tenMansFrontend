import { apiGet } from './client'
import type { User } from './types'

// GET /api/users — list all users.
export function listUsers(): Promise<User[]> {
  return apiGet<User[]>('/api/users')
}

// GET /api/users/{id} — the id is the user's Steam ID.
export function getUser(steamId: string): Promise<User> {
  return apiGet<User>(`/api/users/${encodeURIComponent(steamId)}`)
}
