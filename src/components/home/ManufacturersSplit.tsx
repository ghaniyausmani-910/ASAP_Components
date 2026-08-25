import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { ManufacturerCard } from '@/lib/data/site'

// Sticky-split manufacturers section (Adyen "platform of choice" pattern, in the
// ASAP navy-monochrome language): a tall ASAP-culture photo pins on the left while
// the manufacturer card grid streams past on the right. Two columns, sized so the
// first fold reveals a full row plus the next peeking — a scroll cue for the rest.
export function ManufacturersSplit({ items }: { items: ManufacturerCard[] }) {
  return (
    <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-5">
      {/* Left — pinned ASAP-culture photograph. `self-start` keeps it from
          stretching to the grid-row height so `sticky` has room to travel. */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <figure className="relative aspect-[4/5] overflow-hidden border border-hairline bg-surface sm:aspect-[16/10] lg:aspect-[24/25]">
          <Image
            src="/team/ASAP-Semiconductor-TNK-Photo-2024-111.jpg"
            alt="ASAP Components team members handling a packaged part beside a branded parts cart in the warehouse"
            fill
            quality={95}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          {/* Faint navy floor so the hairline frame reads against a bright shot */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,51,0)_55%,rgba(11,31,51,0.28)_100%)]"
          />
        </figure>
      </div>

      {/* Right — manufacturer card stream */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {items.map((m) => (
          <ManufacturerCell key={m.slug} m={m} />
        ))}
      </ul>
    </div>
  )
}

// Optical normalization map (keyed by slug). The source logos share the same
// pixel height but read at wildly different visual weights: bold wide wordmarks
// (Honeywell, Harwin) dominate, while compact or dense marks (GE, De Havilland)
// look lost. Locking every logo to one CSS height therefore does NOT make them
// look equal — it just makes them equal in a dimension the eye doesn't measure.
// Instead each logo gets an individually-tuned render height (px) so the whole
// wall reads at one balanced optical size. Values tuned against the live grid.
const LOGO_HEIGHT: Record<string, number> = {
  honeywell: 36,
  harwin: 38,
  eaton: 48,
  'parker-hannifin': 46,
  goodrich: 52,
  'ge-aviation': 56,
  'the-boeing-company': 44,
  'lockheed-martin': 46,
  flextronics: 42,
  'freescale-semiconductor': 45,
  'bosch-rexroth': 50,
  'de-havilland-aircraft-of-canada': 50,
}
const DEFAULT_LOGO_HEIGHT = 44

function ManufacturerCell({ m }: { m: ManufacturerCard }) {
  const logoHeight = LOGO_HEIGHT[m.slug] ?? DEFAULT_LOGO_HEIGHT
  return (
    <li>
      <Link
        href={`/catalog/aviation/list/${m.slug}`}
        aria-label={`View ${m.name} parts`}
        className="group relative flex h-full min-h-[240px] flex-col border border-hairline bg-surface p-5 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-hover focus-visible:-translate-y-1 focus-visible:border-transparent focus-visible:bg-white focus-visible:shadow-hover focus-visible:outline-none lg:min-h-[240px] lg:p-6"
      >
        {/* Accent keyline — draws in on hover/focus to single out the active card */}
        <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />

        {/* Reveal cue */}
        <div className="flex justify-end">
          <ArrowUpRight
            size={16}
            aria-hidden
            className="text-accent opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </div>

        {/* Logo — the hero of the card. Left-aligned in a generous zone that fills
            the card body so the brand is unmistakably the focal point. Height is
            optically normalized per brand (see LOGO_HEIGHT). */}
        <div className="flex flex-1 items-center py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.logo}
            alt={m.name}
            loading="lazy"
            // Height is the per-brand optical control; maxWidth caps the widest
            // wordmarks so none spans the full card — object-contain then trims
            // their effective height to match, pulling the whole wall together.
            style={{ height: logoHeight, maxWidth: '12.5rem' }}
            className="w-auto object-contain object-left"
          />
        </div>

        {/* Capability — supporting context, de-emphasized beneath the logo */}
        <p className="line-clamp-2 text-[0.8125rem] leading-snug text-tertiary">
          {m.blurb}
        </p>
      </Link>
    </li>
  )
}
