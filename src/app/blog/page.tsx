import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { Certifications } from '@/components/modules/Certifications'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { BLOG_POSTS } from '@/lib/data/blog'
import { gradient } from '@/lib/gradients'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, guides, and news on aviation, aerospace, and defense components from ASAP Components.',
}

export default function BlogListingPage() {
  const [featured, ...rest] = BLOG_POSTS

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />

      <section className="section-y bg-white">
        <Container>
          <div className="mb-10">
            <p className="eyebrow">Insights &amp; news</p>
            <h1 className="mt-3 font-display text-h1 font-extralight tracking-tight-2">The ASAP Components Blog</h1>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              {/* Featured post */}
              <ScrollReveal>
                <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden border border-hairline sm:grid-cols-2">
                  <div className={`relative h-56 sm:h-full ${gradient(featured.image)}`}>
                    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,#fff_1px,transparent_1px)] [background-size:22px_22px]" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">{featured.category}</span>
                    <h2 className="mt-3 font-display text-h4 font-medium leading-snug group-hover:text-accent">{featured.title}</h2>
                    <p className="mt-3 text-sm text-secondary">{featured.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-tertiary">
                      <span>{formatDate(featured.date)}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {featured.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>

              {/* Grid */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {rest.map((p, i) => (
                  <ScrollReveal key={p.slug} delay={(i % 2) * 80}>
                    <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col border border-hairline">
                      <div className={`relative h-40 ${gradient(p.image)}`}>
                        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">{p.category}</span>
                        <h3 className="mt-2 font-display text-base font-medium leading-snug group-hover:text-accent">{p.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-secondary">{p.excerpt}</p>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-tertiary">
                          <span>{formatDate(p.date)}</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-accent">Read <ArrowRight size={13} /></span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              {/* Pagination */}
              <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Blog pagination">
                <span className="flex h-9 w-9 items-center justify-center bg-accent text-sm text-white">1</span>
                {[2, 3, 4, 5, 6].map((n) => (
                  <span key={n} className="flex h-9 w-9 cursor-pointer items-center justify-center border border-hairline text-sm text-secondary hover:border-accent hover:text-accent">{n}</span>
                ))}
                <span className="flex h-9 items-center justify-center border border-hairline px-3 text-sm text-secondary hover:border-accent hover:text-accent">Next →</span>
              </nav>
            </div>

            <BlogSidebar />
          </div>
        </Container>
      </section>

      <Certifications />
    </>
  )
}
