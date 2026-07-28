import { CERTIFICATIONS } from '@/lib/data/site'
import { Container } from '@/components/ui/primitives'

export function Certifications({ tone = 'surface' }: { tone?: 'surface' | 'light' }) {
  return (
    <section className={tone === 'surface' ? 'bg-surface' : 'bg-white'}>
      <Container>
        <div className="section-y-sm">
          <h2 className="text-center font-display text-h3 font-light tracking-tight-2">
            Certifications &amp; Memberships
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-3 md:grid-cols-5">
            {CERTIFICATIONS.map((c) => (
              <div
                key={c.name}
                title={c.detail}
                className="group flex flex-col items-center justify-center gap-3 bg-white p-6 text-center transition-colors hover:bg-surface"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="h-16 w-auto max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="text-[11px] leading-tight text-tertiary">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
