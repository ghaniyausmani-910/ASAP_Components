'use client'

// B4 · Part number rail that stays visible while the user scrolls the part
// detail page. Slim, hairline-bordered, keeps the mono part number and a
// jump-to-RFQ so cross-checking against a shortage list never costs conversion
// access. Sticks below the site header (top ≈ header height).

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

export function StickyPartNumber({ partNo, manufacturer }: { partNo: string; manufacturer: string }) {
  // Only pin after the user has scrolled past the h1, so it doesn't compete with
  // the header at rest — same behaviour as the header's scroll-solid state.
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > 220)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!pinned) return null

  return (
    <div
      role="region"
      aria-label="Current part"
      className="sticky top-[72px] z-40 border-y border-hairline bg-white/95 backdrop-blur"
    >
      <div className="container-x flex h-11 items-center justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="text-xs uppercase tracking-[0.08em] text-tertiary">Part</span>
          <span className="truncate font-mono text-sm font-medium text-ink">{partNo}</span>
          <span className="hidden truncate text-xs text-secondary sm:inline">by {manufacturer}</span>
        </div>
        <a
          href="#rfq-form"
          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Submit RFQ <ArrowRight size={12} />
        </a>
      </div>
    </div>
  )
}
