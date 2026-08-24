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
        // C10 · icon stays (universal), wording is "Add to RFQ".
        aria-label={`Add ${partNo} to RFQ`}
        className="inline-flex items-center justify-center gap-1 whitespace-nowrap border border-navy px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
      >
        <ShoppingCart size={14} />
        <span className="sr-only sm:not-sr-only">Add to RFQ</span>
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
