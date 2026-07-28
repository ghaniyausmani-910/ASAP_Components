'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Part } from '@/lib/types'
import { CATEGORIES } from '@/lib/data/catalog'
import { AddToCartControl } from '@/components/cart/AddToCartControl'
import { cn } from '@/lib/utils'

/**
 * Global-search results view — image-02 layout in ASAP styling: a left facet
 * sidebar (the 6 catalog categories with counts) beside a results table.
 * The single exact-match row's "Get Quote" links to the existing quote form.
 */
export function SearchResults({
  part,
  categorySlug,
}: {
  part: Part
  categorySlug: string
}) {
  // Facet counts: the matched category has the one result, the rest have none.
  const facets = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        slug: c.slug,
        label: c.label,
        count: c.slug === categorySlug ? 1 : 0,
      })),
    [categorySlug],
  )

  // Selected category slugs. Empty set = no refinement (show everything).
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const visible = selected.size === 0 || selected.has(categorySlug)
  const rows = visible ? [part] : []

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      {/* Facet sidebar */}
      <aside>
        <p className="font-display text-body font-semibold">Refine</p>
        <div className="mt-4 border-t border-hairline pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-tertiary">Category</p>
          <ul className="mt-3 space-y-2.5">
            {facets.map((f) => (
              <li key={f.slug}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-secondary hover:text-ink">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selected.has(f.slug)}
                      onChange={() => toggle(f.slug)}
                      className="h-4 w-4 accent-accent"
                      aria-label={`Filter by ${f.label}`}
                    />
                    {f.label}
                  </span>
                  <span className="tabular-nums text-tertiary">{f.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Results */}
      <div>
        <p className="text-sm text-tertiary">
          {rows.length} {rows.length === 1 ? 'result' : 'results'}
        </p>
        <div className="mt-4 overflow-x-auto border border-hairline">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-left text-white">
                <Th>Part No.</Th>
                <Th>Item Name</Th>
                <Th>Manufacturer</Th>
                <Th className="w-28 text-center">Availability</Th>
                <Th className="w-32 text-center">Cart</Th>
                <Th className="w-28 text-center">Action</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-secondary">
                    No results match the selected filters.
                  </td>
                </tr>
              ) : (
                rows.map((p, i) => (
                  <tr key={`${p.partNo}-${i}`} className="border-t border-hairline hover:bg-surface">
                    <td className="px-4 py-3 font-mono text-navy">{p.partNo}</td>
                    <td className="px-4 py-3 text-secondary">{p.description ?? '—'}</td>
                    <td className="px-4 py-3 text-secondary">{p.manufacturer}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                        In Stock
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <AddToCartControl
                        partNo={p.partNo}
                        manufacturer={p.manufacturer}
                        description={p.description}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/rfq/search?partno=${encodeURIComponent(p.partNo)}`}
                        className="inline-flex items-center gap-1 whitespace-nowrap bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
                      >
                        Get Quote <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn('px-4 py-3 font-medium', className)}>{children}</th>
}
