import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Container } from '@/components/ui/primitives'

/**
 * "Our Vision" statement band for /about-us.
 *
 * Adapts the two-column reference (oversized positioning headline on the left,
 * labelled vision copy on the right, soft glow rising from the floor) into
 * ASAP's own language (DESIGN.md §2, §3, §5): light/tight Sora display, navy
 * monochrome hierarchy from weight not hue, square hairline chrome. The glow is
 * the one place aqua is allowed — decorative-only, low-opacity, blurred, and
 * never behind text (DESIGN.md §2 usage rule).
 */
export function AboutVision() {
  return (
    <section className="relative isolate overflow-hidden bg-surface">
      {/* Decorative floor glow — aqua is decorative-only, kept faint + blurred so
          it never competes with copy or trips contrast (DESIGN.md §2). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-30%] -z-10 h-[60%] blur-3xl"
        style={{
          background:
            'radial-gradient(50% 100% at 50% 100%, rgba(46,196,182,0.30) 0%, rgba(15,76,129,0.14) 42%, rgba(46,196,182,0) 78%)',
        }}
      />

      <Container>
        <div className="section-y grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-5">
            <h2 className="font-display text-h1 font-extralight tracking-tight-2 text-balance text-ink">
              ASAP Components is the sourcing backbone for aerospace.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={120} className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">Our Vision</p>
            <div className="mt-5 space-y-5 text-body-lg text-secondary">
              <p>
                We&rsquo;re building the most responsive parts-distribution interface in the industry — giving
                procurement teams instant access to over 10 million components, from long-lead-time NSN parts to
                AOG-critical hardware, without the friction of the traditional supply chain.
              </p>
              <p>
                Our mission is to be a strategic purchasing partner, not just a distributor. We simplify sourcing,
                quoting, and fulfillment so aerospace, marine, and defense programs stay on schedule — backed by
                AS9120B and ISO 9001:2015 quality at every step.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
