import Image from 'next/image'

/**
 * Full-bleed photo marquee for the /about-us hero.
 *
 * Replaces the single team photograph with a slow, continuous horizontal
 * scroll of the ASAP floor: a row of edge-to-edge photos that drifts left
 * forever and seamlessly loops. The mechanic is CSS-only (`.about-marquee*`
 * in globals) — the track holds the photo set twice and translates by exactly
 * -50%, so the second copy arrives where the first began and the seam is
 * invisible. No JS, no observer: the strip is fully painted on first render,
 * matching the hero's "never gate content behind motion" rule (see AboutHero).
 *
 * Rendered in ASAP's own language (DESIGN.md §2–§5): square 2px corners,
 * hairline separation between frames, navy floor behind, undarkened photos.
 * Hovering the strip pauses the scroll; reduced-motion stops it outright.
 */

type Slide = { src: string; alt: string }

const SLIDES: Slide[] = [
  { src: '/about/team-cart.jpg', alt: 'ASAP Components staff moving parts across the warehouse floor' },
  { src: '/about/warehouse-aisle.jpg', alt: 'Numbered bin aisles stocked with inventory' },
  { src: '/about/packing-station.jpg', alt: 'Orders being prepared at the packing station' },
  { src: '/about/bin-picking.jpg', alt: 'A team member picking parts from stock bins' },
  { src: '/about/desk-review.jpg', alt: 'Quote and order review at a workstation' },
  { src: '/about/box-taping.jpg', alt: 'A shipment sealed in ASAP-branded packaging' },
  { src: '/about/leadership-review.jpg', alt: 'Leadership reviewing operations' },
  { src: '/about/truck-loading.jpg', alt: 'Outbound shipments loaded for delivery' },
]

// Duration scales with the number of frames so per-photo dwell time stays
// constant no matter how many are added: ~7.5s of travel per frame.
const MARQUEE_DURATION = `${SLIDES.length * 7.5}s`

export function AboutCarousel() {
  // Rendered twice back-to-back to give the -50% translate a seamless wrap.
  const track = [...SLIDES, ...SLIDES]

  return (
    <div className="about-marquee relative w-full overflow-hidden bg-surface pb-[40px]">
      <div
        className="about-marquee-track flex w-max"
        style={{ ['--marquee-dur' as string]: MARQUEE_DURATION }}
      >
        {track.map((slide, i) => (
          // Gap lives as a right margin on every frame (not flex `gap`) so each
          // cell is identical width and the -50% loop stays perfectly seamless.
          <div
            key={i}
            aria-hidden={i >= SLIDES.length}
            className="relative aspect-square h-[clamp(260px,36vw,480px)] w-[clamp(260px,36vw,480px)] shrink-0 mr-[clamp(10px,1.4vw,22px)] overflow-hidden rounded-[2px]"
          >
            <Image
              src={slide.src}
              alt={i < SLIDES.length ? slide.alt : ''}
              fill
              sizes="(max-width: 640px) 80vw, 34vw"
              priority={i === 0}
              unoptimized
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
