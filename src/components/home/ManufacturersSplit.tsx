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
    <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12">
      {/* Left — pinned ASAP-culture photograph. `self-start` keeps it from
          stretching to the grid-row height so `sticky` has room to travel. */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <figure className="relative aspect-[4/5] overflow-hidden border border-hairline bg-surface sm:aspect-[16/10] lg:aspect-[3/4]">
          <Image
            src="/about/warehouse-aisle.jpg"
            alt="ASAP Components warehouse aisle lined floor-to-ceiling with catalogued aerospace parts inventory"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
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

function ManufacturerCell({ m }: { m: ManufacturerCard }) {
  return (
    <li>
      <Link
        href={`/catalog/aviation/list/${m.slug}`}
        aria-label={`View ${m.name} parts`}
        className="group relative flex h-full min-h-[10.5rem] flex-col justify-between border border-hairline bg-surface p-5 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-hover focus-visible:-translate-y-1 focus-visible:border-transparent focus-visible:bg-white focus-visible:shadow-hover focus-visible:outline-none lg:min-h-[11.5rem] lg:p-6"
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

        {/* Brand + capability */}
        <div className="mt-auto">
          <div className="flex h-8 items-center">
            {/* Fixed height (not max-height) so every logo renders at the same
                optical size regardless of its intrinsic aspect ratio. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.logo}
              alt={m.name}
              loading="lazy"
              className="h-7 w-auto max-w-full object-contain object-left"
            />
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-snug text-secondary">{m.blurb}</p>
        </div>
      </Link>
    </li>
  )
}
