'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ArrowUpRight, Cog, Bolt, CircuitBoard, CircleDot } from 'lucide-react'
import { Container } from '@/components/ui/primitives'

const ICONS: Record<string, typeof Cog> = {
  cog: Cog,
  bolt: Bolt,
  circuit: CircuitBoard,
  disc: CircleDot,
}

// reuse the featured part photos, mapped by icon type
const IMAGES: Record<string, string> = {
  cog: '/featured/components.jpg',
  bolt: '/featured/fasteners.jpg',
  circuit: '/featured/instruments.jpg',
  disc: '/featured/bearings.jpg',
}

interface OrderedItem {
  partNo: string
  family: string
  icon: string
}

export function InDemandCarousel({ items }: { items: OrderedItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const GAP = 16 // matches gap-4
    el.scrollBy({ left: dir * (el.clientWidth + GAP), behavior: 'smooth' })
  }

  return (
    <section className="section-y bg-white">
      <Container>
        {/* Centered title */}
        <h2 className="text-center font-display text-h2 font-light tracking-tight-2">Recently ordered parts</h2>

        {/* Rule row: label + count + arrows */}
        <div className="mt-10 flex items-center gap-4 border-t border-hairline pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">In demand</span>
          <span className="ml-auto font-mono text-xs text-tertiary">
            {String(items.length).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2">
            <CarouselButton label="Previous" onClick={() => scroll(-1)}>
              <ArrowLeft size={16} />
            </CarouselButton>
            <CarouselButton label="Next" onClick={() => scroll(1)}>
              <ArrowRight size={16} />
            </CarouselButton>
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((it, i) => {
            const Icon = ICONS[it.icon] ?? Cog
            return (
              <Link
                key={it.partNo}
                href={`/rfq/search?partno=${encodeURIComponent(it.partNo)}`}
                className="group relative flex aspect-[4/5] w-[calc((100%-1rem)/2)] shrink-0 snap-start flex-col overflow-hidden border border-hairline bg-surface p-5 transition-all duration-300 ease-out hover:border-transparent hover:shadow-hover sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
              >
                {/* Part image — shown by default, darkens on hover */}
                <Image
                  src={IMAGES[it.icon] ?? '/featured/components.jpg'}
                  alt={it.family}
                  fill
                  sizes="360px"
                  className="object-cover"
                />
                {/* Permanent gradient for text legibility */}
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(40,42,45,0.4)_0%,rgba(40,42,45,0.85)_100%)]" />
                {/* Extra darkening layer on hover */}
                <span className="absolute inset-0 bg-[rgba(40,42,45,0.3)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

                <span className="relative z-10 font-mono text-xs text-white/80">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="relative z-10 flex flex-1 items-center justify-center">
                  <Icon size={40} strokeWidth={1.25} className="text-white" />
                </span>

                <div className="relative z-10 text-center">
                  <p className="break-words font-mono text-sm font-medium text-white">{it.partNo}</p>
                  <p className="mt-1 text-xs text-white/70">{it.family}</p>
                </div>

                <ArrowUpRight
                  size={16}
                  className="relative z-10 mx-auto mt-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
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
      className="flex h-10 w-10 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
    >
      {children}
    </button>
  )
}
