import { Link } from 'react-router-dom'
import { listMatches } from '../api/matches'
import { useAsync } from '../hooks/useAsync'
import { Empty, ErrorState, Loading } from '../components/States'
import { StatusBadge } from '../components/StatusBadge'
import { formatDateTime } from '../format'
import type { Match } from '../api/types'

const cards = [
  {
    to: '/matches',
    title: 'Matches',
    description: 'Browse every game — maps, scores, and full scoreboards.',
  },
  {
    to: '/users',
    title: 'Players',
    description: "See who's playing and their all-time stats and ratings.",
  },
  {
    to: '/seasons',
    title: 'Seasons',
    description: 'Manage competitive periods that matches and ratings belong to.',
  },
]

// Newest first, by when the match was played (falling back to upload time).
const matchDate = (m: Match) => m.playedAt ?? m.createdAt ?? ''

export function HomePage() {
  const { data, error, loading } = useAsync(() => listMatches(), [])
  const recent = [...(data ?? [])]
    .sort((a, b) => matchDate(b).localeCompare(matchDate(a)))
    .slice(0, 5)

  return (
    <section>
      {/* Hero banner */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-12">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 text-lg font-black text-white shadow-lg shadow-indigo-500/30">
            10
          </span>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent lowercase">
            deca
          </span>
        </div>
        <p className="mt-4 max-w-xl text-lg text-slate-300">
          Ten-mans, tracked. Match history, per-season ratings, and the numbers
          that settle the arguments.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/matches"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90"
          >
            View matches
          </Link>
          <Link
            to="/users"
            className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]"
          >
            Players
          </Link>
        </div>
      </div>

      {/* Quick navigation cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <span className="text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-300">
                →
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-400">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent matches */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent matches</h2>
          <Link
            to="/matches"
            className="text-sm text-slate-400 transition-colors hover:text-slate-100"
          >
            View all →
          </Link>
        </div>

        {loading && <Loading />}
        {!loading && error != null && <ErrorState error={error} />}
        {!loading && !error && recent.length === 0 && (
          <Empty message="No matches yet." />
        )}
        {!loading && !error && recent.length > 0 && (
          <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            {recent.map((m) => (
              <Link
                key={m.id}
                to={`/matches/${m.id}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-white/[0.04]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-medium text-white">
                    {m.map ?? <span className="text-slate-500">—</span>}
                  </span>
                  <span className="truncate text-sm text-slate-400">
                    {formatDateTime(m.playedAt ?? m.createdAt)}
                  </span>
                </div>
                <StatusBadge status={m.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
