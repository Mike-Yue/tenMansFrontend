import { Link, useParams } from 'react-router-dom'
import { getUser } from '../api/users'
import { getUserStats } from '../api/stats'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, Loading } from '../components/States'
import { Field } from '../components/Field'
import { StatsPanel } from '../components/StatsPanel'
import { formatDateTime } from '../format'

export function UserDetailPage() {
  const { steamId = '' } = useParams()

  // The profile and stats endpoints are fetched independently so the stats panel
  // renders even if the profile endpoint is unavailable (and vice versa).
  const profile = useAsync(() => getUser(steamId), [steamId])
  const stats = useAsync(() => getUserStats(steamId), [steamId])

  return (
    <section>
      <Link
        to="/users"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
      >
        <span aria-hidden>←</span> Back to users
      </Link>
      <h1 className="mt-3 mb-8 text-3xl font-bold tracking-tight text-white">
        User
      </h1>

      {/* Profile */}
      {profile.loading && <Loading />}
      {!profile.loading && profile.error != null && (
        <ErrorState error={profile.error} />
      )}
      {!profile.loading && !profile.error && profile.data && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <dl className="grid gap-3 sm:grid-cols-2">
            <Field label="ID" value={String(profile.data.id)} />
            <Field label="Username" value={profile.data.steamUsername ?? '—'} />
            <Field label="Steam ID" value={profile.data.steamId} mono />
            <Field label="Created" value={formatDateTime(profile.data.createdAt)} />
          </dl>
        </div>
      )}

      {/* Stats */}
      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold text-white">Stats</h2>
        <p className="mt-0.5 text-sm text-slate-400">
          All-time · across all games
        </p>
      </div>
      {stats.loading && <Loading />}
      {!stats.loading && stats.error != null && (
        <ErrorState error={stats.error} />
      )}
      {!stats.loading && !stats.error && stats.data && (
        <StatsPanel stats={stats.data} />
      )}
    </section>
  )
}
