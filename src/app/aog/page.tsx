import type { Metadata } from 'next'
import { PhoneCall } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { AogForm } from '@/components/rfq/AogForm'
import { AogPulseDot } from '@/components/rfq/AogPulseDot'
import { RfqStartTracker } from '@/components/rfq/RfqStartTracker'
import { Certifications } from '@/components/modules/Certifications'
import { COMPANY, COMPLIANCE_RIBBON } from '@/lib/data/site'

export const metadata: Metadata = {
  title: 'AOG: aircraft on ground support',
  description:
    'Aircraft on ground: call our 24/7 sourcing desk or send the details and a specialist responds within 15 minutes. All orders fulfilled in the U.S.A.',
}

const STATS: { term: string; value: string }[] = [
  { term: 'First response', value: '15 minutes' },
  { term: 'Desk hours', value: '24 / 7 / 365' },
  { term: 'Fulfillment', value: COMPLIANCE_RIBBON[0] },
]

export default function AogPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'AOG' }]} />

      <RfqStartTracker source="aog" />

      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,740px)] lg:gap-16">
            {/* Left — call first */}
            <div className="max-w-xl">
              <p className="eyebrow flex items-center gap-2">
                <AogPulseDot /> AOG desk, staffed now
              </p>
              <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">
                Aircraft on ground. We move now.
              </h1>
              <p className="mt-4 text-body-lg text-secondary">
                An AOG situation is disruptive and expensive without the right support behind it. Our desk is staffed
                every hour of every day. Call and speak to a specialist, or send the details and we will come back to you.
              </p>

              <div className="mt-8 border border-hairline bg-surface p-6">
                <p className="text-sm font-medium text-tertiary">Fastest route: call the AOG desk</p>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="mt-2 flex items-center gap-3 font-display text-h4 font-medium text-ink transition-colors hover:text-accent"
                >
                  <PhoneCall size={22} className="shrink-0 text-accent" />
                  {COMPANY.phone}
                </a>
                <p className="mt-2 text-sm text-secondary">
                  Prefer email? Reach us at{' '}
                  <a href={`mailto:${COMPANY.email}`} className="text-accent">{COMPANY.email}</a>.
                </p>
              </div>
            </div>

            {/* Right — AOG intake form */}
            <div>
              <AogForm />
            </div>
          </div>

          {/* 3-stat row */}
          <dl className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.term} className="bg-white p-6">
                <dt className="text-sm font-medium text-tertiary">{s.term}</dt>
                <dd className="mt-1 font-display text-h4 font-light text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Certifications />
    </>
  )
}
