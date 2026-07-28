import Link from 'next/link'
import { QuickQuote } from '@/components/modules/QuickQuote'
import { WhyChooseUs } from '@/components/modules/WhyChooseUs'
import { CATEGORIES } from '@/lib/data/catalog'
import { MANUFACTURERS } from '@/lib/data/parts'
import { slugify } from '@/lib/utils'

export function RfqSidebar({
  contextLabel,
  topSearched,
}: {
  contextLabel?: string
  topSearched?: string[]
}) {
  const searched = topSearched ?? MANUFACTURERS.slice(0, 8)
  return (
    <aside className="space-y-6">
      <div className="border border-hairline">
        <p className="bg-navy px-5 py-3 font-display text-sm font-medium text-white">Send Instant RFQ</p>
        <div className="p-5">
          <QuickQuote variant="card" />
        </div>
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

      {searched.length > 0 && (
        <div className="border border-hairline">
          <p className="bg-accent px-5 py-3 font-display text-sm font-medium text-white">
            Top Searched {contextLabel ? `${contextLabel} ` : ''}Manufacturers
          </p>
          <div className="flex flex-wrap gap-2 p-4">
            {searched.map((m) => (
              <Link key={m} href={`/rfq/search?partno=${encodeURIComponent(m)}&type=Manufacturer`} className="border border-hairline px-2.5 py-1 text-xs text-secondary transition-colors hover:border-accent hover:text-accent">
                {m}
              </Link>
            ))}
          </div>
        </div>
      )}

      <WhyChooseUs compact />
    </aside>
  )
}
