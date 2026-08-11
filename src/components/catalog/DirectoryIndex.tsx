'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { DirectoryGroup } from '@/lib/data/parts'
import { cn } from '@/lib/utils'
import { RangePills, rangeTest, ALPHA_RANGES, type AlphaRange } from '@/components/catalog/filters/RangePills'

// Numeric directories (NIIN / NSN) are grouped by leading digit — bucket the pills accordingly.
const NUMERIC_RANGES: AlphaRange[] = [
  { label: 'All', test: () => true },
  { label: '0–2', test: (k) => k >= '0' && k <= '2' },
  { label: '3–5', test: (k) => k >= '3' && k <= '5' },
  { label: '6–9', test: (k) => k >= '6' && k <= '9' },
]

export function DirectoryIndex({
  groups,
  categorySlug,
  numeric = false,
  searchLabel = 'Search this directory…',
}: {
  groups: DirectoryGroup[]
  categorySlug: string
  numeric?: boolean
  searchLabel?: string
}) {
  const [q, setQ] = useState('')
  const [range, setRange] = useState('All')

  const ranges = numeric ? NUMERIC_RANGES : ALPHA_RANGES

  const view = useMemo(() => {
    const term = q.trim().toLowerCase()
    const inRange = rangeTest(range, ranges)
    return groups
      .filter((g) => inRange(g.key.toUpperCase()))
      .map((g) => ({
        ...g,
        entries: term ? g.entries.filter((e) => e.label.toLowerCase().includes(term)) : g.entries,
      }))
      .filter((g) => g.entries.length > 0)
  }, [groups, q, range, ranges])

  return (
    <div>
      {/* Search + range pills */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="field-shell flex items-center bg-white">
          <Search size={18} className="ml-3 text-tertiary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchLabel}
            className="w-full px-3 py-3 text-body outline-none"
            aria-label="Search directory"
          />
        </div>
        <RangePills value={range} onChange={setRange} ranges={ranges} />
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {view.map((g) => (
          <div key={g.key} className="border border-hairline">
            <div className="flex items-center justify-between bg-navy px-4 py-2.5">
              <span className="font-display text-sm font-semibold text-white">{g.key}</span>
              <Link href={`/catalog/${categorySlug}/list/${g.entries[0].slug}`} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70 hover:text-white">
                View all →
              </Link>
            </div>
            <ul className="grid gap-x-6 gap-y-1 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {g.entries.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/catalog/${categorySlug}/list/${e.slug}`}
                    className={cn('block py-1 text-sm text-navy hover:text-accent hover:underline', numeric && 'font-mono')}
                  >
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {view.length === 0 && (
          <p className="border border-hairline p-8 text-center text-sm text-tertiary">No entries match your search.</p>
        )}
      </div>
    </div>
  )
}
