'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import type { Part } from '@/lib/types'
import { AddToCartControl } from '@/components/cart/AddToCartControl'
import { slugify, cn } from '@/lib/utils'

const PAGE_SIZE = 15

export function PartsListingTable({
  parts,
  categorySlug,
  showDescription = false,
  extraColumn,
}: {
  parts: Part[]
  categorySlug: string
  showDescription?: boolean
  extraColumn?: { key: string; label: string }
}) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return parts
    return parts.filter(
      (p) =>
        p.partNo.toLowerCase().includes(term) ||
        p.manufacturer.toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term),
    )
  }, [q, parts])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center border border-inputline">
          <Search size={16} className="ml-3 text-tertiary" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder="Filter within these results…"
            className="w-64 max-w-full px-3 py-2.5 text-sm outline-none"
            aria-label="Filter parts"
          />
        </div>
        <span className="text-sm text-tertiary">
          {filtered.length.toLocaleString()} parts · page {current} of {totalPages}
        </span>
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
            {rows.map((p, i) => (
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
            ))}
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
