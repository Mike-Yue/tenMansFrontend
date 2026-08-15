import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getUser } from '../api/users'
import { getUserStats } from '../api/stats'
import { getUserRatings } from '../api/ratings'
import { listSeasons } from '../api/seasons'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, Loading } from '../components/States'
import { Field } from '../components/Field'
import { Cell, Row, Table } from '../components/Table'
import { StatsPanel } from '../components/StatsPanel'
import { formatDateTime } from '../format'

export function UserDetailPage() {
  const { steamId = '' } = useParams()

  // The profile, stats, and ratings endpoints are fetched independently so each
  // section renders even if another endpoint is unavailable.
  const profile = useAsync(() => getUser(steamId), [steamId])
  const ratings = useAsync(() => getUserRatings(steamId), [steamId])

  // Stats are scoped to a selected season (default: the latest season, or all-time
  // when none exist). null = not yet defaulted.
  const seasons = useAsync(() => listSeasons(), [])
  const [seasonId, setSeasonId] = useState<number | 'all' | null>(null)
  useEffect(() => {
    if (seasonId === null && !seasons.loading) {
      const latest =
        !seasons.error && seasons.data && seasons.data.length > 0
          ? seasons.data[0].id
          : 'all'
      setSeasonId(latest)
    }
  }, [seasons.loading, seasons.error, seasons.data, seasonId])

  const statsSeason = seasonId === 'all' || seasonId === null ? undefined : seasonId
  const stats = useAsync(
    () => getUserStats(steamId, statsSeason),
    [steamId, statsSeason],
  )
  const selectedSeasonName =
    statsSeason !== undefined
      ? seasons.data?.find((s) => s.id === statsSeason)?.name
      : undefined

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

      {/* Rating */}
      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold text-white">Rating</h2>
        <p className="mt-0.5 text-sm text-slate-400">Skill rating per season</p>
      </div>
      {ratings.loading && <Loading />}
      {!ratings.loading && ratings.error != null && (
        <ErrorState error={ratings.error} />
      )}
      {!ratings.loading && !ratings.error && ratings.data && (
        ratings.data.length > 0 ? (
          <Table columns={['Season', 'Rating', 'Games']}>
            {ratings.data.map((r) => (
              <Row key={r.seasonId}>
                <Cell>
                  <span className="font-medium text-white">{r.seasonName}</span>
                </Cell>
                <Cell>
                  <span className="font-semibold text-indigo-300">{r.rating}</span>
                </Cell>
                <Cell>
                  <span className="text-slate-400">{r.gamesPlayed}</span>
                </Cell>
              </Row>
            ))}
          </Table>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-slate-400">
            No rated games yet.
          </div>
        )
      )}

      {/* Stats */}
      <div className="mt-10 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Stats</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            {selectedSeasonName
              ? `Season ${selectedSeasonName}`
              : 'All time · across all games'}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <span>Season</span>
          <select
            value={seasonId ?? 'all'}
            onChange={(e) =>
              setSeasonId(
                e.target.value === 'all' ? 'all' : Number(e.target.value),
              )
            }
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-100 focus:border-indigo-400/40 focus:ring-1 focus:ring-indigo-400/30 focus:outline-none [color-scheme:dark]"
          >
            <option value="all" className="bg-[#0e0f1a] text-slate-100">
              All time
            </option>
            {seasons.data?.map((s) => (
              <option
                key={s.id}
                value={s.id}
                className="bg-[#0e0f1a] text-slate-100"
              >
                Season {s.name}
              </option>
            ))}
          </select>
        </label>
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
