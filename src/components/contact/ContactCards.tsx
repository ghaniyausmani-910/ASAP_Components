import { MapPin, Phone, Mail, Clock, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { COMPANY } from '@/lib/data/site'
import { cn } from '@/lib/utils'

type ContactCard = {
  icon: LucideIcon
  label: string
  /** Rendered as the card's primary detail. */
  body: React.ReactNode
  /** Optional action pinned to the card's top-right corner. */
  topRight?: React.ReactNode
}

const MAPS_HREF = `https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}`

const CARDS: ContactCard[] = [
  {
    icon: MapPin,
    label: 'Location',
    body: <span className="text-[color:var(--ink-76)]">{COMPANY.address}</span>,
    topRight: (
      <a
        href={MAPS_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-semibold text-accent"
      >
        Open in Google Maps <ArrowUpRight size={15} aria-hidden />
      </a>
    ),
  },
  {
    icon: Phone,
    label: 'Phone',
    body: (
      <a href={`tel:${COMPANY.phone}`} className="font-semibold text-[color:var(--ink-76)] transition-colors hover:text-accent">
        {COMPANY.phone}
      </a>
    ),
  },
  {
    icon: Mail,
    label: 'Email',
    body: (
      <a href={`mailto:${COMPANY.email}`} className="text-[color:var(--ink-76)] transition-colors hover:text-accent">
        {COMPANY.email}
      </a>
    ),
  },
  {
    icon: Clock,
    label: 'Response Time',
    body: <span className="text-[color:var(--ink-76)]">{COMPANY.quoteSLA}</span>,
  },
]

export function ContactCards({ className }: { className?: string }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {CARDS.map(({ icon: Icon, label, body, topRight }) => (
        <div
          key={label}
          className={cn(
            'group relative flex min-h-[18rem] flex-col overflow-hidden border border-hairline bg-surface p-6',
            'transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out',
            'motion-safe:hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-hover'
          )}
        >
          {/* accent keyline, scales in on hover */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
          />
          {topRight && <div className="absolute right-6 top-6 z-10">{topRight}</div>}
          <span className="flex h-11 w-11 items-center justify-center bg-white text-accent transition-colors duration-300 group-hover:bg-surface-2">
            <Icon size={20} aria-hidden />
          </span>
          <div className="mt-auto pt-10">
            <h3 className="font-display text-h4 font-medium text-ink">{label}</h3>
            <div className="mt-2 flex flex-col text-sm leading-relaxed">{body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
