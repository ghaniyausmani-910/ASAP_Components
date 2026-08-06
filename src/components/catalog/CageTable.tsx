'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { slugify, cn } from '@/lib/utils'

const PAGE_SIZE = 40

export function CageTable({ rows }: { rows: { code: string; manufacturer: string }[] }) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return rows
    return rows.filter((r) => r.code.toLowerCase().includes(t) || r.manufacturer.toLowerCase().includes(t))
  }, [q, rows])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const mid = Math.ceil(shown.length / 2)
  const cols = [shown.slice(0, mid), shown.slice(mid)]

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="field-shell flex items-center">
          <Search size={16} className="ml-3 text-tertiary" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Search CAGE code or manufacturer…" className="w-72 max-w-full px-3 py-2.5 text-sm outline-none" aria-label="Search CAGE codes" />
        </div>
        <span className="text-sm text-tertiary">Page {current} of {totalPages}</span>
      </div>
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
