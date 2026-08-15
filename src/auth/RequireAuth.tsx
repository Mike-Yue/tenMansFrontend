import type { ReactNode } from 'react'
import { Loading } from '../components/States'
import { LoginPage } from '../pages/LoginPage'
import { useAuth } from './auth-context'

// RequireAuth gates the whole app: a spinner while the session is being checked,
// the sign-in screen when logged out, and the app (children) once signed in.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { me, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!me) {
    return <LoginPage />
  }

  return <>{children}</>
}
