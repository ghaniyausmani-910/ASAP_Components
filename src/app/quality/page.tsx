import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container, PageHero } from '@/components/ui/primitives'
import { CERTIFICATIONS } from '@/lib/data/site'

export const metadata: Metadata = {
  title: 'Quality',
  description: 'ASAP Components quality assurance: AS9120B, ISO 9001:2015, FAA AC 00-56B, and ITAR certified, with a fully traceable supply chain.',
}

export default function QualityPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Quality' }]} />
      <PageHero
        eyebrow="Quality assurance"
        title="Quality and compliance at every level of operation"
        intro="We are dedicated to exceeding export-compliance and quality-control standards across every interface of the ASAP brand."
      />
      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((c) => (
              <div key={c.name} className="border border-hairline p-6">
                <ShieldCheck size={24} className="text-accent" />
                <h2 className="mt-4 font-display text-base font-medium">{c.name}</h2>
                <p className="mt-2 text-sm text-secondary">{c.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
