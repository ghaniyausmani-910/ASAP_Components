import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { CartView } from '@/components/cart/CartView'
import { Certifications } from '@/components/modules/Certifications'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review the parts you have collected and request a quote for all of them at once.',
}

export default function CartPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />

      <section className="section-y bg-white">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow">RFQ Cart</p>
            <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">Your parts cart</h1>
            <p className="mt-4 text-body-lg text-secondary">
              Review the parts you have collected, set quantities, and submit one request for a competitive quote on
              everything — answered within 15 minutes, 24/7.
            </p>
          </div>

          <div className="mt-10">
            <CartView />
          </div>
        </Container>
      </section>

      <Certifications />
    </>
  )
}
