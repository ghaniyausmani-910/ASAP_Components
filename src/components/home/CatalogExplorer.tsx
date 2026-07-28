'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CatalogColumn, CatalogPreviewItem } from '@/lib/data/site'
import { cn } from '@/lib/utils'

export function CatalogExplorer({ columns }: { columns: CatalogColumn[] }) {
  // Preview defaults to the first item so the panel is never empty; hovering any
  // row swaps it, and leaving simply keeps the last-hovered item on screen.
  const [active, setActive] = useState<CatalogPreviewItem>(columns[0].items[0])

  return (
    <div className="mt-12 grid border border-hairline bg-white lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
      {columns.map((col, i) => (
        <div
          key={col.title}
          className="flex flex-col border-b border-hairline last:border-b-0 lg:border-b-0 lg:border-r"
        >
          <p className="border-b border-hairline px-5 py-4 font-display text-base font-medium">
            {col.title}
          </p>
          <ul className="flex-1 divide-y divide-hairline">
            {col.items.map((item) => {
              const isActive = item.id === active.id
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => setActive(item)}
                    onFocus={() => setActive(item)}
                    className={cn(
                      'group flex items-center justify-between gap-3 px-5 py-3 text-sm transition-colors',
                      i !== 0 && 'font-mono text-[13px]',
                      isActive ? 'bg-surface text-accent' : 'text-secondary hover:bg-surface hover:text-accent',
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    <ArrowRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-opacity',
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
          <Link
            href={col.viewAllHref}
            className="border-t border-hairline px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-accent"
          >
            View more →
          </Link>
        </div>
      ))}

      {/* Preview panel — desktop-only enhancement driven by the hovered row. */}
      <div className="hidden bg-ink text-[var(--on-dark)] lg:flex lg:flex-col">
        <div key={active.id} className="flex flex-1 flex-col p-6 motion-safe:animate-fade">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--on-dark-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image}
              alt={active.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-5 flex items-start justify-between gap-3">
            <p className="font-display text-h4 font-medium tracking-tight-2 text-[var(--on-dark)]">{active.title}</p>
            <span className="max-w-[45%] shrink-0 pt-1 text-right text-xs font-medium leading-tight text-[var(--on-dark)]">
              {active.count}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--on-dark-muted)]">{active.description}</p>
          <Link href={active.href} className="btn btn-on-dark mt-8 inline-flex w-fit">
            View details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
