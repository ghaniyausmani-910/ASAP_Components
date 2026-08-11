import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { RfqWithBom } from '@/components/rfq/RfqWithBom'
import { RfqTrustSidebar } from '@/components/rfq/RfqTrustSidebar'
import { SearchBar } from '@/components/ui/SearchBar'
import { Certifications } from '@/components/modules/Certifications'

export const metadata: Metadata = {
  title: 'Search RFQ',
  description: 'Get an online quote for your searched part number.',
}

export default function SearchRfqPage({
  searchParams,
}: {
  searchParams: { partno?: string; type?: string }
}) {
  const partno = searchParams.partno?.trim()

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Search RFQ', href: '/rfq/search' },
          ...(partno ? [{ label: partno }] : []),
        ]}
      />

      <section className="section-y bg-white">
        <Container>
          {partno ? (
            <>
              <div className="max-w-3xl">
                <p className="eyebrow">Search result</p>
                <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">
                  Searched part number <span className="font-mono font-normal">{partno}</span> — get a quote online
                </h1>
                <p className="mt-2 text-sm text-tertiary">
                  Alternate P/N: <span className="font-mono">{partno.replace(/[^a-zA-Z0-9]/g, '')}</span>
                </p>
                <p className="mt-4 text-body-lg text-secondary">
                  Complete the quote request form below for part number{' '}
                  <span className="font-mono text-ink">{partno}</span>. We stock more than 10 million parts from 5,000+
                  manufacturers and respond within 15 minutes. We will never share your information.
                </p>
              </div>

              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
                <RfqWithBom variant="full" defaults={{ partNo: partno }} />
                <RfqTrustSidebar />
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Search</p>
              <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">Search for a part to get an instant quote</h1>
              <p className="mt-4 text-body-lg text-secondary">
                Enter a part number, NSN, CAGE code, or manufacturer to begin. We&apos;ll show you matching
                inventory, then a pre-filled quote request.
              </p>
              <div className="mt-8">
                <SearchBar size="lg" />
              </div>
            </div>
          )}
        </Container>
      </section>

      <Certifications />
    </>
  )
}
