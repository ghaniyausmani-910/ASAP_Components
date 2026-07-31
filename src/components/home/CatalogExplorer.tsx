'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'
import type { CatalogColumn } from '@/lib/data/site'
import { cn } from '@/lib/utils'

/**
 * Explore-the-catalog "demand board": three compact tabs switch a full-width
 * hairline leaderboard of the top parts in each category (rank · mono code ·
 * name · real metric + demand trend). Data-forward, no imagery — the numbers
 * are the content. Default tab is the first; every row deep-links into the
 * matching catalog listing.
 */
export function CatalogExplorer({ columns }: { columns: CatalogColumn[] }) {
  const [activeTab, setActiveTab] = useState(0)
  const column = columns[activeTab]

  return (
    <div className="mx-auto mt-10 max-w-4xl lg:mt-14">
      {/* Tabs — compact underline control, centered on the section axis. */}
      <div
        role="tablist"
        aria-label="Catalog categories"
        className="flex justify-start gap-14 overflow-x-auto border-b border-hairline sm:justify-center sm:gap-20 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {columns.map((col, i) => {
          const isActive = i === activeTab
          return (
            <button
              key={col.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(i)}
              className={cn(
                'relative shrink-0 whitespace-nowrap px-1 pb-4 pt-1 font-display text-base transition-colors motion-reduce:transition-none',
                isActive ? 'text-ink' : 'text-tertiary hover:text-secondary',
              )}
            >
              {col.title}
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-0 -bottom-px h-0.5 origin-center bg-accent transition-transform duration-300 ease-out motion-reduce:transition-none',
                  isActive ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </button>
          )
        })}
      </div>

      {/* Ranked demand board — hairline table, no card, mono codes/metrics. */}
      <ol key={activeTab} className="mt-8 divide-y divide-hairline border-y border-hairline">
        {column.items.map((item, i) => (
          <li key={item.id} className="motion-safe:animate-fade" style={{ animationDelay: `${i * 45}ms` }}>
            <Link
              href={item.href}
              className="group grid grid-cols-[1.75rem_auto_minmax(0,1fr)_auto] items-center gap-x-4 py-5 pl-1 pr-2 transition-[background-color,box-shadow] duration-300 ease-out hover:bg-white hover:shadow-hover focus-visible:bg-white focus-visible:shadow-hover motion-reduce:transition-none sm:gap-x-6 sm:pl-2 sm:pr-4"
            >
              <span className="font-mono text-sm tabular-nums text-tertiary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-sm text-ink">{item.code}</span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm text-secondary transition-colors group-hover:text-accent group-focus-visible:text-accent">
                  {item.name}
                </span>
                {/* One-liner detail: row grows on hover/focus via 0fr→1fr grid rows. */}
                <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] motion-reduce:transition-none">
                  <span className="overflow-hidden">
                    <span className="block pt-1 text-xs leading-snug text-secondary opacity-0 transition-opacity duration-300 ease-out [text-wrap:pretty] group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                      {item.subtext}
                    </span>
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3 sm:gap-4">
                <span className="hidden font-mono text-xs tabular-nums text-tertiary md:inline">
                  {item.metric}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-xs font-medium tabular-nums text-accent">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                  {item.trend}%
                </span>
                <ArrowRight className="h-4 w-4 text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* View all — deep link into the active category's full listing. */}
      <div className="mt-6 flex justify-end">
        <Link
          href={column.viewAllHref}
          className="group inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-accent"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
