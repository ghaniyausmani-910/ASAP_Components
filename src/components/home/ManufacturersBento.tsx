import Link from 'next/link'
import {
  ArrowUpRight,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Shield,
  Radar,
  Flame,
  Droplets,
  Waves,
  Cable,
  SlidersHorizontal,
  Cpu,
  CircuitBoard,
  type LucideIcon,
} from 'lucide-react'
import type { ManufacturerCard } from '@/lib/data/site'
import { cn } from '@/lib/utils'

// Domain → glyph. Keeps the card badges varied and category-legible, echoing the
// icon-tile treatment of the reference layout while staying in the lucide set.
const DOMAIN_ICON: Record<ManufacturerCard['icon'], LucideIcon> = {
  aerostructures: Plane,
  defense: Shield,
  avionics: Radar,
  propulsion: Flame,
  landing: PlaneLanding,
  hydraulics: Droplets,
  fluid: Waves,
  interconnect: Cable,
  controls: SlidersHorizontal,
  semiconductors: Cpu,
  electronics: CircuitBoard,
  airframes: PlaneTakeoff,
}

// Two continuous carousels stacked and travelling toward each other: the top row
// drifts left, the bottom row drifts right, so the eye reads them converging (the
// reference layout). Each row is a marquee — its cards are duplicated once and the
// track slides exactly -50%, landing on the seam for a gapless infinite loop.
// Hover pauses the whole strip so a card can be read/clicked.
export function ManufacturersBento({ items }: { items: ManufacturerCard[] }) {
  const mid = Math.ceil(items.length / 2)
  const topRow = items.slice(0, mid)
  const bottomRow = items.slice(mid)

  return (
    <div
      className="group/marquee relative flex flex-col gap-4"
      // Edge fade so cards dissolve into the section rather than clip hard.
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
      }}
    >
      <MarqueeRow items={topRow} direction="left" />
      <MarqueeRow items={bottomRow} direction="right" />
    </div>
  )
}

function MarqueeRow({
  items,
  direction,
}: {
  items: ManufacturerCard[]
  direction: 'left' | 'right'
}) {
  // Duplicate the row so the -50% translate wraps seamlessly. The second copy is
  // aria-hidden so screen readers only meet each manufacturer once.
  return (
    <div className="flex overflow-hidden">
      <ul
        className={cn(
          'flex w-max shrink-0 items-stretch gap-4 pr-4',
          'motion-safe:animate-marquee motion-safe:group-hover/marquee:[animation-play-state:paused]',
          direction === 'right' && 'motion-safe:[animation-direction:reverse]',
        )}
      >
        {items.map((m) => (
          <ManufacturerCell key={m.slug} m={m} />
        ))}
        {items.map((m) => (
          <ManufacturerCell key={`dup-${m.slug}`} m={m} ariaHidden />
        ))}
      </ul>
    </div>
  )
}

function ManufacturerCell({
  m,
  ariaHidden = false,
}: {
  m: ManufacturerCard
  ariaHidden?: boolean
}) {
  const Icon = DOMAIN_ICON[m.icon]
  return (
    <li className="w-[19rem] shrink-0" aria-hidden={ariaHidden || undefined}>
      <Link
        href={`/catalog/aviation/list/${m.slug}`}
        aria-label={`View ${m.name} parts`}
        tabIndex={ariaHidden ? -1 : undefined}
        className="group relative flex h-full min-h-[15rem] flex-col justify-between border border-hairline bg-surface p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-hover focus-visible:-translate-y-1 focus-visible:border-transparent focus-visible:bg-white focus-visible:shadow-hover focus-visible:outline-none lg:min-h-[16rem] lg:p-7"
      >
        {/* Accent keyline — draws in on hover/focus to single out the active card */}
        <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />

        {/* Badge + reveal cue */}
        <div className="flex items-start justify-between">
          <span className="flex size-11 items-center justify-center border border-hairline bg-white shadow-card transition-colors duration-300 group-hover:border-transparent">
            <Icon size={18} aria-hidden className="text-ink" />
          </span>
          <ArrowUpRight
            size={16}
            aria-hidden
            className="text-accent opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </div>

        {/* Brand + capability */}
        <div className="mt-auto pt-6">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-secondary transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
            {m.domain}
          </p>
          <div className="mt-3 flex h-9 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.logo}
              alt={ariaHidden ? '' : m.name}
              loading="lazy"
              className="max-h-9 w-auto max-w-[75%] object-contain object-left"
            />
          </div>
          <p className="mt-3 text-sm leading-snug text-secondary">{m.blurb}</p>
        </div>
      </Link>
    </li>
  )
}
