import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMatch, listMatches } from '../api/matches'
import { useAsync } from '../hooks/useAsync'
import { Cell, Row, Table } from '../components/Table'
import { Empty, ErrorState, Loading } from '../components/States'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'

export function MatchesPage() {
  const navigate = useNavigate()
  // Controlled season filter. Empty string = no filter (all seasons).
  const [seasonInput, setSeasonInput] = useState('')

  // Bumping refreshKey re-runs the list query (e.g. after creating a match).
  const [refreshKey, setRefreshKey] = useState(0)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const seasonId = seasonInput.trim() === '' ? undefined : Number(seasonInput)

  const { data, error, loading } = useAsync(
    () => listMatches(seasonId),
    [seasonId, refreshKey],
  )

  async function handleCreate() {
    setCreating(true)
    setCreateError(null)
    try {
      await createMatch()
      setRefreshKey((k) => k + 1)
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create match.')
    } finally {
      setCreating(false)
    }
  }

  const createButton = (
    <button
      type="button"
      onClick={handleCreate}
      disabled={creating}
      className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {creating ? 'Creating…' : '+ New match'}
    </button>
  )

  const seasonFilter = (
    <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pr-2 pl-4 text-sm text-slate-400 focus-within:border-indigo-400/40 focus-within:ring-1 focus-within:ring-indigo-400/30">
      <span>Season</span>
      <input
        type="number"
        min={1}
        value={seasonInput}
        onChange={(e) => setSeasonInput(e.target.value)}
        placeholder="all"
        className="w-16 rounded-full bg-transparent px-2 py-0.5 text-center text-slate-100 placeholder:text-slate-600 focus:outline-none"
      />
    </label>
  )

  return (
    <section>
      <PageHeader
        title="Matches"
        subtitle="Games played across all seasons"
        actions={
          <>
            {seasonFilter}
            {createButton}
          </>
        }
      />

      {createError != null && (
        <p className="mb-4 text-sm text-red-300">{createError}</p>
      )}

      {loading && <Loading />}
      {!loading && error != null && <ErrorState error={error} />}
      {!loading && !error && data && data.length === 0 && (
        <Empty
          message={
            seasonId !== undefined
              ? `No matches found for season ${seasonId}.`
              : 'No matches found.'
          }
        />
      )}
      {!loading && !error && data && data.length > 0 && (
        <Table columns={['ID', 'Map', 'Played', 'Season', 'Rounds', 'Status']}>
          {data.map((match) => (
            <Row
              key={match.id}
              onClick={() => navigate(`/matches/${match.id}`)}
            >
              <Cell>
                <span className="text-slate-500">#{match.id}</span>
              </Cell>
              <Cell>
                <span className="font-medium text-white">
                  {match.map ?? <span className="text-slate-500">—</span>}
                </span>
              </Cell>
              <Cell>
                <span className="text-slate-400">{match.playedAt ?? '—'}</span>
              </Cell>
              <Cell>{match.seasonId}</Cell>
              <Cell>{match.totalRounds ?? '—'}</Cell>
              <Cell>
                <StatusBadge status={match.status} />
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </section>
  )
}
