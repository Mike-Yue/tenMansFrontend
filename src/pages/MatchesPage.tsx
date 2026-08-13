import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRandomMatch, initiateUpload, listMatches } from '../api/matches'
import { sha256Hex } from '../api/hash'
import { ApiError } from '../api/client'
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

  // "New match" reserves a pending match from a real .dem upload; the random
  // generator is a separate testing-only path. They track state independently so
  // one running doesn't disable the other.
  const [uploading, setUploading] = useState(false)
  const [creatingRandom, setCreatingRandom] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const seasonId = seasonInput.trim() === '' ? undefined : Number(seasonInput)

  const { data, error, loading } = useAsync(
    () => listMatches(seasonId),
    [seasonId, refreshKey],
  )

  // The real flow: hash the chosen demo client-side, then reserve a pending match
  // keyed by that hash. The match stays `pending` until the parser hydrates it via
  // POST /api/matches/upload.
  //
  // TODO: once the backend presigner is implemented, use the returned uploadUrl to
  // PUT the .dem to storage, then POST /api/matches/{id}/uploaded. For now the
  // presigner is stubbed, so we stop after reserving the pending record.
  async function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    // Reset the input so re-selecting the same file fires onChange again.
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setActionError(null)
    try {
      const contentHash = await sha256Hex(file)
      await initiateUpload(contentHash, file.size)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setActionError('This demo has already been uploaded.')
      } else {
        setActionError(
          err instanceof Error ? err.message : 'Failed to create match.',
        )
      }
    } finally {
      setUploading(false)
    }
  }

  async function handleCreateRandom() {
    setCreatingRandom(true)
    setActionError(null)
    try {
      await createRandomMatch()
      setRefreshKey((k) => k + 1)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to create match.')
    } finally {
      setCreatingRandom(false)
    }
  }

  const createButtons = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".dem"
        onChange={handleFileSelected}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => handleCreateRandom()}
        disabled={creatingRandom}
        className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {creatingRandom ? 'Creating…' : 'Random match generation (testing)'}
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? 'Uploading…' : '+ New match'}
      </button>
    </>
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
            {createButtons}
          </>
        }
      />

      {actionError != null && (
        <p className="mb-4 text-sm text-red-300">{actionError}</p>
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
