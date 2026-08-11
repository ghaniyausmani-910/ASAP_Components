'use client'

import { cn } from '@/lib/utils'

export interface AlphaRange {
  label: string
  test: (key: string) => boolean
}

/** A–Z / 0-9 range buckets, keyed off the first character (uppercased). */
export const ALPHA_RANGES: AlphaRange[] = [
  { label: 'All', test: () => true },
  { label: '0-9', test: (k) => /[0-9]/.test(k) },
  { label: 'A-E', test: (k) => k >= 'A' && k <= 'E' },
  { label: 'F-J', test: (k) => k >= 'F' && k <= 'J' },
  { label: 'K-O', test: (k) => k >= 'K' && k <= 'O' },
  { label: 'P-T', test: (k) => k >= 'P' && k <= 'T' },
  { label: 'U-Z', test: (k) => k >= 'U' && k <= 'Z' },
]

/** Resolve a range label to its predicate (defaults to the "All" pass-through). */
export function rangeTest(label: string, ranges: AlphaRange[] = ALPHA_RANGES): (key: string) => boolean {
  return (ranges.find((r) => r.label === label) ?? ranges[0]).test
}

export function RangePills({
  value,
  onChange,
  ranges = ALPHA_RANGES,
}: {
  value: string
  onChange: (label: string) => void
  ranges?: AlphaRange[]
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ranges.map((r) => (
        <button
          key={r.label}
          type="button"
          onClick={() => onChange(r.label)}
          className={cn(
            'px-3 py-1.5 text-xs font-semibold',
            value === r.label
              ? 'bg-accent text-white'
              : 'border border-hairline text-secondary hover:border-accent hover:text-accent',
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
