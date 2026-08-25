import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { RfqForm } from '@/components/rfq/RfqForm'
import { Certifications } from '@/components/modules/Certifications'
import { StickyPartNumber } from '@/components/catalog/StickyPartNumber'
import { ViewItemTracker } from '@/components/catalog/ViewItemTracker'
import { getCategory } from '@/lib/data/catalog'
import { findPart, relatedParts } from '@/lib/data/parts'
import { COMPANY } from '@/lib/data/site'
import { slugify } from '@/lib/utils'

interface Params {
  category: string
  manufacturer: string
  part: string
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const partNo = decodeURIComponent(params.part)
  return {
    title: `${partNo} — Submit a Quote`,
    description: `Request a quote for part number ${partNo}. Available now with a response in 15 minutes or less.`,
  }
}

export default function PartDetailPage({ params }: { params: Params }) {
  const category = getCategory(params.category)
  if (!category) notFound()
  const partNo = decodeURIComponent(params.part)
  const part = findPart(params.category, params.manufacturer, partNo)
  const related = relatedParts(params.category, partNo, 16)

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category.label, href: `/catalog/${category.slug}/${category.items[0].slug}` },
          { label: part.manufacturer },
          { label: partNo },
        ]}
      />

      {/* G1 · fires view_item once the client mounts. Server-rendered content is
          preserved; the tracker only pushes to dataLayer. */}
      <ViewItemTracker partNo={partNo} manufacturer={part.manufacturer} category={category.slug} />

      {/* B4 · the part number stays visible while scrolling — a thin sticky rail
          under the header carries partNo + a jump-to-RFQ so cross-checking stays
          possible without losing conversion access. */}
      <StickyPartNumber partNo={partNo} manufacturer={part.manufacturer} />

      <section className="section-y bg-white">
        <Container>
          {/* B1 · at desktop the compact RFQ sits beside the spec grid so the
              Submit control lands above the 1080 fold. `items-end` bottom-aligns
              the form with the spec table on the left. The lead-in paragraph is
              pulled below the grid so the two columns close at the same line.
              Below lg the columns stack and the paragraph flows in its usual
              reading order between them. */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-end">
            <div>
              <p className="eyebrow">{category.label} · Submit a Quote</p>
              <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">
                Part number <span className="font-mono font-normal">{partNo}</span> by {part.manufacturer}
              </h1>

              <dl className="mt-6 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-2">
                <Meta label="Part Number" value={partNo} mono />
                <Meta label="Alternate P/N" value={part.altPartNo ?? '—'} mono />
                <Meta label="Manufacturer" value={part.manufacturer} />
                <Meta label="NSN" value={part.nsn ?? '—'} mono />
                <Meta label="CAGE Code" value={part.cageCode ?? '—'} mono />
                <Meta label="NIIN" value={part.niin ?? '—'} mono />
              </dl>
            </div>

            {/* Compact RFQ — right column at ≥lg, wraps below the spec grid at mobile. */}
            <div id="rfq-form">
              <RfqForm variant="compact" defaults={{ partNo, manufacturer: part.manufacturer }} />
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-secondary">
            Part number <span className="font-mono text-ink">{partNo}</span>
            {part.description ? <> ({part.description})</> : null} by {part.manufacturer} is available and in stock.
            Fill out the form below to request a quote — you will receive a response in 15 minutes or less.
          </p>

          {/* C8 · phone + email flow from COMPANY, never a hardcoded second copy. */}
          <p className="mt-8 max-w-3xl text-sm text-secondary">
            Thank you for your interest in ASAP Components, an ASAP Semiconductor owned website with a large inventory of
            obsolete and hard-to-find military and civil aviation parts. Your request will be reviewed and quoted by one
            of our experienced sales representatives. You can also email your Bill of Materials (BOM) to{' '}
            <a href={`mailto:${COMPANY.email}`} className="text-accent">{COMPANY.email}</a> or call us toll-free at{' '}
            <a href={`tel:${COMPANY.phone}`} className="text-accent">{COMPANY.phone}</a>. We are available 24/7, 365 days
            a year.
          </p>

          {/* Related parts */}
          <div className="mt-14">
            <h2 className="font-display text-h4 font-medium">Related {category.label} of {partNo}</h2>
            <div className="mt-6 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r, i) => (
                <Link
                  key={`${r.partNo}-${i}`}
                  href={`/catalog/${category.slug}/quote/${slugify(r.manufacturer)}/${encodeURIComponent(r.partNo)}`}
                  className="group bg-white p-4 transition-colors hover:bg-surface"
                >
                  <span className="font-mono text-sm text-navy group-hover:text-accent">{r.partNo}</span>
                  <p className="mt-1 text-xs text-secondary">{r.description}</p>
                  <p className="mt-1 text-xs text-tertiary">{r.manufacturer}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Certifications />
    </>
  )
}

function Meta({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-white px-4 py-4">
      <dt className="text-xs uppercase tracking-[0.08em] text-tertiary">{label}</dt>
      <dd className={`mt-1 text-sm text-ink ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  )
}
