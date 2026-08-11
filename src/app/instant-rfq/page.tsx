import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { RfqWithBom } from '@/components/rfq/RfqWithBom'
import { RfqTrustSidebar } from '@/components/rfq/RfqTrustSidebar'
import { Certifications } from '@/components/modules/Certifications'

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

      <section className="section-y bg-white">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow">Instant RFQ</p>
            <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">Request an instant quote for your part</h1>
            <p className="mt-4 text-body-lg text-secondary">
              We stock more than 10 million obsolete and hard-to-find parts from 5,000+ manufacturers. Your request will
              be answered within 15 minutes, or call us toll-free at{' '}
              <a href="tel:+1-714-705-4780" className="text-accent">+1-714-705-4780</a>. We will never share your
              information with any third party.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <RfqWithBom variant="full" defaults={{ partNo: searchParams.partno, qty: searchParams.qty, email: searchParams.email }} />
            <RfqTrustSidebar />
          </div>
        </Container>
      </section>

      <Certifications />
    </>
  )
}
