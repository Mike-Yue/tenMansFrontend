import type { MatchStatus } from '../api/types'

const styles: Record<
  MatchStatus,
  { label: string; bg: string; text: string; ring: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    ring: 'ring-white/10',
    dot: 'bg-slate-500',
  },
  uploaded: {
    label: 'Uploaded',
    bg: 'bg-sky-400/10',
    text: 'text-sky-300',
    ring: 'ring-sky-400/20',
    dot: 'bg-sky-400',
  },
  processing: {
    label: 'Processing',
    bg: 'bg-amber-400/10',
    text: 'text-amber-300',
    ring: 'ring-amber-400/20',
    dot: 'bg-amber-400',
  },
  processed: {
    label: 'Processed',
    bg: 'bg-emerald-400/10',
    text: 'text-emerald-300',
    ring: 'ring-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  failed: {
    label: 'Failed',
    bg: 'bg-red-400/10',
    text: 'text-red-300',
    ring: 'ring-red-400/20',
    dot: 'bg-red-400',
  },
}

export function StatusBadge({ status }: { status: MatchStatus }) {
  const s = styles[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${s.bg} ${s.text} ${s.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}
