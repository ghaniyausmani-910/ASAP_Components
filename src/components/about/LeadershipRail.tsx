'use client'

import { useRef, useState } from 'react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Container } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

/**
 * Leadership — a cinematic "focus rail" for /about-us.
 *
 * A row of tall navy-scrimmed plates. The focused plate expands to reveal a
 * one-line bio while its neighbours compress to a slim spine that carries the
 * name vertically — a filmstrip that always keeps one panel "in focus". Focus
 * follows hover, click, and keyboard (← → / Home / End); the expansion itself
 * is the progress indicator, so no extra chrome is needed.
 *
 * On brand (DESIGN.md): navy monochrome, square/sharp hairline seams, light
 * Sora display, hierarchy from weight + fill not hue. Because we have no
 * photography, each plate is a deep-navy gradient + faint engineering grid
 * (the PageHero texture) with an oversized monogram — honest, no fake headshots.
 *
 * Motion discipline (overdrive): the flex expansion + reveal run only under
 * `motion-safe`; `prefers-reduced-motion` collapses to equal-width plates with
 * every bio shown, and below `lg` the rail becomes a static card grid. Content
 * (name / role / bio) lives in the DOM for every plate regardless of focus, so
 * assistive tech and headless renders never see an empty section.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER PEOPLE — names, roles, and bios below are invented stand-ins.
 * Swap them (and add a `photo` field if/when real portraits exist) with the
 * real ASAP Components leadership before shipping. Everything else is final.
 * ─────────────────────────────────────────────────────────────────────────
 */

type Leader = {
  name: string
  role: string
  bio: string
  /** Portrait for the plate. Intentionally omitted for now — the client will
   *  supply real headshots. When provided (self-hosted under /public/about),
   *  PlateBackground renders it under the scrim; until then the plate shows the
   *  deep-navy backdrop alone. No stand-in/stock imagery. */
  photo?: string
}

const LEADERS: Leader[] = [
  {
    name: 'Marcus Feld',
    role: 'President & Chief Executive Officer',
    bio: 'Sets the strategy that turns a 10-million-part catalog into a same-day sourcing partner for civil and defense programs.',
  },
  {
    name: 'Elena Vasquez',
    role: 'VP, Global Sourcing & Procurement',
    bio: 'Runs the 5,100-manufacturer supplier network and vendor relationships behind every quote we return.',
  },
  {
    name: 'David Chen',
    role: 'Director, Quality & Compliance',
    bio: 'Owns the AS9120B and ISO 9001:2015 systems that keep every shipment fully traceable and audit-ready.',
  },
  {
    name: 'Priya Nair',
    role: 'Head of AOG Rapid-Response',
    bio: 'Leads the 24/7 desk that gets AOG-critical hardware identified, quoted, and moving in minutes.',
  },
  {
    name: 'James Whitmore',
    role: 'VP, Customer Success',
    bio: 'Makes sure procurement teams stay on schedule from first quote through delivery and reorder.',
  },
]

export function LeadershipRail() {
  const [active, setActive] = useState(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % LEADERS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + LEADERS.length) % LEADERS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = LEADERS.length - 1
    if (next === null) return
    e.preventDefault()
    setActive(next)
    btnRefs.current[next]?.focus()
  }

  return (
    <section className="bg-white">
      <div className="section-y">
        <Container>
          <ScrollReveal className="max-w-2xl">
            <p className="eyebrow">Leadership</p>
            <h2 className="mt-3 font-display text-h2 font-light tracking-tight-2 text-balance text-ink">
              The people behind the platform
            </h2>
            <p className="mt-4 text-body-lg text-secondary">
              A senior team spanning sourcing, quality, and rapid response — the operators who keep
              aerospace, marine, and defense programs supplied without the friction of the traditional
              supply chain.
            </p>
          </ScrollReveal>
        </Container>

        <Container className="mt-12 lg:mt-16">
          {/* Desktop / tablet-wide: the focus rail */}
          <ScrollReveal>
            <div
              className="hidden gap-1 lg:flex lg:h-[clamp(440px,52vh,560px)]"
              role="group"
              aria-label="ASAP Components leadership"
            >
              {LEADERS.map((l, i) => {
                const isActive = i === active
                return (
                  <button
                    key={l.name}
                    ref={(el) => {
                      btnRefs.current[i] = el
                    }}
                    type="button"
                    aria-expanded={isActive}
                    aria-label={`${l.name}, ${l.role}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className={cn(
                      'group relative isolate flex basis-0 grow cursor-pointer overflow-hidden bg-ink-900 text-left',
                      'motion-safe:transition-[flex-grow] motion-safe:duration-700 motion-safe:[transition-timing-function:cubic-bezier(.22,1,.36,1)]',
                      isActive && 'motion-safe:grow-[4.5]',
                    )}
                  >
                    <PlateBackground photo={l.photo} isActive={isActive} />

                    {/* Content sits at the bottom of the plate */}
                    <div className="relative z-10 flex h-full w-full items-end p-5 lg:p-6">
                      {/* Collapsed spine: name runs vertically so it reads in a
                          narrow column. Hidden under reduced motion. */}
                      <span
                        aria-hidden
                        className={cn(
                          'pointer-events-none absolute inset-x-0 bottom-6 mx-auto w-fit whitespace-nowrap font-display text-base font-light tracking-tight-2 text-white/85 [writing-mode:vertical-rl] rotate-180',
                          'motion-safe:transition-opacity motion-safe:duration-300',
                          isActive && 'opacity-0',
                          'motion-reduce:hidden',
                        )}
                      >
                        {l.name}
                      </span>

                      {/* Expanded block: full name, role, bio. Present in the DOM
                          for every plate (SR / no-JS safe); visually revealed for
                          the focused plate, and for all plates under reduced motion. */}
                      <div
                        className={cn(
                          'w-full max-w-md',
                          'motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out',
                          isActive
                            ? 'opacity-100 motion-safe:translate-y-0'
                            : 'pointer-events-none opacity-0 motion-safe:translate-y-3',
                          'motion-reduce:pointer-events-auto motion-reduce:opacity-100',
                        )}
                      >
                        <span
                          aria-hidden
                          className="block h-px w-10 bg-white/40 motion-safe:transition-[width] motion-safe:duration-500"
                        />
                        <h3 className="mt-4 whitespace-nowrap font-display text-h4 font-light tracking-tight-2 text-white">
                          {l.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-white/70">{l.role}</p>
                        <p className="mt-3 text-sm leading-relaxed text-white/60">{l.bio}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollReveal>

          {/* Mobile / narrow: a static stack — every card fully expanded */}
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:hidden">
            {LEADERS.map((l) => (
              <li key={l.name} className="relative isolate overflow-hidden bg-ink-900">
                <PlateBackground photo={l.photo} isActive />
                <div className="relative z-10 flex min-h-[15rem] flex-col justify-end p-6">
                  <span aria-hidden className="block h-px w-10 bg-white/40" />
                  <h3 className="mt-4 font-display text-h4 font-light tracking-tight-2 text-white">
                    {l.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-white/70">{l.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{l.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  )
}

/**
 * Shared plate backdrop: an optional photo under a bottom-heavy navy scrim.
 * When a photo is supplied it sits slightly dimmed + desaturated while idle and
 * warms to full colour on focus; the scrim keeps the white name/role/bio
 * legible over any image (DESIGN.md §2 usage rule, §7 imagery).
 *
 * No photo yet (awaiting client imagery): the plate is the deep-navy backdrop
 * (bg-ink-900 on the parent) plus this scrim — the container, expansion, and
 * hover/focus micro-interactions are unchanged.
 */
function PlateBackground({ photo, isActive }: { photo?: string; isActive: boolean }) {
  return (
    <>
      {/* Photo layer — rendered only once a real portrait is supplied.
          object-top keeps faces in frame as the plate narrows; on load error
          (offline/CSP) it hides itself, leaving the navy plate as a clean
          fallback. */}
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          className={cn(
            'absolute inset-0 -z-10 h-full w-full object-cover object-top',
            'motion-safe:transition-[transform,filter,opacity] motion-safe:duration-700 motion-safe:[transition-timing-function:cubic-bezier(.22,1,.36,1)]',
            isActive
              ? 'opacity-100 [filter:saturate(1)] motion-safe:scale-105'
              : 'opacity-90 [filter:saturate(0.55)_brightness(0.85)]',
          )}
        />
      )}
      {/* Navy scrim — bottom-heavy for text legibility */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,31,51,0.20)_0%,rgba(11,31,51,0.45)_48%,rgba(7,21,34,0.90)_100%)]"
      />
    </>
  )
}
