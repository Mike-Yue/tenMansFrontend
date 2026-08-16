import { NavLink, Outlet } from 'react-router-dom'
import { logout } from '../api/auth'
import { useAuth } from '../auth/auth-context'

const linkBase =
  'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? `${linkBase} bg-white/10 text-white shadow-sm ring-1 ring-white/10`
    : `${linkBase} text-slate-400 hover:bg-white/5 hover:text-slate-100`
}

export function Layout() {
  const { me, refresh } = useAuth()

  async function handleSignOut() {
    logout()
    // Re-check the session; with the token cleared this drops back to the
    // sign-in screen.
    await refresh()
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[520px] w-[960px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[360px] w-[420px] rounded-full bg-sky-500/10 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#06070d]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 text-sm font-black text-white shadow-lg shadow-indigo-500/30">
              10
            </span>
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-xl font-bold tracking-tight text-transparent lowercase">
              deca
            </span>
          </NavLink>
          <nav className="flex gap-1">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/matches" className={navClass}>
              Matches
            </NavLink>
            <NavLink to="/users" className={navClass}>
              Users
            </NavLink>
            <NavLink to="/seasons" className={navClass}>
              Seasons
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              {me?.avatarUrl && (
                <img
                  src={me.avatarUrl}
                  alt=""
                  className="h-7 w-7 rounded-full ring-1 ring-white/10"
                />
              )}
              <span className="hidden max-w-[12rem] truncate text-xs text-slate-400 sm:inline">
                {me?.steamUsername ?? me?.steamId}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-slate-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
