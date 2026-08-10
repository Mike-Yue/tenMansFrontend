import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listMatches } from '../api/matches'
import { useAsync } from '../hooks/useAsync'
import { Cell, Row, Table } from '../components/Table'
import { Empty, ErrorState, Loading } from '../components/States'
import { PageHeader } from '../components/PageHeader'

export function MatchesPage() {
  const navigate = useNavigate()
  // Controlled season filter. Empty string = no filter (all seasons).
  const [seasonInput, setSeasonInput] = useState('')

  const seasonId = seasonInput.trim() === '' ? undefined : Number(seasonInput)

  const { data, error, loading } = useAsync(
    () => listMatches(seasonId),
    [seasonId],
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
        actions={seasonFilter}
      />

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
        <Table
          columns={['ID', 'Map', 'Played', 'Season', 'Rounds', 'Processed']}
        >
          {data.map((match) => (
            <Row
              key={match.id}
              onClick={() => navigate(`/matches/${match.id}`)}
            >
              <Cell>
                <span className="text-slate-500">#{match.id}</span>
              </Cell>
              <Cell>
                <span className="font-medium text-white">{match.map}</span>
              </Cell>
              <Cell>
                <span className="text-slate-400">{match.playedAt}</span>
              </Cell>
              <Cell>{match.seasonId}</Cell>
              <Cell>{match.totalRounds}</Cell>
              <Cell>
                <ProcessedBadge processed={match.processed} />
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </section>
  )
}

function ProcessedBadge({ processed }: { processed: boolean }) {
  return processed ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/20">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Processed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-400 ring-1 ring-white/10">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      Pending
    </span>
  )
}
