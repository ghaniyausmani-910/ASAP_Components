import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { RfqSidebar } from '@/components/modules/RfqSidebar'
import { PartsListingTable } from '@/components/catalog/PartsListingTable'
import { Certifications } from '@/components/modules/Certifications'
import { getCategory } from '@/lib/data/catalog'
import { generateParts, MANUFACTURERS } from '@/lib/data/parts'
import { slugify } from '@/lib/utils'

function deslug(term: string): string {
  const m = MANUFACTURERS.find((x) => slugify(x) === term)
  if (m) return m
  if (/^\d+$/.test(term)) return term
  return term.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function generateMetadata({ params }: { params: { category: string; term: string } }): Metadata {
  return { title: `${deslug(params.term)} Parts`, description: `Browse ${deslug(params.term)} parts available for immediate RFQ.` }
}

export default function ListingPage({ params }: { params: { category: string; term: string } }) {
  const category = getCategory(params.category)
  if (!category) notFound()
  const label = deslug(params.term)
  const parts = generateParts(`term:${params.category}:${params.term}`, 75, { withDescription: true })

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category.label, href: `/catalog/${category.slug}/${category.items[0].slug}` },
          { label },
        ]}
      />
      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="eyebrow">{category.label}</p>
              <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">{label}</h1>
              <p className="mt-4 max-w-3xl text-body-lg text-secondary">
                The following {label} parts are available for immediate quote. Click a part number for details, or
                request a quote directly — answered within 15 minutes, 24/7.
              </p>
              <div className="mt-10">
                <PartsListingTable parts={parts} categorySlug={category.slug} showDescription />
              </div>
            </div>
            <RfqSidebar contextLabel={category.label.split(' ')[0]} />
          </div>
        </Container>
      </section>
      <Certifications />
    </>
  )
}
