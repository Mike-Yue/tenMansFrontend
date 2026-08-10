export function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <dt className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
        {label}
      </dt>
      <dd
        className={
          'mt-1.5 text-slate-100 ' + (mono ? 'font-mono text-sm' : 'text-base')
        }
      >
        {value}
      </dd>
    </div>
  )
}
