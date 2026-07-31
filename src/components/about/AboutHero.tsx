import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'
import type { Crumb } from '@/components/layout/Breadcrumb'
import { AboutCarousel } from '@/components/about/AboutCarousel'

/**
 * Header for the dedicated /about-us page.
 *
 * Structure follows the reference: a clean band up top carrying the headline
 * and CTAs, then a full-bleed team photo marquee directly below (AboutCarousel)
 * — the copy is never overlaid on the images, so the people read clearly, and
 * the strip drifts slowly on its own. Rendered in ASAP's
 * own language (DESIGN.md §2–§5): a subtle cool `surface` band rather than the
 * reference's cream, tight/light Sora display, square hairline buttons, RFQ as
 * the primary action. The shared PageHero primitive is intentionally untouched.
 *
 * Motion is a visible-by-default CSS load reveal (`.about-rise` in globals): a
 * hero must never gate its content behind an observer that can stall in a
 * headless or backgrounded render.
 */
export function AboutHero({
  crumbs,
  eyebrow = 'Who we are',
  title,
  intro,
}: {
  crumbs: Crumb[]
  eyebrow?: string
  title: string
  intro?: string
}) {
  return (
    <header>
      {/* Band — headline + CTAs, centered on a subtle surface tint */}
      <section className="bg-surface">
        <div className="container-x pt-5">
          {/* Breadcrumb keeps its utilitarian left alignment */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-tertiary">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={14} className="text-hairline" />}
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-accent">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-ink">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="mx-auto flex max-w-3xl flex-col items-center pb-12 pt-10 text-center lg:pb-16 lg:pt-14">
            {eyebrow && (
              <p className="about-rise eyebrow" style={{ ['--rise-delay' as string]: '0ms' }}>
                {eyebrow}
              </p>
            )}
            <h1
              className="about-rise mt-4 font-display text-h1 font-extralight tracking-tight-2 text-balance"
              style={{ ['--rise-delay' as string]: '80ms' }}
            >
              {title}
            </h1>
            {intro && (
              <p
                className="about-rise mt-5 max-w-2xl text-body-lg text-secondary text-pretty"
                style={{ ['--rise-delay' as string]: '160ms' }}
              >
                {intro}
              </p>
            )}

            <div
              className="about-rise mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
              style={{ ['--rise-delay' as string]: '240ms' }}
            >
              <Link href="/instant-rfq" className="btn btn-primary group">
                Send Instant RFQ
                <ArrowRight
                  size={16}
                  className="transition-transform duration-[var(--dur)] ease-out group-hover:translate-x-1"
                />
              </Link>
              <Link href="/contact-us" className="btn btn-outline">
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed team photo marquee — slow, seamless horizontal scroll */}
      <AboutCarousel />
    </header>
  )
}
