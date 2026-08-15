import { createContext, useContext } from 'react'
import type { Me } from '../api/auth'

export interface AuthState {
  // The signed-in user, or null when logged out.
  me: Me | null
  // True while the initial (or a refreshed) session check is in flight.
  loading: boolean
  // Re-check the session with the backend (used after login/logout).
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)

// useAuth reads the auth state provided by <AuthProvider>. Kept in this
// component-free module so the provider file can export only its component
// (satisfies react/only-export-components).
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>')
  }
  return ctx
}
