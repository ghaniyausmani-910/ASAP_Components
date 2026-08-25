'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useScroll, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { RevealWord, WORD_WINDOW, SPREAD } from './ScrollScrubText'
import { AboutCards, type AboutCard } from '@/components/home/AboutCards'

/* ------------------------------------------------------------------ *
 * ScrollTextReveal
 * ------------------------------------------------------------------ *
 * A premium, Apple/Stripe/Digidop-style scroll-linked text reveal.
 *
 * The heading is always fully visible. The paragraphs render as
 * individual words that scrub from a dim, low-opacity colour to full
 * colour, driven DIRECTLY by scroll progress — no Intersection-Observer
 * fade-in, no translateY, no one-shot animation. Only opacity + color
 * are interpolated.
 *
 * Works on a light or dark (navy) background via the `tone` prop:
 *   light → grey → ink text on white
 *   dark  → muted steel → white text on navy
 *
 * Content (label / heading / paragraphs / cta) is passed in as props
 * so the animation logic stays fully decoupled from the copy.
 * ------------------------------------------------------------------ */

/** Per-tone styling + the two colours each word scrubs between.
 *  `from` is the unrevealed colour, `to` is the fully-revealed colour. */
const TONES = {
  light: {
    section: 'bg-white',
    label: 'text-tertiary',
    heading: 'text-ink',
    body: 'text-ink', // no-JS / pre-mount fallback colour — fully legible
    cta: 'text-ink border-ink/30 hover:border-ink',
    from: 'rgb(160, 174, 189)', // soft steel-grey — a legible preview, not near-white
    to: 'rgb(11, 31, 51)', // ink (#0b1f33)
  },
  dark: {
    section: 'bg-navy', // #0d2b44 deep navy
    label: 'text-white/60',
    heading: 'text-white',
    body: 'text-white',
    cta: 'text-white border-white/30 hover:border-white',
    from: 'rgb(130, 152, 173)', // soft steel-blue (legible on navy)
    to: 'rgb(255, 255, 255)', // white
  },
} as const

// The per-word scrub primitive (`RevealWord`) and its tuning constants
// (`WORD_WINDOW`, `SPREAD`, opacity floor) live in ./ScrollScrubText as the
// single source of truth; this section imports them so the About reveal and
// the standalone ScrollScrubText stay pixel-for-pixel identical.

export interface ScrollTextRevealProps {
  /** Small uppercase label above the heading (e.g. "About Us"). */
  label?: string
  /** Heading — always fully visible, never animated. */
  heading: React.ReactNode
  /** Body copy; each string is one paragraph that scrubs word-by-word. */
  paragraphs: string[]
  /** Optional call-to-action rendered below the copy. */
  cta?: { href: string; label: string }
  /** Optional full-bleed photo strip below the copy that continues the
   *  scroll animation, drifting horizontally as the reader keeps scrolling. */
  photos?: { src: string; alt: string }[]
  /** Optional value-prop card carousel rendered below the copy. Six cards,
   *  three per view on desktop; see AboutCards for the shape + copy slot. */
  cards?: AboutCard[]
  /** Optional actions row rendered inside the section, left-aligned to
   *  the container gutter, below the cards. Use for section-closing CTAs
   *  that should live inside the About band rather than in a follow-up strip. */
  footer?: React.ReactNode
  /** Background/colour treatment. Defaults to `dark` (navy). */
  tone?: keyof typeof TONES
  className?: string
}

export function ScrollTextReveal({
  label,
  heading,
  paragraphs,
  cta,
  photos,
  cards,
  footer,
  tone = 'dark',
  className,
}: ScrollTextRevealProps) {
  const t = TONES[tone]
  const contentRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // Progressive-enhancement gate. On the server and the first client
  // render we output plain, fully-legible text (so the copy reads with
  // JS disabled and hydration matches exactly). The scroll-driven spans
  // are swapped in only after mount. About-Us sits below the fold, so
  // this swap happens off-screen — no visible flash.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const animate = mounted && !reduceMotion

  // Scroll progress tied to the CONTENT block (not the padded section),
  // so the scrub aligns with the copy's actual passage through the
  // reading zone rather than being diluted by the section's whitespace.
  // 0 → content top sits ~80% down the viewport; 1 → content bottom has
  // travelled up to the mid-line. The wide span keeps the reveal slow.
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start 0.8', 'end 0.5'],
  })

  // Flatten every word to a single running index so the reveal sweeps
  // continuously across all paragraphs (para 1 resolves before para 2).
  const totalWords = paragraphs.reduce((n, p) => n + p.trim().split(/\s+/).length, 0)
  let wordIndex = 0

  return (
    <section
      className={cn(
        // Large, centered, editorial. Generous vertical whitespace.
        'pt-[120px] pb-[60px]',
        t.section,
        className,
      )}
    >
      <div ref={contentRef} className="mx-auto max-w-[1200px] px-6 text-center">
        {label && <p className={cn('eyebrow mb-6', t.label)}>{label}</p>}

        {/* Heading — always visible, unaffected by scroll. */}
        <h2 className={cn('mx-auto font-display text-[48px] font-normal leading-[1.1] tracking-tight-2 whitespace-nowrap', t.heading)}>
          {heading}
        </h2>

        <div className="mx-auto mt-10 max-w-[54ch] space-y-6 text-[1.5rem] leading-[1.6] [text-wrap:pretty] md:mt-12">
          {paragraphs.map((paragraph, pIdx) => {
            const words = paragraph.trim().split(/\s+/)
            return (
              // Default colour is the revealed colour so no-JS / pre-mount
              // output is fully legible; animated spans override per-word.
              <p key={pIdx} className={t.body}>
                {words.map((word, i) => {
                  const gi = wordIndex++
                  // This word's scrub window within [0, 1] of scroll progress.
                  const start = (gi / totalWords) * SPREAD
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
                    // Static fallback: reduced-motion or not-yet-mounted.
                    <span key={i}>{word} </span>
                  )
                })}
              </p>
            )
          })}
        </div>

        {cta && (
          <div className="mt-12">
            <Link
              href={cta.href}
              className={cn(
                'inline-flex items-center gap-2 border-b pb-1 font-display text-lg transition-colors',
                t.cta,
              )}
            >
              {cta.label}
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>

      {/* Full-bleed auto-scrolling photo carousel — lives OUTSIDE the centered
          copy column so it spans edge-to-edge, and runs continuously on its own. */}
      {photos && photos.length > 0 && (
        <PhotoMarquee photos={photos} />
      )}

      {/* Value-prop card carousel — sits below the copy, inside the same
          section so it shares the navy band. Any `footer` slot renders on
          the arrow row so section CTAs top-align with the nav controls. */}
      {cards && cards.length > 0 && <AboutCards cards={cards} actions={footer} />}
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * PhotoMarquee — a full-bleed, continuously auto-scrolling photo carousel.
 *
 * Every card is a UNIFORM size; the row slides left forever, independent
 * of the reader's scroll. Built on the same marquee primitive the rest of
 * the site uses (Tailwind `animate-marquee`): the photos are duplicated
 * once and the track translates exactly -50%, landing on the seam for a
 * gapless infinite loop. Hover pauses it; `motion-safe` disables the
 * motion under prefers-reduced-motion; a mask fades both edges into the
 * section. Corners stay sharp — ASAP design language.
 * ------------------------------------------------------------------ */
function PhotoMarquee({ photos }: { photos: { src: string; alt: string }[] }) {
  // Duplicate once so the -50% translate wraps seamlessly; the copy is
  // aria-hidden so assistive tech meets each photo only once.
  const loop = [...photos.map((p) => ({ ...p, dup: false })), ...photos.map((p) => ({ ...p, dup: true }))]

  return (
    <div
      className="group/marquee relative mt-20 w-full overflow-hidden md:mt-28"
      // Edge fade so cards dissolve into the section rather than clip hard.
      style={{
        maskImage: 'linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%)',
      }}
    >
      <ul
        className="flex w-max shrink-0 items-stretch gap-2 pr-2 motion-safe:animate-marquee motion-safe:group-hover/marquee:[animation-play-state:paused]"
        style={{ ['--marquee-duration' as string]: '48s' }}
      >
        {loop.map((p, i) => (
          <li
            key={i}
            aria-hidden={p.dup || undefined}
            // Uniform card — identical width + height for every photo.
            className="relative aspect-[4/3] h-[clamp(200px,25vw,320px)] shrink-0 overflow-hidden rounded-[2px] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]"
          >
            <Image
              src={p.src}
              alt={p.dup ? '' : p.alt}
              fill
              sizes="(max-width: 768px) 60vw, 30vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
