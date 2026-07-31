import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Clock, User, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { SearchBar } from '@/components/ui/SearchBar'
import { Certifications } from '@/components/modules/Certifications'
import { BLOG_POSTS, getPost } from '@/lib/data/blog'
import { gradient } from '@/lib/gradients'
import { formatDate } from '@/lib/utils'

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return { title: 'Article' }
  return { title: post.title, description: post.excerpt }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />

      {/* Article hero */}
      <section className={`relative overflow-hidden ${gradient(post.image)}`}>
        <Image
          src={post.photo}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,32,58,0.72)_0%,rgba(15,32,58,0.85)_100%)]" />
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(135deg,#fff_1px,transparent_1px)] [background-size:26px_26px]" />
        <Container>
          <div className="relative py-16 lg:py-24">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-white/80">{post.category}</span>
            <h1 className="mt-4 max-w-3xl font-display text-h1 font-extralight tracking-tight-2 text-white">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-white/70">
              <span className="flex items-center gap-2"><User size={15} /> {post.author}</span>
              <span>{formatDate(post.date)}</span>
              <span className="flex items-center gap-2"><Clock size={15} /> {post.readingTime} min read</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <article className="max-w-2xl">
              <div className="space-y-5 text-body-lg leading-relaxed text-secondary">
                {post.body.map((block, i) => {
                  if (block.type === 'h2') return <h2 key={i} className="pt-4 font-display text-h4 font-medium text-ink">{block.text}</h2>
                  if (block.type === 'ul')
                    return (
                      <ul key={i} className="space-y-3">
                        {block.items.map((it) => (
                          <li key={it.lead} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
                            <span><strong className="font-semibold text-ink">{it.lead}:</strong> {it.text}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  return <p key={i}>{block.text}</p>
                })}
              </div>

              {/* In-article core-action callout */}
              <div className="mt-10 border border-hairline bg-surface p-6">
                <p className="font-display text-base font-medium">Looking for a specific part?</p>
                <p className="mt-1 text-sm text-secondary">Search our inventory or request a quote — answered within 15 minutes.</p>
                <div className="mt-4"><SearchBar size="sm" /></div>
              </div>

              {/* Share */}
              <div className="mt-8 flex items-center gap-3 border-t border-hairline pt-6">
                <span className="text-sm text-tertiary">Share:</span>
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <span key={i} className="flex h-9 w-9 cursor-pointer items-center justify-center border border-hairline text-secondary transition-colors hover:border-accent hover:text-accent">
                    <Icon size={16} />
                  </span>
                ))}
              </div>
            </article>

            <BlogSidebar />
          </div>

          {/* Related */}
          <div className="mt-16">
            <h2 className="font-display text-h4 font-medium">Related articles</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col border border-hairline">
                  <div className={`relative h-44 overflow-hidden ${gradient(p.image)}`}>
                    <Image
                      src={p.photo}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 260px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,32,58,0.1)_0%,rgba(15,32,58,0.4)_100%)]" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">{p.category}</span>
                    <h3 className="mt-1.5 font-display text-sm font-medium leading-snug group-hover:text-accent">{p.title}</h3>
                    <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">Read <ArrowRight size={12} /></span>
                  </div>
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
