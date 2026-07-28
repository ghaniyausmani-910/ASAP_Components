import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-hairline bg-white">
      <ol className="container-x flex flex-wrap items-center gap-1 py-3 text-sm text-tertiary">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="text-hairline" />}
            {c.href ? (
              <Link href={c.href} className="hover:text-accent">{c.label}</Link>
            ) : (
              <span className="text-ink">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
