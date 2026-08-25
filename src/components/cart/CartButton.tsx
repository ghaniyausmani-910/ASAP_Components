'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { cn } from '@/lib/utils'

/** Header cart CTA — icon only, with a count badge when the cart is non-empty. */
export function CartButton({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  const { totalCount } = useCart()

  return (
    <Link
      href="/cart"
      aria-label={`Quote${totalCount > 0 ? `, ${totalCount} item${totalCount === 1 ? '' : 's'}` : ''}`}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center transition-colors',
        onDark ? 'text-white hover:text-white/80' : 'text-ink hover:text-accent',
        className,
      )}
    >
      <ShoppingCart size={22} strokeWidth={2} />
      {totalCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-white">
          {totalCount > 99 ? '99+' : totalCount}
        </span>
      )}
    </Link>
  )
}
