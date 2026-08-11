import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container, PageHero } from '@/components/ui/primitives'
import { POLICIES, getPolicy } from '@/lib/data/policies'

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPolicy(params.slug)
  return { title: p?.title ?? 'Policy', description: p?.intro }
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = getPolicy(params.slug)
  if (!policy) notFound()

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: policy.title }]} />
      <PageHero eyebrow="Policies" title={policy.title} intro={policy.intro} center />
      <section className="section-y bg-white">
        <Container>
          <div className="mx-auto max-w-2xl space-y-6">
            {policy.body.map((b, i) => (
              <div key={i}>
                {b.heading && <h2 className="mb-2 font-display text-h4 font-medium">{b.heading}</h2>}
                <p className="text-body-lg leading-relaxed text-secondary">{b.text}</p>
              </div>
            ))}
            <p className="border-t border-hairline pt-6 text-sm text-tertiary">Last updated: January 2026.</p>
          </div>
        </Container>
      </section>
    </>
  )
}
