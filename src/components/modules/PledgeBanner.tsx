import { Container } from '@/components/ui/primitives'
import { ShieldOff, Heart } from 'lucide-react'

export function PledgeBanner() {
  return (
    <section className="bg-white">
      <Container>
        <div className="section-y-sm grid gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-2">
          <div className="flex items-start gap-4 bg-white p-8">
            <Heart size={28} className="mt-1 shrink-0 text-accent" />
            <p className="text-sm leading-relaxed text-secondary">
              <span className="font-medium text-ink">We proudly support the Intrepid Fallen Heroes Fund</span>, which
              serves United States military personnel experiencing the invisible wounds of war — traumatic brain injury
              (TBI) and post-traumatic stress (PTS).
            </p>
          </div>
          <div className="flex items-center gap-4 bg-navy p-8 text-white">
            <ShieldOff size={40} className="shrink-0 text-white" />
            <p className="text-lg font-light">
              A fully traceable, independently verified <span className="font-semibold text-white underline decoration-1 underline-offset-4">supply chain</span> you can trust
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
