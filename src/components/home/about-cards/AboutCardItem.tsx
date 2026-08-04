'use client'

import Image from 'next/image'
import {
  BadgeCheck,
  Boxes,
  Layers,
  Route,
  Timer,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import type { AboutCardData, AboutIcon } from './types'

const ICONS: Record<AboutIcon, LucideIcon> = {
  badge: BadgeCheck,
  timer: Timer,
  layers: Layers,
  boxes: Boxes,
  truck: Truck,
  route: Route,
}

/* ------------------------------------------------------------------ *
 * AboutCardItem — a static, text-only card in the aligned row.
 *
 * Icon top-left, title + description anchored to the bottom. When the card has
 * a background photo it sits behind a navy scrim so the copy stays legible; on
 * hover (pointer devices) the card lifts, the photo zooms + brightens, the icon
 * tile fills, an accent keyline sweeps in, and the copy sharpens.
 * ------------------------------------------------------------------ */
export function AboutCardItem({ card }: { card: AboutCardData }) {
  const Icon = ICONS[card.icon] ?? BadgeCheck

  return (
    <article className="relative min-h-[clamp(340px,38vw,460px)] w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
      <div
        className={[
          'group relative flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.035] p-8',
          'transition-[transform,box-shadow,border-color] duration-[420ms] ease-out',
          '[@media(hover:hover)]:hover:z-10 [@media(hover:hover)]:hover:scale-[1.02] [@media(hover:hover)]:hover:border-white/20 [@media(hover:hover)]:hover:shadow-[0_22px_50px_-40px_rgba(0,0,0,0.55)]',
        ].join(' ')}
      >
        {/* Background photo + navy scrim (only when the card supplies an image). */}
        {card.image && (
          <>
            <Image
              src={card.image}
              alt={card.imageAlt ?? ''}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
              className="object-cover object-center transition-transform duration-[600ms] ease-out [@media(hover:hover)]:group-hover:scale-105"
            />
            {/* Legibility scrim — navy (#0d2b44), heaviest at the bottom where the
                copy sits, lighter at the top so the photo reads. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,43,68,0.88)_0%,rgba(13,43,68,0.60)_45%,rgba(13,43,68,0.12)_100%)]"
            />
            {/* Extra dim by default; lifts on hover so the photo brightens. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-[rgba(13,43,68,0.18)] opacity-100 transition-opacity duration-[500ms] ease-out [@media(hover:hover)]:group-hover:opacity-0"
            />
          </>
        )}

        {/* Accent keyline sweeps in from the left edge on hover — the site-wide
            hover treatment (FeaturedCarousel / ManufacturersBento / ContactCards).
            Solid white (the on-dark accent) + h-0.5 + 300ms to match those cards;
            full opacity keeps it a crisp, deliberate edge over the photography
            rather than the faded line a translucent fill produced. */}
        <span className="absolute inset-x-0 top-0 z-20 h-0.5 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-x-100" />

        {/* Icon tile — outline by default, fills solid on hover. */}
        <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/80 transition-colors duration-[400ms] ease-out [@media(hover:hover)]:group-hover:border-white [@media(hover:hover)]:group-hover:bg-white [@media(hover:hover)]:group-hover:text-navy">
          <Icon size={20} strokeWidth={1.75} aria-hidden />
        </span>

        {/* Copy — lifts slightly and sharpens on hover. */}
        <div className="relative z-10 mt-auto transition-transform duration-[420ms] ease-out [@media(hover:hover)]:group-hover:-translate-y-1">
          <h3 className="font-display text-[1.35rem] font-medium leading-tight tracking-tight-2 text-white">
            {card.title}
          </h3>
          <p className="mt-3 max-w-[34ch] text-[0.98rem] leading-relaxed text-white/70 transition-colors duration-[350ms] ease-out [@media(hover:hover)]:group-hover:text-white/90">
            {card.body}
          </p>
        </div>
      </div>
    </article>
  )
}
