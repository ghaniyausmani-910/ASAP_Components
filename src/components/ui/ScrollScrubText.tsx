'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
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
 *
 * Optionally, `emphasize` marks key phrases: as the scrub reaches such a
 * phrase, a square ~10% navy-tint marker-highlight wipes in left→right
 * behind it (an extra layer on top of the per-word colour scrub). The
 * emphasized words keep resolving to ink and stay legible on the light
 * tint. Hierarchy comes from fill, never hue — see DESIGN.md.
 * ------------------------------------------------------------------ */

/** Per background tone: the two colours each word scrubs between (`from`
 *  unrevealed → `to` revealed), plus the emphasis pair — the marker-fill
 *  and the colour emphasized words resolve to so they read on that fill. */
export const SCRUB_TONES = {
  light: {
    from: 'rgb(160, 174, 189)', // soft steel-grey — a legible preview, not near-white
    to: 'rgb(11, 31, 51)', // ink (#0b1f33)
    emphasisTo: 'rgb(11, 31, 51)', // ink — reads on the light ~10% navy tint fill
    highlight: 'var(--color-highlight)', // ~10% navy tint marker fill
  },
  dark: {
    from: 'rgb(130, 152, 173)', // soft steel-blue (legible on navy)
    to: 'rgb(255, 255, 255)', // white
    emphasisTo: 'rgb(11, 31, 51)', // ink — reads on the light marker fill
    highlight: 'rgb(255, 255, 255)', // light fill on a dark band
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
/** Emphasis marker height. Fixed and shorter than the line box so a wrapped
 *  phrase leaves a visible gap between the bands on stacked lines. */
export const BAND_HEIGHT = '48px'

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
  /** Exact substrings to emphasize. Each match gets a square navy-tint
   *  marker-highlight that wipes in as the scrub reaches it. */
  emphasize?: string[]
}

/* ------------------------------------------------------------------ *
 * Tokenizer — split the copy into words while tagging which words fall
 * inside an `emphasize` phrase. Returns a flat list where each token is
 * either a plain word or a group of consecutive words sharing a phrase.
 * Char-offset matching means punctuation rides along naturally
 * (e.g. "minutes," overlaps the "15 minutes" range).
 * ------------------------------------------------------------------ */
interface WordToken {
  word: string
  index: number // global word index → drives its scrub window
  phrase: number // -1 if not emphasized, else the emphasize[] index
}
interface RenderGroup {
  phrase: number // -1 = plain run, else emphasize[] index
  words: WordToken[]
}

function tokenize(text: string, emphasize: string[]): RenderGroup[] {
  // 1. Locate each phrase's [start, end) character range within the raw text.
  const ranges = emphasize
    .map((p) => {
      const start = text.indexOf(p)
      return start === -1 ? null : { start, end: start + p.length }
    })
    .filter((r): r is { start: number; end: number } => r !== null)

  const phraseOf = (charStart: number, charEnd: number) =>
    ranges.findIndex((r) => charStart < r.end && charEnd > r.start)

  // 2. Walk words, tracking character offsets so we can test overlap.
  const words: WordToken[] = []
  const re = /\S+/g
  let m: RegExpExecArray | null
  let index = 0
  while ((m = re.exec(text)) !== null) {
    const charStart = m.index
    const charEnd = charStart + m[0].length
    words.push({ word: m[0], index, phrase: phraseOf(charStart, charEnd) })
    index++
  }

  // 3. Coalesce consecutive words sharing a phrase into render groups.
  const groups: RenderGroup[] = []
  for (const w of words) {
    const last = groups[groups.length - 1]
    if (last && last.phrase === w.phrase && w.phrase !== -1) {
      last.words.push(w)
    } else if (last && last.phrase === -1 && w.phrase === -1) {
      last.words.push(w)
    } else {
      groups.push({ phrase: w.phrase, words: [w] })
    }
  }
  return groups
}

export function ScrollScrubText({
  children,
  as: Tag = 'p',
  tone = 'light',
  className,
  offset = ['start 0.85', 'end 0.5'],
  emphasize,
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

  const text = children.trim()
  const groups = tokenize(text, emphasize ?? [])
  const totalWords = groups.reduce((n, g) => n + g.words.length, 0)

  // Each word i owns a [start, end] slice of [0,1] scroll progress.
  const wordRange = (i: number): [number, number] => {
    const start = (i / totalWords) * SPREAD
    return [start, Math.min(start + WORD_WINDOW, 1)]
  }

  // `noTrailingSpace` drops the space after the final word of a group so an
  // emphasized phrase's highlight doesn't extend past its last word — the
  // separating space is rendered outside the highlight instead. Emphasized
  // words resolve to `emphasisTo` (white) so they read on the navy fill.
  const renderWords = (words: WordToken[], { noTrailingSpace = false, emphasized = false } = {}) =>
    words.map((w, i) => {
      const [start, end] = wordRange(w.index)
      const trailingSpace = !(noTrailingSpace && i === words.length - 1)
      return animate ? (
        <RevealWord
          key={w.index}
          progress={scrollYProgress}
          range={[start, end]}
          from={t.from}
          to={emphasized ? t.emphasisTo : t.to}
          trailingSpace={trailingSpace}
        >
          {w.word}
        </RevealWord>
      ) : (
        <span key={w.index} style={emphasized ? { color: t.emphasisTo } : undefined}>
          {w.word}
          {trailingSpace ? ' ' : ''}
        </span>
      )
    })

  return (
    // Default colour comes from `className` (the block's own colour) so the
    // no-JS / pre-mount / reduced-motion output is fully legible; animated
    // spans override colour per-word only once mounted.
    <Tag ref={ref} className={className}>
      {groups.map((g, gi) => {
        if (g.phrase === -1) return <span key={`p${gi}`}>{renderWords(g.words)}</span>
        // Emphasized phrase: highlight wipes across the phrase's own window,
        // from its first word's start to its last word's end.
        const first = g.words[0].index
        const last = g.words[g.words.length - 1].index
        const [wStart] = wordRange(first)
        const [, wEnd] = wordRange(last)
        return (
          <span key={`e${gi}`}>
            <PhraseHighlight progress={scrollYProgress} range={[wStart, wEnd]} fill={t.highlight} animate={animate}>
              {renderWords(g.words, { noTrailingSpace: true, emphasized: true })}
            </PhraseHighlight>{' '}
          </span>
        )
      })}
    </Tag>
  )
}

/* ------------------------------------------------------------------ *
 * PhraseHighlight — a square marker-highlight that wipes in behind an
 * emphasized phrase as the scrub reaches it.
 *
 * The fill is a solid linear-gradient painted as the background and
 * revealed by animating `background-size` width 0%→100% (paint only, no
 * layout thrash). `box-decoration-break: clone` makes the wipe span line
 * breaks correctly, so a phrase that wraps (the cert cluster on mobile)
 * still highlights every fragment. When not animating (pre-mount /
 * reduced-motion) the highlight is shown fully filled and static so the
 * emphasis still reads with no JS.
 * ------------------------------------------------------------------ */
function PhraseHighlight({
  progress,
  range,
  fill,
  animate,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number]
  fill: string
  animate: boolean
  children: React.ReactNode
}) {
  const pct = useTransform(progress, range, ['0%', '100%'])
  // The band is sized shorter than the line box (BAND_HEIGHT) and vertically
  // centred, so when a phrase wraps the stacked bands leave a clear gap
  // between lines instead of tiling the full line-height and touching.
  const backgroundSize = useMotionTemplate`${pct} ${BAND_HEIGHT}`

  const baseStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${fill}, ${fill})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    // Horizontal padding only: gives the band breathing room around the text
    // and separation from neighbouring words. Vertical size/gap is handled by
    // BAND_HEIGHT + centred position, not padding, so lines never collide.
    padding: '0 0.28em',
    WebkitBoxDecorationBreak: 'clone',
    boxDecorationBreak: 'clone',
  }

  if (!animate) {
    return (
      <span style={{ ...baseStyle, backgroundSize: `100% ${BAND_HEIGHT}` }} className="inline">
        {children}
      </span>
    )
  }

  return (
    <motion.span style={{ ...baseStyle, backgroundSize }} className="inline">
      {children}
    </motion.span>
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
  trailingSpace = true,
}: {
  progress: MotionValue<number>
  range: [number, number]
  from: string
  to: string
  children: React.ReactNode
  /** Append a trailing space after the word. Defaults to true (kept for
   *  backward compatibility with ScrollTextReveal). */
  trailingSpace?: boolean
}) {
  const opacity = useTransform(progress, range, [MIN_OPACITY, 1])
  const color = useTransform(progress, range, [from, to])

  return (
    <motion.span style={{ opacity, color }} className="inline">
      {children}{trailingSpace ? ' ' : ''}
    </motion.span>
  )
}
