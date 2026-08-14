import { useNavigate } from 'react-router-dom'
import { listUsers } from '../api/users'
import { useAsync } from '../hooks/useAsync'
import { Cell, Row, Table } from '../components/Table'
import { Empty, ErrorState, Loading } from '../components/States'
import { Chip, PageHeader } from '../components/PageHeader'
import { formatDateTime } from '../format'

export function UsersPage() {
  const navigate = useNavigate()
  const { data, error, loading } = useAsync(() => listUsers(), [])

  return (
    <section>
      <PageHeader
        title="Users"
        subtitle="Registered Steam players"
        actions={data ? <Chip>{data.length} total</Chip> : undefined}
      />

      {loading && <Loading />}
      {!loading && error != null && <ErrorState error={error} />}
      {!loading && !error && data && data.length === 0 && (
        <Empty message="No users found." />
      )}
      {!loading && !error && data && data.length > 0 && (
        <Table columns={['ID', 'Username', 'Steam ID', 'Created']}>
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
            </Row>
          ))}
        </Table>
      )}
    </section>
  )
}
