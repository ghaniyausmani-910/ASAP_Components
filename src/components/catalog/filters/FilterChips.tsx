'use client'

import { X } from 'lucide-react'

export interface ActiveChip {
  /** Facet label, e.g. "Manufacturer" */
  facet: string
  value: string
  onRemove: () => void
}

/** Removable chips for the currently-active facet selections, plus a "Clear all". */
export function FilterChips({ chips, onClear }: { chips: ActiveChip[]; onClear: () => void }) {
  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={`${c.facet}:${c.value}`}
          type="button"
          onClick={c.onRemove}
          className="inline-flex items-center gap-1 border border-hairline bg-surface px-2.5 py-1 text-xs text-secondary transition-colors hover:border-accent hover:text-accent"
          aria-label={`Remove filter ${c.facet}: ${c.value}`}
        >
          <span className="text-tertiary">{c.facet}:</span> {c.value}
          <X size={12} />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs font-semibold text-accent hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
