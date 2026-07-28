'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Plane, AppWindow, Fan, Gauge, CircleDot, Bolt } from 'lucide-react'
import { Container } from '@/components/ui/primitives'

const ICONS: Record<string, typeof Plane> = {
  plane: Plane,
  window: AppWindow,
  engine: Fan,
  gauge: Gauge,
  bearing: CircleDot,
  fastener: Bolt,
}

interface FeaturedItem {
  label: string
  href: string
  icon: string
  image: string
  desc: string
}

export function FeaturedCarousel({ items }: { items: FeaturedItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const GAP = 24 // matches gap-6; advancing clientWidth + one gap lands the next page flush
    el.scrollBy({ left: dir * (el.clientWidth + GAP), behavior: 'smooth' })
  }

  return (
    <section className="section-y bg-surface">
      <Container>
        {/* Header row */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Browse Categories</p>
            <h2 className="mt-4 max-w-2xl font-display text-h2 font-light leading-[1.1] tracking-tight-2 [text-wrap:balance]">
              Start with our most-requested categories.
            </h2>
          </div>
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <CarouselButton label="Previous" onClick={() => scroll(-1)}>
              <ArrowLeft size={18} />
            </CarouselButton>
            <CarouselButton label="Next" onClick={() => scroll(1)}>
              <ArrowRight size={18} />
            </CarouselButton>
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((it) => {
            const Icon = ICONS[it.icon] ?? Plane
            return (
              <Link
                key={it.href}
                href={it.href}
                className="group relative flex min-h-[380px] w-full shrink-0 snap-start flex-col overflow-hidden border border-hairline bg-white p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-hover sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                {/* Part image — revealed on hover */}
                <Image
                  src={it.image}
                  alt={it.label}
                  fill
                  sizes="440px"
                  className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
                {/* Scrim over image for text legibility */}
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(40,42,45,0.35)_0%,rgba(40,42,45,0.8)_100%)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
                {/* hover keyline */}
                <span className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />

                <span className="relative z-10 flex h-12 w-12 items-center justify-center bg-accent text-white">
                  <Icon size={22} strokeWidth={1.75} />
                </span>

                <h3 className="relative z-10 mt-7 font-display text-h4 font-medium text-ink transition-colors duration-300 group-hover:text-white">
                  {it.label}
                </h3>

                <p className="relative z-10 mt-auto pt-12 text-sm leading-relaxed text-secondary transition-colors duration-300 group-hover:text-white/85">
                  {it.desc}
                </p>

                <span className="relative z-10 mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-accent transition-colors duration-300 group-hover:text-white">
                  View parts
                  <ArrowRight size={14} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
    >
      {children}
    </button>
  )
}
