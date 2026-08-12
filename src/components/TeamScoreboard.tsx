import { useNavigate } from 'react-router-dom'
import type { MatchTeam, PlayerStat } from '../api/types'
import { Cell, Row, Table } from './Table'

function ResultBadge({ result }: { result: MatchTeam['result'] }) {
  const styles: Record<MatchTeam['result'], string> = {
    win: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
    loss: 'bg-red-400/10 text-red-300 ring-red-400/20',
    tie: 'bg-slate-500/10 text-slate-300 ring-white/10',
  }
  return (
    <span
      className={
        'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ring-1 ' +
        styles[result]
      }
    >
      {result}
    </span>
  )
}

// Average damage per round. Rounds played can be 0 for a match that produced no
// rounds, so guard against dividing by zero.
function adr(p: PlayerStat): number {
  return p.roundsPlayed > 0 ? Math.round(p.totalDamage / p.roundsPlayed) : 0
}

// Share of kills that were headshots, as a whole percentage. Zero kills → 0%.
function headshotPct(p: PlayerStat): number {
  return p.kills > 0 ? Math.round((p.headshotKills / p.kills) * 100) : 0
}

export function TeamScoreboard({ team }: { team: MatchTeam }) {
  const navigate = useNavigate()

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-white">Team {team.teamSlot}</h3>
        <ResultBadge result={team.result} />
        <span className="text-sm text-slate-400">
          Started {team.startingSide} · {team.roundsWon} rounds won
        </span>
      </div>

      <Table
        columns={[
          'Player',
          'K',
          'D',
          'A',
          'K/D',
          'ADR',
          'HS%',
          'Util Dmg',
          'FA',
          'DA',
          'MVPs',
        ]}
      >
        {team.players.map((p) => (
          <Row key={p.playerId} onClick={() => navigate(`/users/${p.steamId}`)}>
            <Cell>
              <span className="font-medium text-white">
                {p.steamUsername ?? (
                  <span className="text-slate-500 italic">unnamed</span>
                )}
              </span>
            </Cell>
            <Cell>{p.kills}</Cell>
            <Cell>{p.deaths}</Cell>
            <Cell>{p.assists}</Cell>
            <Cell>
              <span className="tabular-nums text-slate-300">
                {p.kdRatio.toFixed(2)}
              </span>
            </Cell>
            <Cell>
              <span className="tabular-nums">{adr(p)}</span>
            </Cell>
            <Cell>
              <span className="tabular-nums text-slate-300">
                {headshotPct(p)}%
              </span>
            </Cell>
            <Cell>
              <span className="tabular-nums">{p.utilityDamage}</span>
            </Cell>
            <Cell>{p.flashAssists}</Cell>
            <Cell>{p.damageAssists}</Cell>
            <Cell>{p.mvps}</Cell>
          </Row>
        ))}
      </Table>
    </div>
  )
}
