import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { SearchBar } from '@/components/ui/SearchBar'
import { SearchResults } from '@/components/catalog/SearchResults'
import { Certifications } from '@/components/modules/Certifications'
import { searchResult } from '@/lib/data/parts'
import { hasCatalogMatch } from '@/lib/data/suggestions'

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search results for parts across our catalog of 10 million+ components.',
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string }
}) {
  const q = searchParams.q?.trim()
  const type = searchParams.type

  // Direct / shared link to a query we don't stock: funnel to a pre-filled RFQ,
  // mirroring what the search bar does client-side. (Bar submits normally never
  // reach here for a no-match.)
  if (q && !hasCatalogMatch(q, type)) {
    redirect(`/rfq/search?partno=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Search', href: '/search' },
          ...(q ? [{ label: q }] : []),
        ]}
      />

      <section className="section-y bg-white">
        <Container>
          {q ? (
            <>
              <div className="max-w-3xl">
                <p className="eyebrow">Search result</p>
                <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">
                  Results for <span className="font-mono font-normal">{q}</span>
                </h1>
                <p className="mt-4 text-body-lg text-secondary">
                  We stock over 10 million parts from 5,100+ manufacturers. Review the match below and request a
                  quote — answered within 15 minutes, 24/7.
                </p>
              </div>

              <div className="mt-10">
                {(() => {
                  const { part, categorySlug } = searchResult(q, type)
                  return <SearchResults part={part} categorySlug={categorySlug} />
                })()}
              </div>

              {/* Fallback CTA */}
              <div className="mt-10 flex flex-col items-start gap-3 border border-hairline bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-h4 font-medium">Not the exact part you need?</p>
                  <p className="mt-1 text-secondary">
                    Submit an RFQ and our team will source it for you — including obsolete and hard-to-find parts.
                  </p>
                </div>
                <Link
                  href={`/rfq/search?partno=${encodeURIComponent(q)}`}
                  className="btn btn-primary group shrink-0 text-body"
                >
                  Submit an RFQ
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Search</p>
              <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">Search for a part</h1>
              <p className="mt-4 text-body-lg text-secondary">
                Enter a part number, NSN, CAGE code, or manufacturer to see matching inventory and request a quote.
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
