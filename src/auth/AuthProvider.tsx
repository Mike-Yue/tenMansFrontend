import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { getMe, type Me } from '../api/auth'
import { AuthContext } from './auth-context'

// AuthProvider checks the Steam session on mount and exposes it to the app. Any
// failed check (notably ApiError 401 from /api/auth/me) is treated as logged out.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setMe(await getMe())
    } catch {
      setMe(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ me, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
