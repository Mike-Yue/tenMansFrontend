import { STEAM_LOGIN_PATH } from '../api/auth'
import { apiUrl } from '../api/client'

// LoginPage is shown to logged-out visitors. The button starts the Steam OpenID
// flow with a full-page navigation (not fetch) so the browser follows the
// redirect chain to Steam and back.
export function LoginPage() {
  function signIn() {
    window.location.href = apiUrl(STEAM_LOGIN_PATH)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Ambient background glow, matching the app shell. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[520px] w-[960px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[360px] w-[420px] rounded-full bg-sky-500/10 blur-[130px]" />
      </div>

      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 text-base font-black text-white shadow-lg shadow-indigo-500/30">
            10
          </span>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent lowercase">
            deca
          </span>
        </div>

        <h1 className="mt-8 text-lg font-semibold text-slate-100">
          Sign in to continue
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          This site is private. Sign in with your Steam account to view matches,
          players, and season ratings.
        </p>

        <button
          type="button"
          onClick={signIn}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-violet-500 hover:shadow-indigo-500/40"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
            <path d="M11.98 0C5.68 0 .53 4.87.05 11.05l6.44 2.66a3.39 3.39 0 0 1 1.9-.59l.09.01 2.86-4.15v-.06a4.53 4.53 0 0 1 4.53-4.53 4.53 4.53 0 0 1 0 9.06h-.11l-4.08 2.92-.01.08a3.4 3.4 0 0 1-6.79.14L.29 15.2A12 12 0 1 0 11.98 0zM7.54 18.21l-1.47-.61a2.55 2.55 0 0 0 1.33 1.26 2.55 2.55 0 0 0 3.34-1.38 2.55 2.55 0 0 0 0-1.95 2.55 2.55 0 0 0-1.39-1.38 2.55 2.55 0 0 0-1.95.02l1.52.63a1.88 1.88 0 1 1-1.44 3.47zm10.66-7.82a3.02 3.02 0 0 0-3.02-3.02 3.02 3.02 0 0 0-3.02 3.02 3.02 3.02 0 0 0 3.02 3.02 3.02 3.02 0 0 0 3.02-3.02zm-5.28 0a2.27 2.27 0 0 1 2.27-2.27 2.27 2.27 0 0 1 2.27 2.27 2.27 2.27 0 0 1-2.27 2.27 2.27 2.27 0 0 1-2.27-2.27z" />
          </svg>
          Sign in through Steam
        </button>
      </div>
    </div>
  )
}
