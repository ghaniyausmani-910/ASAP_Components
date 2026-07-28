import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container, PageHero } from '@/components/ui/primitives'
import { QuickQuote } from '@/components/modules/QuickQuote'
import { WhyChooseUs } from '@/components/modules/WhyChooseUs'
import { Certifications } from '@/components/modules/Certifications'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'ASAP Components is a parts-distribution platform owned and operated by ASAP Semiconductor LLC, serving civil and defense markets across aerospace, marine, and commercial industries.',
}

const STATS = [
  { value: '10M+', label: 'Parts available' },
  { value: '5,100+', label: 'Manufacturers' },
  { value: '15 min', label: 'Quote turnaround' },
  { value: '100%', label: 'U.S.A. fulfilled' },
]

const METHOD = [
  'Cross-reference parts and platforms by NSN, NIIN, CAGE code, part number, part type, manufacturer, aircraft type, ATA chapter, and FAA standards.',
  'Navigate long-lead-time and hard-to-find NSN parts with ease.',
  'Provide customized solutions and instant quoting.',
  'Fulfill AOG requirements with expedited shipping.',
  'Utilize our network of trusted MRO and FBO resources.',
]

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
      <PageHero
        eyebrow="Who we are"
        title="A strategic purchasing partner — not just another distributor"
        intro="ASAP Components is a parts-distribution interface owned and operated by ASAP Semiconductor LLC, serving civil and defense markets across the aerospace, marine, and commercial industries."
      />

      {/* Stats */}
      <section className="border-b border-hairline bg-white">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-hairline border-x border-hairline lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="px-6 py-8 text-center">
                <div className="font-display text-h2 font-extralight tracking-tight-2 text-navy">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.08em] text-tertiary">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Body + sidebar */}
      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <ScrollReveal className="max-w-2xl">
              <h2 className="font-display text-h3 font-light tracking-tight-2">Who we are</h2>
              <p className="mt-4 text-body-lg text-secondary">
                As part of the ASAP brand, we are focused on providing our clients with comprehensive parts information,
                right at their fingertips. We developed our multifaceted platform to simplify the parts-purchasing
                process and provide the most responsive service across the industries we serve.
              </p>

              <h3 className="mt-10 font-display text-h4 font-medium">You can rely on the ASAP method to:</h3>
              <ul className="mt-4 space-y-3">
                {METHOD.map((m) => (
                  <li key={m} className="flex items-start gap-3">
                    <Check size={18} className="mt-1 shrink-0 text-accent" />
                    <span className="text-secondary">{m}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 font-display text-h4 font-medium">Our keystone principles</h3>
              <p className="mt-4 text-secondary">
                The ASAP brand is steadfast in its commitment to providing expert B2B solutions our clients can depend
                on. We are dedicated to exceeding export compliance and quality-control standards at every level of
                operation. All interfaces of the ASAP Brand are included under AS9120B and ISO 9001:2015 certification
                and FAA AC 00-56B accreditation.
              </p>
              <p className="mt-4 text-secondary">
                We operate with the vision that we are a strategic purchasing partner, not just a distributor. With the
                most responsive account management in the industry, you can always count on person-to-person
                communication — never automation — when it comes to customer service. As a proud supporter of the
                Intrepid Fallen Heroes Fund, we invest in the strength of our community.
              </p>
            </ScrollReveal>

            <aside className="space-y-6">
              <div className="border border-hairline">
                <p className="bg-navy px-5 py-3 font-display text-sm font-medium text-white">Send Instant RFQ</p>
                <div className="p-5"><QuickQuote variant="card" /></div>
              </div>
              <WhyChooseUs />
            </aside>
          </div>
        </Container>
      </section>

      <Certifications />
    </>
  )
}
