import type { Metadata } from 'next'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutVision } from '@/components/about/AboutVision'
import { LeadershipRail } from '@/components/about/LeadershipRail'
import { Container } from '@/components/ui/primitives'
import { Certifications } from '@/components/modules/Certifications'
import { EndPageCta } from '@/components/modules/EndPageCta'

export const metadata: Metadata = {
  title: 'About ASAP',
  description:
    'ASAP Components is a parts-distribution platform owned and operated by ASAP Semiconductor LLC, serving civil and defense markets across aerospace, marine, and commercial industries.',
}

const STATS = [
  { value: '10M+', label: 'Parts available' },
  { value: '5,100+', label: 'Manufacturers' },
  { value: '15 min', label: 'Quote turnaround' },
  { value: '100%', label: 'U.S.A. fulfilled' },
]

export default function AboutPage() {
  return (
    <>
      <AboutHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About ASAP' }]}
        eyebrow="Who we are"
        title="A strategic purchasing partner — not just another distributor"
        intro="ASAP Components is a parts-distribution interface owned and operated by ASAP Semiconductor LLC, serving civil and defense markets across the aerospace, marine, and commercial industries."
      />

      {/* Stats */}
      <section className="border-t border-b border-hairline bg-white">
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

      <AboutVision />

      <LeadershipRail />

      <EndPageCta />

      <Certifications />
    </>
  )
}
