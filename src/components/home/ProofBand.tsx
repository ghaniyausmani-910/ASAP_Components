'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * ProofBand — the "by the numbers" proof section.
 *
 * A grayscale aerospace photo sits on the left; on the right, three
 * pillars (Scale / Speed / Trust) stack as an accordion beside a slim
 * vertical rail. Selecting a pillar expands its figure, supporting line
 * and CTA, and slides the rail's fill to mark the active pillar.
 *
 * One pillar is always open (tab-like); the first renders open on load
 * so the section is complete before any interaction. The rail fill
 * tracks the active pillar's live position via a ResizeObserver, so it
 * follows the expand/collapse animation smoothly. All motion honours
 * prefers-reduced-motion.
 *
 * Implements Figma node 3153:240 (ASAP – CMS), adapted to the site's
 * tokens: Sora display heading, Inter pillar lines, navy accent, square
 * hairlines.
 * ------------------------------------------------------------------ */

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export interface ProofPillar {
  id: string
  /** The pillar's headline / spec line — always visible. */
  heading: string
  /** Small accent figure shown when the pillar is open. */
  figure: string
  /** Supporting line shown when the pillar is open. */
  body: string
  /** Photo shown on the left while this pillar is active. */
  image: { src: string; alt: string; /** object-position for the cover crop; defaults to center. */ position?: string }
  cta: { label: string; href: string }
}

const PROOF_PILLARS: ProofPillar[] = [
  {
    id: 'scale',
    heading: '5,100+ manufacturers · 40 Federal Supply Classes',
    figure: '5M+ parts',
    body: 'One traceable catalog spanning board-level to airframe.',
    image: {
      src: '/about/warehouse-aisle.jpg',
      alt: 'Rows of labelled parts bins on warehouse racking, spanning the full catalog',
    },
    cta: { label: 'Request a Quote', href: '/instant-rfq' },
  },
  {
    id: 'speed',
    heading: '24/7 × 365 · Same-day delivery on AOG',
    figure: '15-minute RFQs',
    body: 'Guaranteed quote responses within fifteen minutes, every hour of every day.',
    image: {
      src: '/partners.jpg',
      alt: 'Palletized freight being loaded into the cargo hold of a wide-body aircraft',
    },
    cta: { label: 'Request AOG', href: '/instant-rfq' },
  },
  {
    id: 'trust',
    heading: 'AS9120B · ISO 9001:2015 · FAA AC 00-56B',
    figure: '100% traceable',
    body: 'Full chain-of-custody documentation on every part we ship.',
    image: {
      src: '/operations-floor.jpg',
      alt: 'ASAP operations floor — specialists inspecting and packing parts against stocked shelving',
    },
    cta: { label: 'View Quality & Certifications', href: '/quality' },
  },
]

export function ProofBand({ pillars = PROOF_PILLARS }: { pillars?: ProofPillar[] }) {
  const [activeId, setActiveId] = useState(pillars[0]?.id)
  const activePillar = pillars.find((p) => p.id === activeId) ?? pillars[0]
  const reduce = useReducedMotion()

  // Vertical rail fill — tracks the active pillar's box within the column.
  const columnRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const [fill, setFill] = useState({ top: 0, height: 0 })

  const measure = useCallback(() => {
    const el = itemRefs.current[activeId]
    if (!el) return
    setFill({ top: el.offsetTop, height: el.offsetHeight })
  }, [activeId])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const col = columnRef.current
    if (!col || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measure())
    ro.observe(col)
    Object.values(itemRefs.current).forEach((el) => el && ro.observe(el))
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  function onKeyNav(e: React.KeyboardEvent, index: number) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const dir = e.key === 'ArrowDown' ? 1 : -1
    const next = (index + dir + pillars.length) % pillars.length
    setActiveId(pillars[next].id)
  }

  return (
    <section className="bg-white text-ink">
      <div className="container-x section-y">
        {/* Header */}
        <p className="eyebrow">By the numbers</p>
        <h2 className="mt-3 max-w-3xl font-display text-h2 font-light leading-[1.1] tracking-tight-2 text-ink [text-wrap:balance]">
          The scale behind every mission-critical order.
        </h2>

        {/* Row: photo · rail · pillars */}
        <div className="mt-10 flex flex-col gap-8 lg:mt-16 lg:h-[400px] lg:flex-row lg:items-stretch lg:gap-10">
          {/* Left — aerospace photo, crossfades with the active pillar */}
          <div className="relative aspect-[1033/519] w-full overflow-hidden bg-ink-900 lg:aspect-auto lg:h-[400px] lg:w-[55%]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={activePillar.id}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <Image
                  src={activePillar.image.src}
                  alt={activePillar.image.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: activePillar.image.position ?? 'center' }}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — vertical rail + accordion column */}
          <div className="flex flex-1 gap-6 lg:gap-8">
            <div
              aria-hidden
              className="relative hidden w-[2px] shrink-0 self-stretch bg-hairline lg:block"
            >
              <div
                className="absolute left-0 w-[2px] bg-ink motion-safe:transition-[top,height] motion-safe:duration-500 motion-safe:ease-out"
                style={{ top: fill.top, height: fill.height }}
              />
            </div>

            <ul ref={columnRef} className="relative flex flex-1 flex-col gap-11 lg:justify-between lg:gap-8">
              {pillars.map((p, i) => {
                const isActive = p.id === activeId
                const panelId = `proof-panel-${p.id}`
                return (
                  <li
                    key={p.id}
                    ref={(el) => {
                      itemRefs.current[p.id] = el
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      onClick={() => setActiveId(p.id)}
                      onKeyDown={(e) => onKeyNav(e, i)}
                      className="block w-full text-left"
                    >
                      <span
                        className={cn(
                          'block font-display text-[22px] font-normal leading-snug tracking-tight-2 transition-colors duration-300',
                          isActive ? 'text-ink' : 'text-secondary hover:text-ink',
                        )}
                      >
                        {p.heading}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={panelId}
                          role="region"
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col items-start gap-5 pt-5">
                            <div className="flex flex-col gap-3">
                              <p className="font-display text-lg font-light tracking-tight-2 text-accent">
                                {p.figure}
                              </p>
                              <p className="max-w-[52ch] text-body-lg leading-relaxed text-secondary">
                                {p.body}
                              </p>
                            </div>
                            <Link
                              href={p.cta.href}
                              className="inline-flex items-center rounded-[4px] bg-accent px-4 py-2.5 font-body text-sm font-semibold tracking-[0.02em] text-white transition-colors duration-300 hover:bg-accent-hover"
                            >
                              {p.cta.label}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
