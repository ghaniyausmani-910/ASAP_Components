'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { sortByKey, type SortDir } from '@/lib/facets'
import { SortSelect } from '@/components/catalog/filters/SortSelect'

type FscRow = { code: string; label: string; count: number }

const SORTS: { value: string; label: string }[] = [
  { value: 'default', label: 'Sort' },
  { value: 'code-asc', label: 'FSC (low → high)' },
  { value: 'code-desc', label: 'FSC (high → low)' },
  { value: 'count-desc', label: 'Most parts' },
  { value: 'count-asc', label: 'Fewest parts' },
]

/** Federal Supply Class table with sort by code or parts count. */
export function FscTable({ rows, categorySlug }: { rows: FscRow[]; categorySlug: string }) {
  const [sort, setSort] = useState('default')

  const sorted = useMemo(() => {
    if (sort === 'default') return rows
    const [key, dir] = sort.split('-') as ['code' | 'count', SortDir]
    if (key === 'count') {
      const factor = dir === 'asc' ? 1 : -1
      return [...rows].sort((a, b) => factor * (a.count - b.count))
    }
    return sortByKey(rows, key as 'code', dir)
  }, [rows, sort])

  return (
    <div>
      <div className="mb-4 flex items-center">
        <SortSelect
          value={sort}
          onChange={setSort}
          options={SORTS}
          ariaLabel="Sort FSC codes"
          className="ml-auto"
        />
      </div>
      <div className="overflow-x-auto border border-hairline">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-navy text-left text-white">
              <th className="px-4 py-3 font-medium">FSC</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 text-right font-medium">Parts</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((f) => (
              <tr key={f.code} className="border-t border-hairline hover:bg-surface">
                <td className="px-4 py-3 font-mono text-navy">{f.code}</td>
                <td className="px-4 py-3">
                  <Link href={`/catalog/${categorySlug}/list/${f.code}`} className="text-secondary hover:text-accent hover:underline">{f.label}</Link>
                </td>
                <td className="px-4 py-3 text-right text-tertiary">{f.count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
