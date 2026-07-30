import Link from 'next/link'
import Image from 'next/image'
import { Container, Section, SectionHeading, Eyebrow } from '@/components/ui/primitives'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ScrollTextReveal } from '@/components/ui/ScrollTextReveal'
import { ScrollScrubText } from '@/components/ui/ScrollScrubText'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { InDemandCarousel } from '@/components/home/InDemandCarousel'
import { ManufacturersSplit } from '@/components/home/ManufacturersSplit'
import { CatalogExplorer } from '@/components/home/CatalogExplorer'
import { ProofBand } from '@/components/home/ProofBand'
import { HeroInquiryBar } from '@/components/home/HeroInquiryBar'
import { Certifications } from '@/components/modules/Certifications'
import {
  FEATURED_HOME, RECENTLY_ORDERED, CATALOG_EXPLORER, MANUFACTURER_CARDS,
} from '@/lib/data/site'

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

        {/* Heading block — fills the hero, anchored above the docked bar */}
        <Container className="relative z-10 flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14">
          <div className="max-w-4xl animate-fade">
            <p className="eyebrow !text-white/70">Aerospace &amp; Defense Parts Distributor</p>
            <div className="w-fit">
              <h1 className="mt-5 font-display text-[clamp(2.75rem,6vw,5.5rem)] font-[440] leading-[1.02] tracking-tight-3 [text-shadow:0_2px_40px_rgba(11,31,51,0.5)] [text-wrap:balance]">
                Proudly Supporting
                <br />
                <span className="whitespace-nowrap text-slate-300">The USA and her Allies</span>
              </h1>
              <p className="mt-6 text-body-lg text-white/80 [text-shadow:0_1px_16px_rgba(11,31,51,0.5)]">
                Mission-critical aerospace and defense parts — sourced, quoted, and delivered through a
                fully traceable, U.S.-based supply chain.
              </p>
            </div>
          </div>
        </Container>

        {/* Inquiry bar — full-bleed frosted-navy control bar docked to the hero's base */}
        <div className="relative z-10 animate-fade">
          <HeroInquiryBar />
        </div>
      </section>

      {/* 3 · FEATURED AVIATION PARTS — carousel */}
      <FeaturedCarousel items={FEATURED_HOME} />

      {/* 4 · ABOUT — scroll-scrubbed editorial reveal (content only; animation lives in the component) */}
      <ScrollTextReveal
        label="About Us"
        heading="Searching. Securing. Shipping."
        paragraphs={[
          'ASAP Components, a digital platform by ASAP Semiconductor, simplifies sourcing for civil aviation, military aerospace, and board-level parts. Built around customer feedback, the platform organizes military components by National Stock Numbers across 40 Federal Supply Classes. It features dedicated, intuitive sections for commercial aircraft avionics, engines, assemblies, and over 5 million board-level components, including specialized connectors and interconnects.',
        ]}
        cards={[
          { icon: 'badge', title: 'Certified distributor', body: 'AS9120B, ISO 9001:2015, and FAA AC 00-56B accredited.' },
          { icon: 'timer', title: 'RFQs in 15 minutes', body: 'Round-the-clock quote responses, 365 days a year.' },
          { icon: 'layers', title: '5M+ board-level parts', body: 'Connectors, interconnects, and components in one catalog.' },
          { icon: 'boxes', title: 'NSN-organized inventory', body: 'Military parts mapped across 40 Federal Supply Classes.' },
          { icon: 'truck', title: 'Same-day delivery', body: 'Expedited fulfillment for your most urgent requirements.' },
          { icon: 'route', title: 'Traceable supply chain', body: 'Full documentation and supply-chain integrity, end to end.' },
        ]}
      />

      {/* 5 · RECENTLY ORDERED PARTS — carousel */}
      <InDemandCarousel items={RECENTLY_ORDERED} />

      {/* 5.5 · MISSION STATEMENT (tighter vertical spacing) */}
      {/* Same section/heading as before — only the reveal changed from a
          block fade to the scroll-scrubbed word reveal used in About Us. */}
      <section className="bg-white pb-20 pt-6 lg:pb-[120px] lg:pt-10">
        <Container>
          <ScrollScrubText
            as="h2"
            tone="light"
            className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-[1.15] tracking-tight-2 text-ink lg:max-w-[90%]"
          >
            ASAP-Components provides round-the-clock RFQ responses within 15 minutes, 365 days a year, backed by
            top-tier industry standards as an AS9120B, ISO 9001:2015, and FAA AC 00-56B certified distributor.
            ASAP-Components guarantees supply chain integrity while offering same-day delivery to seamlessly meet
            your most challenging requirements.
          </ScrollScrubText>
        </Container>
      </section>

      {/* 6 · MANUFACTURERS — sticky ASAP-culture photo + streaming card grid */}
      <Section className="!pb-16 lg:!pb-24">
        <Container>
          <ScrollReveal>
            {/* Header — eyebrow above; heading left with the CTA aligned to its
                right edge on desktop, dropping below the heading on mobile. */}
            <p className="eyebrow">Manufacturers</p>
            <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
              <h2 className="font-display text-h2 font-light leading-[1.12] tracking-tight-2 text-ink">
                5,100+ trusted names.{" "}
                <span className="text-tertiary">Every part traceable.</span>
              </h2>
              <Link
                href="/catalog/aviation/manufacturers"
                className="btn btn-outline shrink-0 self-start md:self-auto"
              >
                View all manufacturers
              </Link>
            </div>
          </ScrollReveal>

          <ManufacturersSplit items={MANUFACTURER_CARDS} />
        </Container>
      </Section>

      {/* 7 · TOP AEROSPACE PART CATEGORIES */}
      <Section tone="surface">
        <Container>
          <ScrollReveal>
            <SectionHeading eyebrow="Explore the catalog" title="Top aerospace part categories" center />
          </ScrollReveal>
          <CatalogExplorer columns={CATALOG_EXPLORER} />
        </Container>
      </Section>

      {/* 7.5 · STATS — interactive proof band (Scale / Speed / Trust) */}
      <ProofBand />

      {/* 8 · CERTIFICATIONS */}
      <Certifications />

      {/* 9 · PLEDGE */}
    </>
  )
}


