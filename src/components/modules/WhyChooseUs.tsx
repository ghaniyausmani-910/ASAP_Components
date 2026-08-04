import { BENEFITS } from '@/lib/data/site'
import { Truck, Database, Factory, ShoppingCart } from 'lucide-react'

const ICONS: Record<string, typeof Truck> = {
  truck: Truck,
  database: Database,
  factory: Factory,
  cart: ShoppingCart,
}

export function WhyChooseUs({ compact = false }: { compact?: boolean }) {
  return (
    <div className="border border-hairline bg-white">
      <p className="border-b border-hairline px-5 py-3 text-left font-display text-sm font-medium">Why Choose Us</p>
      <ul>
        {BENEFITS.map((b) => {
          const Icon = ICONS[b.icon] ?? Truck
          return (
            <li key={b.title} className="flex items-start gap-3 border-b border-hairline px-5 py-4 last:border-b-0">
              <Icon size={22} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-medium text-ink">{b.title}</p>
                {!compact && <p className="mt-0.5 text-xs text-tertiary">{b.desc}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
