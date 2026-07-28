'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { slugify } from '@/lib/utils'

export interface CartLine {
  partNo: string
  manufacturer: string
  description?: string
  quantity: number
}

interface CartContextValue {
  lines: CartLine[]
  totalCount: number
  /** Stable dedupe key for a part+manufacturer pair. */
  keyFor: (partNo: string, manufacturer: string) => string
  getLine: (partNo: string, manufacturer: string) => CartLine | undefined
  addItem: (line: Omit<CartLine, 'quantity'> & { quantity?: number }) => void
  setQuantity: (partNo: string, manufacturer: string, quantity: number) => void
  removeItem: (partNo: string, manufacturer: string) => void
  clear: () => void
}

const STORAGE_KEY = 'asap:cart:v1'

const CartContext = createContext<CartContextValue | null>(null)

function keyFor(partNo: string, manufacturer: string): string {
  return `${slugify(manufacturer)}::${partNo}`
}

/** Coerce to a positive whole number (≥1). */
function clampQty(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.max(1, Math.floor(n))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage after mount (never during render → no SSR mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setLines(parsed)
      }
    } catch {
      /* ignore corrupt storage */
    }
    setMounted(true)
  }, [])

  // Persist on change (only once hydrated, so we don't clobber storage with []).
  useEffect(() => {
    if (!mounted) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage may be full/unavailable */
    }
  }, [lines, mounted])

  const value = useMemo<CartContextValue>(() => {
    const getLine = (partNo: string, manufacturer: string) =>
      lines.find((l) => keyFor(l.partNo, l.manufacturer) === keyFor(partNo, manufacturer))

    return {
      lines,
      // Before hydration report 0 so the header badge matches server render.
      totalCount: mounted ? lines.reduce((sum, l) => sum + l.quantity, 0) : 0,
      keyFor,
      getLine,
      addItem: (line) =>
        setLines((prev) => {
          const k = keyFor(line.partNo, line.manufacturer)
          if (prev.some((l) => keyFor(l.partNo, l.manufacturer) === k)) return prev // dedupe
          return [
            ...prev,
            {
              partNo: line.partNo,
              manufacturer: line.manufacturer,
              description: line.description,
              quantity: clampQty(line.quantity ?? 1),
            },
          ]
        }),
      setQuantity: (partNo, manufacturer, quantity) =>
        setLines((prev) => {
          const k = keyFor(partNo, manufacturer)
          return prev.map((l) => (keyFor(l.partNo, l.manufacturer) === k ? { ...l, quantity: clampQty(quantity) } : l))
        }),
      removeItem: (partNo, manufacturer) =>
        setLines((prev) => {
          const k = keyFor(partNo, manufacturer)
          return prev.filter((l) => keyFor(l.partNo, l.manufacturer) !== k)
        }),
      clear: () => setLines([]),
    }
  }, [lines, mounted])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
