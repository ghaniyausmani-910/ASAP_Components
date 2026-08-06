import Link from 'next/link'
import { Search } from 'lucide-react'
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/data/blog'

export function BlogSidebar() {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <form className="field-shell flex items-center" role="search">
        <input className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none" placeholder="Search the blog…" aria-label="Search blog" />
        <button className="bg-accent p-2.5 text-white" aria-label="Search"><Search size={16} /></button>
      </form>

      <div className="border border-hairline">
        <p className="border-b border-hairline px-5 py-3 font-display text-sm font-medium">Categories</p>
        <div className="flex flex-wrap gap-2 p-4">
          {BLOG_CATEGORIES.map((c) => (
            <span key={c} className="cursor-pointer border border-hairline px-2.5 py-1 text-xs text-secondary transition-colors hover:border-accent hover:text-accent">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="border border-hairline">
        <p className="border-b border-hairline px-5 py-3 font-display text-sm font-medium">Recent Blogs</p>
        <ul className="divide-y divide-hairline">
          {BLOG_POSTS.slice(0, 5).map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="block px-5 py-3 text-sm text-secondary transition-colors hover:bg-surface hover:text-accent">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
