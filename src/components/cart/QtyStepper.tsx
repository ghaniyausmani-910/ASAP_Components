'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * `– n +` quantity stepper. Manual typing is allowed and clamped to whole
 * numbers ≥ 1 on commit (blur / Enter). Pressing `–` while at 1 calls
 * `onDecrementBelowOne` (used to remove the line from the cart).
 */
export function QtyStepper({
  quantity,
  onChange,
  onDecrementBelowOne,
  size = 'sm',
  className,
}: {
  quantity: number
  onChange: (next: number) => void
  onDecrementBelowOne: () => void
  size?: 'sm' | 'md'
  className?: string
}) {
  const [draft, setDraft] = useState(String(quantity))

  // Keep the input in sync when quantity changes from the outside (+/- or store).
  useEffect(() => {
    setDraft(String(quantity))
  }, [quantity])

  function commit() {
    const parsed = parseInt(draft, 10)
    if (!Number.isFinite(parsed) || parsed < 1) {
      setDraft(String(quantity)) // reject garbage, restore current
      return
    }
    onChange(Math.floor(parsed))
  }

  const btn = cn(
    'flex items-center justify-center border border-inputline text-ink transition-colors hover:border-accent hover:text-accent',
    size === 'md' ? 'h-9 w-9' : 'h-8 w-8',
  )
  const input = cn(
    'min-w-0 border-y border-inputline bg-white text-center font-mono text-ink outline-none transition-[border-color,box-shadow] duration-200',
    'focus:relative focus:z-10 focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-100)]',
    size === 'md' ? 'h-9 w-14 text-sm' : 'h-8 w-12 text-xs',
  )

  return (
    <div className={cn('inline-flex items-stretch', className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => (quantity <= 1 ? onDecrementBelowOne() : onChange(quantity - 1))}
        className={btn}
      >
        <Minus size={size === 'md' ? 15 : 13} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label="Quantity"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
        }}
        className={input}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className={btn}
      >
        <Plus size={size === 'md' ? 15 : 13} />
      </button>
    </div>
  )
}
