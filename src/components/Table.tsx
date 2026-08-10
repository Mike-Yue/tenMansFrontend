import type { ReactNode } from 'react'

export function Table({
  columns,
  children,
}: {
  columns: string[]
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl shadow-black/40 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-xs font-semibold tracking-wider text-slate-400 uppercase whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function Row({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <tr
      onClick={onClick}
      className={
        'group transition-colors duration-150 ' +
        (onClick ? 'cursor-pointer hover:bg-white/[0.04]' : '')
      }
    >
      {children}
    </tr>
  )
}

export function Cell({ children }: { children: ReactNode }) {
  return (
    <td className="px-5 py-3.5 whitespace-nowrap text-slate-200">{children}</td>
  )
}
