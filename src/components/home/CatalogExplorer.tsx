'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp } from 'lucide-react'
import type { CatalogColumn } from '@/lib/data/site'
import { cn } from '@/lib/utils'

/**
 * Explore-the-catalog "demand board": three compact tabs switch a full-width
 * hairline leaderboard of the top parts in each category (rank · mono code ·
 * name · real metric + demand trend). Data-forward — the numbers are the
 * content. Every row deep-links into the matching catalog listing.
 *
 * On xl the board reserves a right-hand lane for a fixed cinematic image card.
 * The card stays put; hovering or focusing a row cross-fades it to that item's
 * shot and caption. Below xl the lane collapses and rows fall back to an inline
 * one-line detail reveal — no image, no wasted space.
 */
export function CatalogExplorer({ columns }: { columns: CatalogColumn[] }) {
  const [activeTab, setActiveTab] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const column = columns[activeTab]
  const active = column.items[activeIndex] ?? column.items[0]

  return (
    <div className="mx-auto mt-10 max-w-[1200px] lg:mt-14">
      {/* Tabs — compact underline control, centered on the section axis. */}
      <div
        role="tablist"
        aria-label="Catalog categories"
        className="flex justify-start gap-14 overflow-x-auto border-b border-hairline sm:justify-between sm:gap-8 sm:px-14 lg:px-24 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {columns.map((col, i) => {
          const isActive = i === activeTab
          return (
            <button
              key={col.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveTab(i)
                setActiveIndex(0)
              }}
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

      {/* Board + peek lane. Leaving the board falls back to the first item. */}
      <div className="relative" onMouseLeave={() => setActiveIndex(0)}>
        {/* Ranked demand board — hairline table, mono codes/metrics. On xl the
            right padding clears the reserved image lane. */}
        <ol
          key={activeTab}
          className="mt-8 divide-y divide-hairline border-y border-hairline xl:pr-[336px]"
        >
          {column.items.map((item, i) => (
            <li
              key={item.id}
              className="motion-safe:animate-fade"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <Link
                href={item.href}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                className={cn(
                  'group grid grid-cols-[1.75rem_auto_minmax(0,1fr)_auto] items-center gap-x-4 py-5 pl-1 pr-2 transition-[background-color,box-shadow] duration-300 ease-out hover:bg-white hover:shadow-hover focus-visible:bg-white focus-visible:shadow-hover motion-reduce:transition-none sm:gap-x-6 sm:pl-2 sm:pr-4',
                  // On xl, keep the active row's surface lit so the card reads as its pair.
                  i === activeIndex && 'xl:bg-white xl:shadow-hover',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-sm tabular-nums text-tertiary',
                    i === activeIndex && 'xl:text-secondary',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-sm text-ink">{item.code}</span>
                <span className="flex min-w-0 flex-col">
                  <span
                    className={cn(
                      'truncate text-sm text-secondary transition-colors group-hover:text-accent group-focus-visible:text-accent',
                      i === activeIndex && 'xl:text-accent',
                    )}
                  >
                    {item.name}
                  </span>
                  {/* Inline one-liner — only below xl; on xl the image card carries
                      the detail, and constant row height keeps the layout steady. */}
                  <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] motion-reduce:transition-none xl:hidden">
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

        {/* Image card — fixed in the reserved lane, xl and up only. Stays put;
            the shot + caption cross-fade to the active row. Decorative: the row
            already carries the item's text for assistive tech. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[300px] xl:block"
        >
          <div className="relative h-full w-full overflow-hidden border border-hairline bg-surface-2 shadow-hover">
            {column.items.map((item, i) => (
              <Image
                key={item.id}
                src={item.image}
                alt=""
                fill
                sizes="300px"
                className={cn(
                  'object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none',
                  i === activeIndex ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}
            {/* Navy scrim for caption legibility. */}
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0)_38%,rgba(5,7,13,0.74)_100%)]" />
            {/* Accent keyline on the top edge — ties to the card hover language. */}
            <span className="absolute inset-x-0 top-0 h-0.5 bg-accent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-mono text-[11px] leading-none text-white/75">{active.code}</p>
              <p className="mt-1.5 font-display text-base font-medium leading-tight text-white [text-wrap:balance]">
                {active.name}
              </p>
            </div>
          </div>
        </div>
      </div>

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
