import type { PlayerStats } from '../api/types'

function StatTile({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center">
      <div
        className={
          'text-3xl font-bold tabular-nums ' +
          (accent
            ? 'bg-gradient-to-r from-indigo-300 to-violet-400 bg-clip-text text-transparent'
            : 'text-white')
        }
      >
        {value}
      </div>
      <div className="mt-1.5 text-[11px] font-medium tracking-wider text-slate-500 uppercase">
        {label}
      </div>
    </div>
  )
}

export function StatsPanel({ stats }: { stats: PlayerStats }) {
  const winratePct = `${Math.round(stats.winrate * 100)}%`
  const headshotPct = `${Math.round(stats.headshotPct * 100)}%`
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatTile label="Kills" value={stats.kills} />
      <StatTile label="Deaths" value={stats.deaths} />
      <StatTile label="Assists" value={stats.assists} />
      <StatTile label="K/D" value={stats.kdRatio.toFixed(2)} />
      <StatTile label="HS%" value={headshotPct} />
      <StatTile label="MVPs" value={stats.mvps} />
      <StatTile label="Utility Dmg" value={stats.utilityDamage.toLocaleString()} />
      <StatTile label="Flash Assists" value={stats.flashAssists} />
      <StatTile label="Win Rate" value={winratePct} accent />
    </div>
  )
}
