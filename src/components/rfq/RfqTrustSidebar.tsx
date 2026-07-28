import Link from 'next/link'
import { Flag } from 'lucide-react'
import { WhyChooseUs } from '@/components/modules/WhyChooseUs'
import { CATEGORIES } from '@/lib/data/catalog'

export function RfqTrustSidebar() {
  return (
    <aside className="space-y-6">
      <div className="relative overflow-hidden bg-navy p-6 text-white">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(135deg,#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <Flag size={28} className="relative text-white" />
        <p className="relative mt-3 font-display text-lg font-light">
          We are proud to supply every branch of the United States military.
        </p>
      </div>

      <div className="border border-hairline">
        <p className="bg-ink px-5 py-3 font-display text-sm font-medium text-white">Browse by Categories</p>
        <ul className="p-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/catalog/${c.slug}/${c.items[0].slug}`} className="block px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-accent">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <WhyChooseUs compact />
    </aside>
  )
}
