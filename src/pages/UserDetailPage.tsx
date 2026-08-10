import { Link, useParams } from 'react-router-dom'
import { getUser } from '../api/users'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, Loading } from '../components/States'
import { Field } from '../components/Field'

export function UserDetailPage() {
  const { steamId = '' } = useParams()
  const { data, error, loading } = useAsync(() => getUser(steamId), [steamId])

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

      {loading && <Loading />}
      {!loading && error != null && <ErrorState error={error} />}
      {!loading && !error && data && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <dl className="grid gap-3 sm:grid-cols-2">
            <Field label="ID" value={String(data.id)} />
            <Field label="Username" value={data.steamUsername ?? '—'} />
            <Field label="Steam ID" value={data.steamId} mono />
            <Field label="Created" value={data.createdAt} />
          </dl>
        </div>
      )}
    </section>
  )
}
