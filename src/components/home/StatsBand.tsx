'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * StatsBand — a navy proof band that counts its figures up the first
 * time it scrolls into view. Four editorial stats sit on the site's
 * dark tone (deep-navy → ink), each a large display numeral with a
 * hairline-separated label, mirroring the About/Certifications bands.
 *
 * The count-up respects prefers-reduced-motion (jumps straight to the
 * final value) and only ever runs once per mount.
 * ------------------------------------------------------------------ */

export interface Stat {
  /** Numeric target the figure counts up to. */
  value: number
  /** Text shown before the number, e.g. '$'. */
  prefix?: string
  /** Text shown after the number, e.g. '+', 'M+', '%'. */
  suffix?: string
  /** Short caption under the figure. */
  label: string
}

const DEFAULT_STATS: Stat[] = [
  { value: 5, suffix: 'M+', label: 'Board-level parts in one traceable catalog' },
  { value: 5100, suffix: '+', label: 'Manufacturers across the aerospace industry' },
  { value: 40, suffix: '', label: 'Federal Supply Classes of NSN-organized inventory' },
  { value: 15, suffix: ' min', label: 'RFQ responses, round-the-clock, 365 days a year' },
]

export function StatsBand({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="bg-white text-ink">
      <div ref={ref} className="container-x py-16 lg:py-24">
        <p className="eyebrow">By the numbers</p>
        <h2 className="mt-3 max-w-3xl font-display text-h2 font-light tracking-tight-2 text-ink">
          The scale behind every mission-critical order.
        </h2>

        <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border-y border-hairline sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:border">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 border-hairline px-2 py-8 sm:px-6 lg:px-8 lg:py-10 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r"
            >
              <dd className="font-display text-[clamp(2.75rem,5vw,4rem)] font-[440] leading-none tracking-tight-3 text-ink">
                {stat.prefix}
                <Counter target={stat.value} run={shown} />
                {stat.suffix}
              </dd>
              <dt className="max-w-[26ch] text-sm leading-relaxed text-secondary">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** Eases an integer from 0 → target once `run` flips true. Honors
 *  prefers-reduced-motion by snapping directly to the target. */
function Counter({ target, run }: { target: number; run: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!run) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(target)
      return
    }

    const DURATION = 1600
    let raf = 0
    let start: number | null = null

    const tick = (now: number) => {
      if (start === null) start = now
      const t = Math.min((now - start) / DURATION, 1)
      // easeOutExpo — fast then settles, matching the site's --ease-out feel.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target])

  return <span className={cn('tabular-nums')}>{display.toLocaleString('en-US')}</span>
}
