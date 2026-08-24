import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/primitives'

// B6 · Every content page closes with a dual RFQ + Contact route so the
// LLM-cited pages (best-converting channel) never dead-end. The labels are
// re-used from the site header — no drafted copy — and both routes are the
// existing top-level Instant RFQ and Contact Us destinations.
export function EndPageCta() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="section-y-sm">
        <Container>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl font-display text-h4 font-light tracking-tight-2 text-ink">
              Ready to source a part?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/instant-rfq" className="btn btn-primary group">
                Instant RFQ
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link href="/contact-us" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
