'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { slugify, cn } from '@/lib/utils'
import { facetCounts, applyFacets, type FacetDef } from '@/lib/facets'
import { FacetDropdown } from '@/components/catalog/filters/FacetDropdown'
import { FilterChips, type ActiveChip } from '@/components/catalog/filters/FilterChips'

const PAGE_SIZE = 40

type CageRow = { code: string; manufacturer: string }

export function CageTable({ rows }: { rows: CageRow[] }) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [makers, setMakers] = useState<Set<string>>(new Set())

  const makerOptions = useMemo(() => facetCounts(rows, (r) => r.manufacturer), [rows])

  function toggleMaker(value: string) {
    setMakers((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
    setPage(1)
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    const defs: FacetDef<CageRow>[] = [{ accessor: (r) => r.manufacturer, selected: makers }]
    return applyFacets(rows, defs).filter((r) => {
      if (!t) return true
      return r.code.toLowerCase().includes(t) || r.manufacturer.toLowerCase().includes(t)
    })
  }, [q, rows, makers])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const mid = Math.ceil(shown.length / 2)
  const cols = [shown.slice(0, mid), shown.slice(mid)]

  const chips: ActiveChip[] = Array.from(makers).map((value) => ({
    facet: 'Manufacturer',
    value,
    onRemove: () => toggleMaker(value),
  }))

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {makerOptions.length > 1 && (
            <FacetDropdown
              label="Manufacturer"
              options={makerOptions}
              selected={makers}
              onToggle={toggleMaker}
              searchable
            />
          )}
          <div className="field-shell ml-auto flex items-center">
            <Search size={16} className="ml-3 text-tertiary" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1) }}
              placeholder="Search CAGE code or manufacturer…"
              className="w-72 max-w-full px-3 py-2.5 text-sm outline-none"
              aria-label="Search CAGE codes"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <FilterChips chips={chips} onClear={() => { setMakers(new Set()); setPage(1) }} />
          <span className="whitespace-nowrap text-sm text-tertiary">
            {filtered.length.toLocaleString()} codes · page {current} of {totalPages}
          </span>
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="border border-hairline p-8 text-center text-sm text-tertiary">
          No CAGE codes match the selected filters.
        </p>
      ) : (
        <div className="grid gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-2">
          {cols.map((col, ci) => (
            <table key={ci} className="w-full bg-white text-sm">
              <thead>
                <tr className="bg-navy text-left text-white">
                  <th className="px-4 py-2.5 font-medium">CAGE Code</th>
                  <th className="px-4 py-2.5 font-medium">Manufacturer</th>
                </tr>
              </thead>
              <tbody>
                {col.map((r, i) => (
                  <tr key={`${r.code}-${i}`} className="border-t border-hairline hover:bg-surface">
                    <td className="px-4 py-2.5 font-mono text-navy">{r.code}</td>
                    <td className="px-4 py-2.5">
                      <Link href={`/rfq/search?partno=${encodeURIComponent(r.manufacturer)}&type=Manufacturer`} className="text-secondary hover:text-accent">
                        {r.manufacturer}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-1" aria-label="Pagination">
          <button disabled={current === 1} onClick={() => setPage(current - 1)} className="h-9 border border-hairline px-3 text-sm text-secondary enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40">‹ Prev</button>
          <span className="px-3 text-sm text-secondary">{current} / {totalPages}</span>
          <button disabled={current === totalPages} onClick={() => setPage(current + 1)} className="h-9 border border-hairline px-3 text-sm text-secondary enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40">Next ›</button>
        </nav>
      )}
    </div>
  )
}
