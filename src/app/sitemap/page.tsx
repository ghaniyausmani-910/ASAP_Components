import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container, PageHero } from '@/components/ui/primitives'
import { CATEGORIES } from '@/lib/data/catalog'
import { POLICIES } from '@/lib/data/policies'
import { FOOTER } from '@/lib/data/site'

export const metadata: Metadata = { title: 'Sitemap', description: 'A complete map of the ASAP Components website.' }

export default function SitemapPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Sitemap' }]} />
      <PageHero eyebrow="Navigation" title="Sitemap" intro="Every page on the ASAP Components website, in one place." />
      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <SitemapCol title="Main">
              {FOOTER.company.map((l) => (
                <SitemapLink key={l.href} href={l.href}>{l.label}</SitemapLink>
              ))}
              <SitemapLink href="/instant-rfq">Instant RFQ</SitemapLink>
            </SitemapCol>

            {CATEGORIES.map((cat) => (
              <SitemapCol key={cat.slug} title={cat.label}>
                {cat.items.map((item) => (
                  <SitemapLink key={item.slug} href={`/catalog/${cat.slug}/${item.slug}`}>
                    {item.label}
                  </SitemapLink>
                ))}
              </SitemapCol>
            ))}

            <SitemapCol title="Policies & Terms">
              {POLICIES.map((p) => (
                <SitemapLink key={p.slug} href={`/policies/${p.slug}`}>{p.title}</SitemapLink>
              ))}
            </SitemapCol>
          </div>
        </Container>
      </section>
    </>
  )
}

function SitemapCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 border-b border-hairline pb-2 font-display text-sm font-medium text-navy">{title}</p>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  )
}

function SitemapLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-secondary hover:text-accent">{children}</Link>
    </li>
  )
}
