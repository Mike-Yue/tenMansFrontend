import { Link, useParams } from 'react-router-dom'
import { getMatch } from '../api/matches'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, Loading } from '../components/States'
import { Field } from '../components/Field'
import { TeamScoreboard } from '../components/TeamScoreboard'

export function MatchDetailPage() {
  const { matchId = '' } = useParams()
  const id = Number(matchId)
  const { data, error, loading } = useAsync(() => getMatch(id), [id])

  return (
    <section>
      <Link
        to="/matches"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
      >
        <span aria-hidden>←</span> Back to matches
      </Link>
      <h1 className="mt-3 mb-8 text-3xl font-bold tracking-tight text-white">
        Match
      </h1>

      {loading && <Loading />}
      {!loading && error != null && <ErrorState error={error} />}
      {!loading && !error && data && (
        <>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label="ID" value={String(data.id)} />
              <Field label="Map" value={data.map} />
              <Field label="Played At" value={data.playedAt} />
              <Field label="Uploaded At" value={data.uploadedAt} />
              <Field label="Season" value={String(data.seasonId)} />
              <Field label="Total Rounds" value={String(data.totalRounds)} />
              <Field label="Processed" value={data.processed ? 'Yes' : 'No'} />
            </dl>
          </div>

          <div className="mt-10 mb-4">
            <h2 className="text-xl font-semibold text-white">Scoreboard</h2>
          </div>
          <div className="space-y-8">
            {data.teams.map((team) => (
              <TeamScoreboard key={team.id} team={team} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
