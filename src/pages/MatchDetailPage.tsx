import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteMatch, getMatch } from '../api/matches'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, Loading } from '../components/States'
import { Field } from '../components/Field'
import { TeamScoreboard } from '../components/TeamScoreboard'
import { StatusBadge } from '../components/StatusBadge'
import { DeleteButton } from '../components/DeleteButton'
import { formatDateTime } from '../format'

export function MatchDetailPage() {
  const { matchId = '' } = useParams()
  const navigate = useNavigate()
  const id = Number(matchId)
  const { data, error, loading } = useAsync(() => getMatch(id), [id])
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleDelete() {
    if (!window.confirm(`Delete match #${id}?`)) return
    setDeleting(true)
    setActionError(null)
    try {
      await deleteMatch(id)
      navigate('/matches')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete match.')
      setDeleting(false)
    }
  }

  return (
    <section>
      <Link
        to="/matches"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
      >
        <span aria-hidden>←</span> Back to matches
      </Link>
      <div className="mt-3 mb-8 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-white">Match</h1>
        {data && <StatusBadge status={data.status} />}
        {data && (
          <div className="ml-auto">
            <DeleteButton disabled={deleting} onClick={handleDelete} />
          </div>
        )}
      </div>

      {actionError != null && (
        <p className="mb-4 text-sm text-red-300">{actionError}</p>
      )}

      {loading && <Loading />}
      {!loading && error != null && <ErrorState error={error} />}
      {!loading && !error && data && (
        <>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Score"
                value={
                  data.teams.length > 0
                    ? data.teams
                        .map((t) => t.roundsWon)
                        .sort((a, b) => b - a)
                        .join('-')
                    : '—'
                }
              />
              <Field label="Map" value={data.map ?? '—'} />
              <Field label="Played At" value={formatDateTime(data.playedAt)} />
              <Field label="Season" value={String(data.seasonId)} />
            </dl>
          </div>

          <div className="mt-10 mb-4">
            <h2 className="text-xl font-semibold text-white">Scoreboard</h2>
          </div>
          {data.teams.length > 0 ? (
            <div className="space-y-8">
              {data.teams.map((team) => (
                <TeamScoreboard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-slate-400">
              This match hasn't been parsed yet.
            </div>
          )}
        </>
      )}
    </section>
  )
}
