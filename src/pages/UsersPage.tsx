import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteUser, listUsers } from '../api/users'
import { ApiError } from '../api/client'
import { useAsync } from '../hooks/useAsync'
import { Cell, Row, Table } from '../components/Table'
import { Empty, ErrorState, Loading } from '../components/States'
import { Chip, PageHeader } from '../components/PageHeader'
import { DeleteButton } from '../components/DeleteButton'
import { formatDateTime } from '../format'
import type { User } from '../api/types'

export function UsersPage() {
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const { data, error, loading } = useAsync(() => listUsers(), [refreshKey])

  async function handleDelete(user: User) {
    if (!window.confirm(`Delete user "${user.steamUsername ?? user.steamId}"?`)) {
      return
    }
    setDeletingId(user.id)
    setActionError(null)
    try {
      await deleteUser(user.steamId)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setActionError(
        err instanceof ApiError && err.status === 409
          ? "Can't delete — this user has match stats."
          : err instanceof Error
            ? err.message
            : 'Failed to delete user.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      <PageHeader
        title="Users"
        subtitle="Registered Steam players"
        actions={data ? <Chip>{data.length} total</Chip> : undefined}
      />

      {actionError != null && (
        <p className="mb-4 text-sm text-red-300">{actionError}</p>
      )}

      {loading && <Loading />}
      {!loading && error != null && <ErrorState error={error} />}
      {!loading && !error && data && data.length === 0 && (
        <Empty message="No users found." />
      )}
      {!loading && !error && data && data.length > 0 && (
        <Table columns={['ID', 'Username', 'Steam ID', 'Created', '']}>
          {data.map((user) => (
            <Row
              key={user.id}
              onClick={() => navigate(`/users/${user.steamId}`)}
            >
              <Cell>
                <span className="text-slate-500">#{user.id}</span>
              </Cell>
              <Cell>
                <span className="font-medium text-white">
                  {user.steamUsername ?? (
                    <span className="text-slate-500 italic">unnamed</span>
                  )}
                </span>
              </Cell>
              <Cell>
                <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-slate-300 ring-1 ring-white/10">
                  {user.steamId}
                </span>
              </Cell>
              <Cell>
                <span className="text-slate-400">{formatDateTime(user.createdAt)}</span>
              </Cell>
              <Cell>
                <DeleteButton
                  disabled={deletingId === user.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(user)
                  }}
                />
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </section>
  )
}
