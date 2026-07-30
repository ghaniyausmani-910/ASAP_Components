'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AboutCardItem } from './about-cards/AboutCardItem'
import type { AboutCardData } from './about-cards/types'

// Re-exported so callers (ScrollTextReveal / page) keep importing `AboutCard`.
export type AboutCard = AboutCardData

/** Placeholder copy — accurate to ASAP's own value props (from the site's
 *  mission + About copy) so it reads correctly until you swap it. Each card
 *  reuses an existing /about photo as its hover reveal. */
const DEFAULT_CARDS: AboutCardData[] = [
  { icon: 'badge', title: 'Certified distributor', body: 'AS9120B, ISO 9001:2015, and FAA AC 00-56B accredited.' },
  { icon: 'timer', title: 'RFQs in 15 minutes', body: 'Round-the-clock quote responses, 365 days a year.' },
  { icon: 'layers', title: '5M+ board-level parts', body: 'Connectors, interconnects, and components in one catalog.' },
  { icon: 'boxes', title: 'NSN-organized inventory', body: 'Military parts mapped across 40 Federal Supply Classes.' },
  { icon: 'truck', title: 'Same-day delivery', body: 'Expedited fulfillment for your most urgent requirements.' },
  { icon: 'route', title: 'Traceable supply chain', body: 'Full documentation and supply-chain integrity, end to end.' },
]

export function AboutCards({ cards = DEFAULT_CARDS }: { cards?: AboutCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [dragging, setDragging] = useState(false)

  /* -------- Horizontal exploration: arrows + end-aware affordances ------- */
  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft >= max - 1)
  }, [])

  useEffect(() => {
    sync()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync])

  function page(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const GAP = 24 // matches gap-6 — advance one full page
    el.scrollBy({ left: dir * (el.clientWidth + GAP), behavior: 'smooth' })
  }

  /* -------- Mouse drag-to-scroll (touch uses native momentum) ----------- */
  const drag = useRef({ active: false, startX: 0, startLeft: 0 })

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return
    const el = trackRef.current
    if (!el) return
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft }
    setDragging(true) // suspends snap so the drag tracks the cursor 1:1
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.active) return
    const el = trackRef.current
    if (!el) return
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX)
  }
  function endDrag() {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false) // snap re-engages and settles to the nearest card
  }

  return (
    <div className="container-x mt-16 md:mt-20">
      {/* Track — a little vertical padding keeps the hover lift + shadow from
          clipping against the horizontal scroller's edges. */}
      <div
        ref={trackRef}
        role="group"
        aria-label="What sets ASAP Components apart"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={[
          'flex gap-6 overflow-x-auto py-4',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          '[@media(hover:hover)]:cursor-grab [@media(hover:hover)]:active:cursor-grabbing',
          dragging ? 'snap-none select-none' : 'snap-x snap-mandatory',
        ].join(' ')}
      >
        {cards.map((card, i) => (
          <AboutCardItem key={i} card={card} />
        ))}
      </div>

      {/* Arrow nav — end-aware, right-aligned under the row. */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <NavButton label="Previous cards" disabled={atStart} onClick={() => page(-1)}>
          <ArrowLeft size={18} />
        </NavButton>
        <NavButton label="Next cards" disabled={atEnd} onClick={() => page(1)}>
          <ArrowRight size={18} />
        </NavButton>
      </div>
    </div>
  )
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center border border-white/25 text-white transition-colors duration-200 ease-out hover:border-white hover:bg-white hover:text-navy disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/25 disabled:hover:bg-transparent disabled:hover:text-white/25"
    >
      {children}
    </button>
  )
}
