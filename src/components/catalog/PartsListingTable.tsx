'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import type { Part } from '@/lib/types'
import { AddToCartControl } from '@/components/cart/AddToCartControl'
import { slugify, cn } from '@/lib/utils'
import {
  facetCounts,
  applyFacets,
  partSeries,
  sortByKey,
  type FacetDef,
  type SortKey,
  type SortDir,
} from '@/lib/facets'
import { FacetDropdown } from '@/components/catalog/filters/FacetDropdown'
import { FilterChips, type ActiveChip } from '@/components/catalog/filters/FilterChips'
import { SortSelect } from '@/components/catalog/filters/SortSelect'

const PAGE_SIZE = 15
const EMPTY: ReadonlySet<string> = new Set()

type FacetConfig = {
  id: string
  label: string
  accessor: (p: Part) => string | undefined
  searchable?: boolean
}

const SORTS: { value: string; label: string }[] = [
  { value: 'default', label: 'Sort' },
  { value: 'partNo-asc', label: 'Part No. A–Z' },
  { value: 'partNo-desc', label: 'Part No. Z–A' },
  { value: 'manufacturer-asc', label: 'Manufacturer A–Z' },
]

export function PartsListingTable({
  parts,
  categorySlug,
  showDescription = false,
  extraColumn,
  hideManufacturerFacet = false,
}: {
  parts: Part[]
  categorySlug: string
  showDescription?: boolean
  extraColumn?: { key: string; label: string }
  hideManufacturerFacet?: boolean
}) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('default')
  const [selections, setSelections] = useState<Record<string, Set<string>>>({})

  // Which facets apply to this listing (only fields present in the rows).
  const facetConfigs = useMemo<FacetConfig[]>(() => {
    const configs: FacetConfig[] = []
    if (!hideManufacturerFacet) {
      configs.push({ id: 'manufacturer', label: 'Manufacturer', accessor: (p) => p.manufacturer, searchable: true })
    }
    if (showDescription) {
      configs.push({ id: 'description', label: 'Part Type', accessor: (p) => p.description ?? undefined, searchable: true })
    }
    if (extraColumn) {
      configs.push({
        id: 'extra',
        label: extraColumn.label,
        accessor: (p) => (p as unknown as Record<string, string>)[extraColumn.key],
      })
    }
    configs.push({ id: 'series', label: 'Series', accessor: (p) => partSeries(p.partNo) })
    return configs
  }, [showDescription, extraColumn, hideManufacturerFacet])

  // Facet option lists + counts, derived from the full result set.
  const facetOptions = useMemo(
    () => Object.fromEntries(facetConfigs.map((c) => [c.id, facetCounts(parts, c.accessor)])),
    [parts, facetConfigs],
  )

  function toggle(facetId: string, value: string) {
    setSelections((prev) => {
      const next = { ...prev }
      const set = new Set(next[facetId] ?? EMPTY)
      if (set.has(value)) set.delete(value)
      else set.add(value)
      next[facetId] = set
      return next
    })
    setPage(1)
  }

  function clearAll() {
    setSelections({})
    setPage(1)
  }

  // parts → facets → free-text → sort → paginate
  const facetFiltered = useMemo(() => {
    const defs: FacetDef<Part>[] = facetConfigs.map((c) => ({
      accessor: c.accessor,
      selected: selections[c.id] ?? EMPTY,
    }))
    return applyFacets(parts, defs)
  }, [parts, facetConfigs, selections])

  const textFiltered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return facetFiltered
    return facetFiltered.filter(
      (p) =>
        p.partNo.toLowerCase().includes(term) ||
        p.manufacturer.toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term),
    )
  }, [q, facetFiltered])

  const sorted = useMemo(() => {
    if (sort === 'default') return textFiltered
    const [key, dir] = sort.split('-') as [SortKey, SortDir]
    return sortByKey(textFiltered, key, dir)
  }, [textFiltered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const chips: ActiveChip[] = facetConfigs.flatMap((c) =>
    Array.from(selections[c.id] ?? EMPTY).map((value) => ({
      facet: c.label,
      value,
      onRemove: () => toggle(c.id, value),
    })),
  )

  return (
    <div>
      {/* Filter bar: facets + sort + free-text search */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {facetConfigs.map((c) => {
            const opts = facetOptions[c.id]
            if (opts.length < 2) return null
            return (
              <FacetDropdown
                key={c.id}
                label={c.label}
                options={opts}
                selected={selections[c.id] ?? EMPTY}
                onToggle={(v) => toggle(c.id, v)}
                searchable={c.searchable}
              />
            )
          })}

          <SortSelect
            value={sort}
            onChange={(v) => { setSort(v); setPage(1) }}
            options={SORTS}
            ariaLabel="Sort parts"
          />

          <div className="field-shell ml-auto flex items-center">
            <Search size={16} className="ml-3 text-tertiary" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1) }}
              placeholder="Filter within these results…"
              className="w-64 max-w-full px-3 py-2.5 text-sm outline-none"
              aria-label="Filter parts"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <FilterChips chips={chips} onClear={clearAll} />
          <span className="whitespace-nowrap text-sm text-tertiary">
            {sorted.length.toLocaleString()} parts · page {current} of {totalPages}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-hairline">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-navy text-left text-white">
              <Th>Part No.</Th>
              <Th>Manufacturer</Th>
              {showDescription && <Th>Description</Th>}
              {extraColumn && <Th>{extraColumn.label}</Th>}
              <Th className="w-56">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-secondary">
                  No parts match the selected filters.
                </td>
              </tr>
            ) : (
              rows.map((p, i) => (
                <tr key={`${p.partNo}-${i}`} className="border-t border-hairline hover:bg-surface">
                  <td className="px-4 py-3">
                    <Link
                      href={`/catalog/${categorySlug}/quote/${slugify(p.manufacturer)}/${encodeURIComponent(p.partNo)}`}
                      className="font-mono text-navy hover:text-accent hover:underline"
                    >
                      {p.partNo}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-secondary">{p.manufacturer}</td>
                  {showDescription && <td className="px-4 py-3 text-secondary">{p.description ?? '—'}</td>}
                  {extraColumn && (
                    <td className="px-4 py-3 text-secondary">
                      {(p as unknown as Record<string, string>)[extraColumn.key] ?? '—'}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/rfq/search?partno=${encodeURIComponent(p.partNo)}`}
                        className="inline-flex items-center gap-1 whitespace-nowrap bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
                      >
                        RFQ <ArrowRight size={12} />
                      </Link>
                      <AddToCartControl partNo={p.partNo} manufacturer={p.manufacturer} description={p.description} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
          <PageBtn disabled={current === 1} onClick={() => setPage(current - 1)}>‹ Prev</PageBtn>
          {pageWindow(current, totalPages).map((n, i) =>
            n === '…' ? (
              <span key={`e${i}`} className="px-2 text-tertiary">…</span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n as number)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center text-sm',
                  n === current ? 'bg-accent text-white' : 'border border-hairline text-secondary hover:border-accent hover:text-accent',
                )}
              >
                {n}
              </button>
            ),
          )}
          <PageBtn disabled={current === totalPages} onClick={() => setPage(current + 1)}>Next ›</PageBtn>
        </nav>
      )}
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn('px-4 py-3 font-medium', className)}>{children}</th>
}

function PageBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-9 border border-hairline px-3 text-sm text-secondary transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function pageWindow(current: number, total: number): (number | '…')[] {
  const out: (number | '…')[] = []
  const add = (n: number) => out.push(n)
  add(1)
  if (current > 3) out.push('…')
  for (let n = Math.max(2, current - 1); n <= Math.min(total - 1, current + 1); n++) add(n)
  if (current < total - 2) out.push('…')
  if (total > 1) add(total)
  return out
}
