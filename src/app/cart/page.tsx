import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { CartView } from '@/components/cart/CartView'
import { Certifications } from '@/components/modules/Certifications'

export const metadata: Metadata = {
  title: 'Quote',
  description: 'Review the parts you have collected and request a quotation for all of them at once.',
}

export default function CartPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Quote' }]} />

      <section className="section-y bg-white">
        <Container>
          <CartView />
        </Container>
      </section>

      <Certifications />
    </>
  )
}
