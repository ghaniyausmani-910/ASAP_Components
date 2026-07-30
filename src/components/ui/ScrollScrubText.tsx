'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type UseScrollOptions,
} from 'framer-motion'

/* ------------------------------------------------------------------ *
 * ScrollScrubText
 * ------------------------------------------------------------------ *
 * The scroll-linked word-by-word colour reveal, extracted as a
 * standalone, layout-agnostic primitive.
 *
 * Unlike ScrollTextReveal (which owns a whole centered editorial
 * section), this component ONLY renders the given text with the scrub
 * effect. It carries no section, spacing, heading, or photo chrome — so
 * it can be dropped into an existing block and keep that block's layout,
 * element type, and typographic classes untouched. You pass the target
 * element via `as` and its styling via `className`; the words inherit
 * font/size/weight/line-height from that element and only their
 * opacity + colour are scrubbed by scroll progress.
 * ------------------------------------------------------------------ */

/** The two colours each word scrubs between, per background tone.
 *  `from` is the unrevealed colour, `to` is the fully-revealed colour. */
export const SCRUB_TONES = {
  light: {
    from: 'rgb(160, 174, 189)', // soft steel-grey — a legible preview, not near-white
    to: 'rgb(11, 31, 51)', // ink (#0b1f33)
  },
  dark: {
    from: 'rgb(130, 152, 173)', // soft steel-blue (legible on navy)
    to: 'rgb(255, 255, 255)', // white
  },
} as const

/** Fraction of total scroll progress a single word takes to resolve.
 *  Larger than one word-step so adjacent words overlap → a soft band
 *  of colour sweeps through the copy instead of a hard typewriter edge. */
export const WORD_WINDOW = 0.12
/** Word reveals are spread across this leading portion of progress so the
 *  final words still finish (reach `to`) at, or just before, 100%. */
export const SPREAD = 0.9
/** Opacity floor for an unrevealed word — kept clearly below the revealed
 *  text but still legible, so pending copy reads as a soft preview. */
export const MIN_OPACITY = 0.5

export interface ScrollScrubTextProps {
  /** The copy to reveal. A single string, split on whitespace into words. */
  children: string
  /** Element to render as (e.g. 'h2', 'p'). Defaults to 'p'. */
  as?: React.ElementType
  /** Colour treatment for the background this sits on. Defaults to `light`. */
  tone?: keyof typeof SCRUB_TONES
  /** Classes applied to the rendered element — the words inherit its type. */
  className?: string
  /** useScroll offset controlling when the scrub starts/finishes. Default
   *  starts as the block enters the lower viewport and finishes near the
   *  middle, so the copy is fully revealed before it scrolls past. */
  offset?: UseScrollOptions['offset']
}

export function ScrollScrubText({
  children,
  as: Tag = 'p',
  tone = 'light',
  className,
  offset = ['start 0.85', 'end 0.5'],
}: ScrollScrubTextProps) {
  const t = SCRUB_TONES[tone]
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  // Progressive-enhancement gate: server + first client render output plain,
  // fully-legible text (hydration-safe); the scrubbed spans swap in on mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const animate = mounted && !reduceMotion

  const { scrollYProgress } = useScroll({ target: ref, offset })

  const words = children.trim().split(/\s+/)
  const totalWords = words.length

  return (
    // Default colour comes from `className` (the block's own colour) so the
    // no-JS / pre-mount / reduced-motion output is fully legible; animated
    // spans override colour per-word only once mounted.
    <Tag ref={ref} className={className}>
      {words.map((word, i) => {
        // This word's scrub window within [0, 1] of scroll progress.
        const start = (i / totalWords) * SPREAD
        const end = Math.min(start + WORD_WINDOW, 1)

        return animate ? (
          <RevealWord
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            from={t.from}
            to={t.to}
          >
            {word}
          </RevealWord>
        ) : (
          <span key={i}>{word} </span>
        )
      })}
    </Tag>
  )
}

/* ------------------------------------------------------------------ *
 * RevealWord — one scroll-scrubbed word.
 *
 * Each word owns its own pair of useTransform hooks (one component per
 * word keeps the hook count stable and avoids calling hooks in a loop).
 * opacity + color are mapped from the word's [start, end] slice of the
 * parent's scroll progress. useTransform clamps outside the range, so
 * before `start` the word rests at `from`/low-opacity and after `end` it
 * holds at full `to` — the reveal simply scrubs with the scrollbar.
 * ------------------------------------------------------------------ */
export function RevealWord({
  progress,
  range,
  from,
  to,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number]
  from: string
  to: string
  children: React.ReactNode
}) {
  const opacity = useTransform(progress, range, [MIN_OPACITY, 1])
  const color = useTransform(progress, range, [from, to])

  return (
    <motion.span style={{ opacity, color }} className="inline">
      {children}{' '}
    </motion.span>
  )
}
