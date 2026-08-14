import type { MouseEvent } from 'react'

// A small red-tinted delete control. When used inside a clickable table row, the
// onClick receives the event so the caller can stopPropagation() to avoid the row's
// navigation firing.
export function DeleteButton({
  onClick,
  disabled,
  label = 'Delete',
}: {
  onClick: (e: MouseEvent) => void
  disabled?: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-red-400/20 bg-red-400/[0.06] px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  )
}
