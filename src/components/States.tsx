import { ApiError } from '../api/client'

export function Loading() {
  return (
    <div className="flex items-center gap-3 py-20 text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400/70 border-t-transparent" />
      <span className="text-sm">Loading…</span>
    </div>
  )
}

export function NotImplemented() {
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
          ⚠
        </span>
        <h2 className="text-lg font-semibold text-amber-200">
          Not implemented yet
        </h2>
      </div>
      <p className="mt-3 text-sm text-amber-200/70">
        This endpoint returns{' '}
        <code className="rounded bg-amber-400/10 px-1.5 py-0.5 font-mono text-amber-200">
          501 Not Implemented
        </code>
        . The backend stub still needs its query filled in.
      </p>
    </div>
  )
}

export function ErrorState({ error }: { error: unknown }) {
  // A 501 has a dedicated, friendlier state.
  if (error instanceof ApiError && error.status === 501) {
    return <NotImplemented />
  }

  const status = error instanceof ApiError ? error.status : undefined
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred.'

  return (
    <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/15 text-red-300">
          ✕
        </span>
        <h2 className="text-lg font-semibold text-red-200">
          {status ? `Request failed (${status})` : 'Request failed'}
        </h2>
      </div>
      <p className="mt-3 text-sm text-red-200/70">{message}</p>
      <p className="mt-2 text-xs text-red-200/50">
        Is the Go backend running on{' '}
        <code className="font-mono">localhost:8080</code>?
      </p>
    </div>
  )
}

export function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center text-slate-400">
      {message}
    </div>
  )
}
