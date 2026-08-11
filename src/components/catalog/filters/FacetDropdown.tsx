'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FacetOption } from '@/lib/facets'

const EMPTY: ReadonlySet<string> = new Set()

/**
 * A single multi-select facet: a labeled button that opens a checkbox popover of
 * `{ value, count }` options. An internal search box appears when the option list
 * is long (or when `searchable` is forced). Closes on outside click / Escape.
 */
export function FacetDropdown({
  label,
  options,
  selected = EMPTY,
  onToggle,
  searchable,
}: {
  label: string
  options: FacetOption[]
  selected?: ReadonlySet<string>
  onToggle: (value: string) => void
  searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const useSearch = searchable ?? options.length > 8
  const term = q.trim().toLowerCase()
  const shown = term ? options.filter((o) => o.value.toLowerCase().includes(term)) : options
  const active = selected.size

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2 border px-3 py-2 text-sm transition-colors',
          active > 0
            ? 'border-accent text-accent'
            : 'border-hairline text-secondary hover:border-accent hover:text-accent',
        )}
      >
        {label}
        {active > 0 && (
          <span className="tabular-nums rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
            {active}
          </span>
        )}
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 max-w-[80vw] border border-hairline bg-white shadow-lg">
          {useSearch && (
            <div className="flex items-center border-b border-hairline">
              <Search size={14} className="ml-3 text-tertiary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                aria-label={`Search ${label}`}
                autoFocus
                className="w-full px-2 py-2 text-sm outline-none"
              />
            </div>
          )}
          <ul className="max-h-64 overflow-y-auto py-1">
            {shown.length === 0 && (
              <li className="px-3 py-2 text-sm text-tertiary">No matches</li>
            )}
            {shown.map((o) => {
              const isOn = selected.has(o.value)
              return (
                <li key={o.value}>
                  <label className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-secondary hover:bg-surface">
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center border',
                        isOn ? 'border-accent bg-accent text-white' : 'border-hairline',
                      )}
                    >
                      {isOn && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span className="flex-1 truncate">{o.value}</span>
                    <span className="tabular-nums text-tertiary">{o.count}</span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isOn}
                      onChange={() => onToggle(o.value)}
                    />
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
