import Link from 'next/link'
import Image from 'next/image'
import { Container, Section, SectionHeading, Eyebrow } from '@/components/ui/primitives'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { InDemandCarousel } from '@/components/home/InDemandCarousel'
import { HeroInquiryBar } from '@/components/home/HeroInquiryBar'
import { Certifications } from '@/components/modules/Certifications'
import {
  FEATURED_HOME, RECENTLY_ORDERED, TOP_FSCS, HOT_PART_NUMBERS, MANUFACTURER_LOGOS,
} from '@/lib/data/site'

const HOME_STATS = [
  { value: '10M+', label: 'Obsolete & hard-to-find parts in inventory' },
  { value: '5,100+', label: 'Trusted and verified manufacturers' },
  { value: '15 min', label: 'Average quote turnaround, 24/7' },
  { value: '100%', label: 'Orders fulfilled in the U.S.A.' },
]

export default function HomePage() {
  return (
    <>
      {/* 1 · HERO — full-bleed defense photo, Caladan-style with inquiry bar */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-900 text-white">
        {/* Background photo */}
        <Image
          src="/hero.jpg"
          alt="A commercial airliner with a red engine cowl taxiing on an airport runway at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Navy grade (reduced) + whitish light lift + readability scrims */}
        <div className="absolute inset-0 bg-ink/22" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,51,0.6)_0%,rgba(11,31,51,0.2)_48%,rgba(11,31,51,0)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_68%_18%,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(62%_60%_at_40%_25%,rgba(56,132,204,0.2)_0%,rgba(56,132,204,0)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(11,31,51,0.72)_0%,rgba(11,31,51,0)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(11,31,51,0.42),rgba(11,31,51,0))]" />

        <Container className="relative z-10 flex flex-1 flex-col justify-end pb-8 pt-32 md:pb-12">
          {/* Heading block */}
          <div className="max-w-4xl animate-fade">
            <p className="eyebrow !text-white/70">Aerospace &amp; Defense Parts Distributor</p>
            <h1 className="mt-5 font-display text-[clamp(2.75rem,6vw,5.5rem)] font-light leading-[1.02] tracking-tight-3 [text-shadow:0_2px_40px_rgba(11,31,51,0.5)] [text-wrap:balance]">
              Proudly Supporting
              <br />
              <span className="whitespace-nowrap text-white/55">The USA and her Allies</span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-white/80 [text-shadow:0_1px_16px_rgba(11,31,51,0.5)]">
              Mission-critical aerospace and defense parts — sourced, quoted, and delivered through a fully
              traceable, U.S.-based supply chain.
            </p>
          </div>

          {/* Inquiry bar */}
          <div className="mt-10 animate-fade md:mt-14">
            <HeroInquiryBar />
          </div>
        </Container>
      </section>

      {/* 3 · FEATURED AVIATION PARTS — carousel */}
      <FeaturedCarousel items={FEATURED_HOME} />

      {/* 4 · ABOUT — statement + stats (dark navy) */}
      <Section tone="navy">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
            <ScrollReveal>
              <p className="eyebrow !text-white/75">About Us</p>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p className="font-display text-h3 font-light leading-[1.35] tracking-tight-2 text-white lg:text-[2rem] lg:leading-[1.3]">
                ASAP Components is the latest digital platform by ASAP Semiconductor for the sourcing of civil aviation
                and military aviation parts as well as board-level components. All of our military aerospace parts are
                organized under 40 federal supply classes with their corresponding NIINs, federal supply classes, and
                federal supply groups that comprise each national stock number.
              </p>

              <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/15 pt-10 md:mt-16 md:grid-cols-4 md:gap-0">
                {HOME_STATS.map((s) => (
                  <div key={s.label} className="md:border-l md:border-white/[0.12] md:pl-6 md:first:border-l-0 md:first:pl-0">
                    <dt className="font-display text-[2.25rem] font-extralight leading-none tracking-tight-2 text-white sm:text-[2.5rem]">
                      {s.value}
                    </dt>
                    <dd className="mt-3 max-w-[18ch] text-sm leading-snug text-white/60">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 5 · RECENTLY ORDERED PARTS — carousel */}
      <InDemandCarousel items={RECENTLY_ORDERED} />

      {/* 5.5 · MISSION STATEMENT (tighter vertical spacing) */}
      <section className="bg-white pb-20 pt-6 lg:pb-24 lg:pt-10">
        <Container>
          <ScrollReveal>
            <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-[1.15] tracking-tight-2 text-ink lg:max-w-[90%]">
              ASAP-Components provides round-the-clock RFQ responses within 15 minutes, 365 days a year, backed by
              top-tier industry standards as an AS9120B, ISO 9001:2015, and FAA AC 00-56B certified distributor.
              ASAP-Components guarantees supply chain integrity while offering same-day delivery to seamlessly meet
              your most challenging requirements.
            </h2>
          </ScrollReveal>
        </Container>
      </section>

      {/* 6 · TOP AEROSPACE PART CATEGORIES */}
      <Section tone="surface">
        <Container>
          <ScrollReveal>
            <SectionHeading eyebrow="Explore the catalog" title="Top aerospace part categories" center />
          </ScrollReveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <ListPanel title="Top Trending FSCs" items={TOP_FSCS} hrefBase="/catalog/nsn/fsc" />
            <ListPanel
              title="Top Demanding NSN"
              items={['5340-01-560-3234', '5935-01-278-3059', '5310-01-414-2030', '2915-01-641-6570', '4730-00-908-9516', '1560-01-190-8815', '6150-01-414-8386', '1680-01-449-6743']}
              hrefBase="/catalog/nsn/nsn"
              mono
            />
            <ListPanel title="Hot Stock Part Numbers" items={HOT_PART_NUMBERS} hrefBase="/rfq/search" mono search />
          </div>
        </Container>
      </Section>

      {/* 7 · MANUFACTURERS — image + copy + logo grid */}
      <Section>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left — image */}
            <ScrollReveal>
              <div className="relative aspect-[4/3] overflow-hidden border border-hairline">
                <Image
                  src="/partners.jpg"
                  alt="Widebody aircraft being loaded with cargo on the flight line"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Subtle charcoal scrim — matches the product-card imagery family */}
                <span className="absolute inset-0 bg-[rgba(40,42,45,0.2)]" />
              </div>
            </ScrollReveal>

            {/* Right — copy + logos + CTA */}
            <ScrollReveal delay={100}>
              <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-light leading-[1.3] tracking-tight-2 text-ink">
                We source from the aerospace industry&apos;s most trusted names, 5,100+ manufacturers, every part
                fully traceable.
              </p>

              <p className="eyebrow mt-10">Trusted by 5,100+ manufacturers</p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {MANUFACTURER_LOGOS.map((logo) => (
                  <div
                    key={logo.name}
                    className="group flex h-20 items-center justify-center border border-hairline bg-surface px-4 transition-colors hover:border-inputline"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      className="max-h-8 w-auto max-w-[80%] object-contain"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/catalog/aviation/manufacturers" className="btn btn-outline">View all manufacturers</Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 8 · CERTIFICATIONS */}
      <Certifications />

      {/* 9 · PLEDGE */}
    </>
  )
}

function ListPanel({
  title,
  items,
  hrefBase,
  mono = false,
  search = false,
}: {
  title: string
  items: string[]
  hrefBase: string
  mono?: boolean
  search?: boolean
}) {
  return (
    <ScrollReveal className="flex h-full flex-col border border-hairline bg-white">
      <p className="border-b border-hairline px-5 py-4 font-display text-base font-medium">{title}</p>
      <ul className="flex-1 divide-y divide-hairline">
        {items.map((it) => (
          <li key={it}>
            <Link
              href={search ? `${hrefBase}?partno=${encodeURIComponent(it)}` : hrefBase}
              className={`block px-5 py-3 text-sm text-secondary transition-colors hover:bg-surface hover:text-accent ${mono ? 'font-mono' : ''}`}
            >
              {it}
            </Link>
          </li>
        ))}
      </ul>
      <Link href={hrefBase} className="border-t border-hairline px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
        View more →
      </Link>
    </ScrollReveal>
  )
}
