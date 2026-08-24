import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { InstantRfqPanel } from '@/components/rfq/InstantRfqPanel'
import { RfqStartTracker } from '@/components/rfq/RfqStartTracker'
import { RfqTrustSidebar } from '@/components/rfq/RfqTrustSidebar'
import { Certifications } from '@/components/modules/Certifications'
import { COMPANY } from '@/lib/data/site'

export const metadata: Metadata = {
  title: 'Instant RFQ',
  description: 'Request an instant quote for your desired part number. We stock 10M+ obsolete and hard-to-find parts from 5,000+ manufacturers — quoted within 15 minutes.',
}

export default function InstantRfqPage({
  searchParams,
}: {
  searchParams: { partno?: string; qty?: string; email?: string }
}) {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Instant RFQ' }]} />

      {/* G1 · rfq_start event fires once when this page mounts. */}
      <RfqStartTracker source="instant-rfq" partNo={searchParams.partno} />

      {/* B1 · section top-padding tightened here so the RFQ submit control sits
          above the 1080 fold. `section-y` remains the default rhythm elsewhere. */}
      <section className="bg-white pb-[clamp(64px,10vw,160px)] pt-6 lg:pt-8">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow">Instant RFQ</p>
            <h1 className="mt-2 font-display text-h2 font-light tracking-tight-2">Request an instant quote for your part</h1>
            {/* C8 · phone flows from COMPANY. */}
            <p className="mt-3 text-body-lg text-secondary">
              We stock more than 10 million obsolete and hard-to-find parts from 5,000+ manufacturers. Your request will
              be answered within 15 minutes, or call us toll-free at{' '}
              <a href={`tel:${COMPANY.phone}`} className="text-accent">{COMPANY.phone}</a>. We will never share your
              information with any third party.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <InstantRfqPanel defaults={{ partNo: searchParams.partno, qty: searchParams.qty, email: searchParams.email }} />
            <RfqTrustSidebar />
          </div>
        </Container>
      </section>

      <Certifications />
    </>
  )
}
