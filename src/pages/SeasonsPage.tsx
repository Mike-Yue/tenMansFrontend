import { useState, type FormEvent } from 'react'
import { createSeason, listSeasons } from '../api/seasons'
import { ApiError } from '../api/client'
import { useAsync } from '../hooks/useAsync'
import { Cell, Row, Table } from '../components/Table'
import { Empty, ErrorState, Loading } from '../components/States'
import { PageHeader } from '../components/PageHeader'

const inputClass =
  'rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-400/40 focus:ring-1 focus:ring-indigo-400/30 focus:outline-none [color-scheme:dark]'

export function SeasonsPage() {
  // Bumping refreshKey re-runs the list query after a successful create.
  const [refreshKey, setRefreshKey] = useState(0)

  const [name, setName] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { data, error, loading } = useAsync(() => listSeasons(), [refreshKey])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    setFormError(null)
    try {
      await createSeason(name.trim(), startAt, endAt)
      // Reset the form and refresh the list.
      setName('')
      setStartAt('')
      setEndAt('')
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to create season.',
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <section>
      <PageHeader title="Seasons" subtitle="Competitive periods matches belong to" />

      <form
        onSubmit={handleCreate}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm"
      >
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-400">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Season 2"
            required
            className={`${inputClass} w-40`}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-400">Start</span>
          <input
            type="date"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-400">End</span>
          <input
            type="date"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          disabled={creating}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? 'Creating…' : '+ New season'}
        </button>
        {formError != null && (
          <p className="w-full text-sm text-red-300">{formError}</p>
        )}
      </form>

      {loading && <Loading />}
      {!loading && error != null && <ErrorState error={error} />}
      {!loading && !error && data && data.length === 0 && (
        <Empty message="No seasons yet. Create one above." />
      )}
      {!loading && !error && data && data.length > 0 && (
        <Table columns={['ID', 'Name', 'Start', 'End']}>
          {data.map((season) => (
            <Row key={season.id}>
              <Cell>
                <span className="text-slate-500">#{season.id}</span>
              </Cell>
              <Cell>
                <span className="font-medium text-white">{season.name}</span>
              </Cell>
              <Cell>
                <span className="text-slate-400">{season.startAt}</span>
              </Cell>
              <Cell>
                <span className="text-slate-400">{season.endAt}</span>
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </section>
  )
}
