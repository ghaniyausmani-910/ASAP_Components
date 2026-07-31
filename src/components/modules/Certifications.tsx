import { CERTIFICATIONS } from '@/lib/data/site'
import type { Certification } from '@/lib/types'
import { Container } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

// Two full-bleed carousels stacked and travelling toward each other: the top row
// drifts left, the bottom row drifts right, reading as a calm, always-on signal of
// broad accreditation. The badge set is split in half — the first half rides the top
// row, the second half the bottom — so each row carries its own unique badges with no
// repetition across rows. Cards are sized so one row's set is wider than the viewport;
// otherwise the -50% loop reveals a gap on wide screens (and because the set exceeds
// the viewport, a badge's two loop copies are never on screen at once). Each set is
// duplicated once and the track slides exactly -50%, landing on the seam for a gapless
// infinite loop. Hover pauses the whole strip so a badge stays legible; motion is
// gated behind prefers-reduced-motion (Tailwind's motion-safe), so it degrades to a
// static strip.
export function Certifications({ tone = 'surface' }: { tone?: 'surface' | 'light' }) {
  // First half → top row, second half → bottom row: every badge appears once, and the
  // two rows never share a logo.
  const half = Math.ceil(CERTIFICATIONS.length / 2)
  const topRow = CERTIFICATIONS.slice(0, half)
  const bottomRow = CERTIFICATIONS.slice(half)

  return (
    <section className={tone === 'surface' ? 'bg-surface' : 'bg-white'}>
      <div className="section-y-sm">
        <Container>
          <div className="text-center">
            <p className="eyebrow">Certification &amp; Membership</p>
            <h2 className="mt-3 font-display text-h2 font-light tracking-tight-2 text-ink">
              Built on Compliance &amp; Trust
            </h2>
          </div>
        </Container>

        {/* Full-bleed dual-row marquee. Edge fades dissolve cards into the band
            rather than clipping them hard against the viewport. */}
        <div
          className="group/marquee relative mt-12 flex flex-col gap-4 lg:mt-16"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%)',
          }}
        >
          <MarqueeRow items={topRow} direction="left" />
          <MarqueeRow items={bottomRow} direction="right" />
        </div>
      </div>
    </section>
  )
}

function MarqueeRow({
  items,
  direction,
}: {
  items: Certification[]
  direction: 'left' | 'right'
}) {
  // Duplicate the row so the -50% translate wraps seamlessly. The second copy is
  // aria-hidden so assistive tech meets each certification only once.
  return (
    <div className="flex overflow-hidden">
      <ul
        className={cn(
          'flex w-max shrink-0 items-stretch gap-4 pr-4',
          // Transform-only animation, promoted to its own compositor layer so the
          // continuous loop stays off the main thread and never repaints.
          'motion-safe:animate-marquee motion-safe:[will-change:transform] motion-safe:[backface-visibility:hidden]',
          'motion-safe:group-hover/marquee:[animation-play-state:paused]',
          direction === 'right' && 'motion-safe:[animation-direction:reverse]',
        )}
        style={{ ['--marquee-duration' as string]: '55s' }}
      >
        {items.map((c) => (
          <CertificationCell key={c.name} c={c} />
        ))}
        {items.map((c) => (
          <CertificationCell key={`dup-${c.name}`} c={c} ariaHidden />
        ))}
      </ul>
    </div>
  )
}

function CertificationCell({
  c,
  ariaHidden = false,
}: {
  c: Certification
  ariaHidden?: boolean
}) {
  return (
    <li
      className="w-[15rem] shrink-0 sm:w-[16rem]"
      aria-hidden={ariaHidden || undefined}
    >
      <div className="group flex h-full min-h-[9.5rem] flex-col items-center justify-center gap-3.5 border border-hairline bg-white px-6 py-7 text-center transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-ink/20 hover:shadow-hover">
        {/* Crisp badge — certs stay full-color (unlike the grayscale manufacturer logos) */}
        <span className="flex h-[4.5rem] shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.img}
            alt=""
            loading="lazy"
            className="max-h-[4.5rem] w-auto object-contain"
          />
        </span>
        <span className="text-sm font-medium leading-snug text-ink [text-wrap:balance]">
          {c.name}
        </span>
      </div>
    </li>
  )
}
