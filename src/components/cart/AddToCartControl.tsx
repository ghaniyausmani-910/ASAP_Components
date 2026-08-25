'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { QtyStepper } from '@/components/cart/QtyStepper'

/**
 * Row-level cart control. Renders an "Add to Cart" icon button until the part
 * is in the cart, then swaps to a quantity stepper in the same cell. Kept in
 * sync with the cart (and header badge) through context, so the same part
 * shown on any page reflects its cart state.
 */
export function AddToCartControl({
  partNo,
  manufacturer,
  description,
}: {
  partNo: string
  manufacturer: string
  description?: string
}) {
  const { getLine, addItem, setQuantity, removeItem } = useCart()
  const line = getLine(partNo, manufacturer)

  if (!line) {
    return (
      <button
        type="button"
        onClick={() => addItem({ partNo, manufacturer, description })}
        // C10 · icon-only row control; the accessible name still names the
        // action so screen readers announce "Add {partNo} to RFQ".
        aria-label={`Add ${partNo} to RFQ`}
        title="Add to RFQ"
        className="inline-flex h-8 w-8 items-center justify-center border border-navy text-navy transition-colors hover:bg-navy hover:text-white"
      >
        <ShoppingCart size={14} />
      </button>
    )
  }

  return (
    <div className="flex justify-center">
      <QtyStepper
        quantity={line.quantity}
        onChange={(n) => setQuantity(partNo, manufacturer, n)}
        onDecrementBelowOne={() => removeItem(partNo, manufacturer)}
      />
    </div>
  )
}
