import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/lib/cart/CartContext'

const wrapper = ({ children }: { children: React.ReactNode }) => <CartProvider>{children}</CartProvider>

const mount = () => renderHook(() => useCart(), { wrapper })

beforeEach(() => {
  window.localStorage.clear()
})

describe('addItem', () => {
  it('adds a line', () => {
    const { result } = mount()
    act(() => result.current.addItem({ partNo: 'AN3-4A', manufacturer: 'Boeing' }))
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0]).toMatchObject({ partNo: 'AN3-4A', manufacturer: 'Boeing', quantity: 1 })
  })

  it('dedupes the same part+manufacturer', () => {
    const { result } = mount()
    act(() => result.current.addItem({ partNo: 'AN3-4A', manufacturer: 'Boeing' }))
    act(() => result.current.addItem({ partNo: 'AN3-4A', manufacturer: 'Boeing' }))
    expect(result.current.lines).toHaveLength(1)
  })

  it('dedupes by slugified manufacturer key (case-insensitive)', () => {
    const { result } = mount()
    act(() => result.current.addItem({ partNo: 'AN3-4A', manufacturer: 'Boeing' }))
    act(() => result.current.addItem({ partNo: 'AN3-4A', manufacturer: 'boeing' }))
    expect(result.current.lines).toHaveLength(1)
  })

  it('clamps the added quantity to a whole number >= 1', () => {
    const { result } = mount()
    act(() => result.current.addItem({ partNo: 'A', manufacturer: 'M', quantity: 0 }))
    act(() => result.current.addItem({ partNo: 'B', manufacturer: 'M', quantity: 2.7 }))
    act(() => result.current.addItem({ partNo: 'C', manufacturer: 'M', quantity: -5 }))
    expect(result.current.getLine('A', 'M')?.quantity).toBe(1)
    expect(result.current.getLine('B', 'M')?.quantity).toBe(2)
    expect(result.current.getLine('C', 'M')?.quantity).toBe(1)
  })
})

describe('setQuantity / removeItem / clear', () => {
  it('updates and clamps the quantity of the targeted line', () => {
    const { result } = mount()
    act(() => result.current.addItem({ partNo: 'A', manufacturer: 'M' }))
    act(() => result.current.setQuantity('A', 'M', 5))
    expect(result.current.getLine('A', 'M')?.quantity).toBe(5)
    act(() => result.current.setQuantity('A', 'M', 0))
    expect(result.current.getLine('A', 'M')?.quantity).toBe(1)
  })

  it('removes the targeted line and clears all', () => {
    const { result } = mount()
    act(() => result.current.addItem({ partNo: 'A', manufacturer: 'M' }))
    act(() => result.current.addItem({ partNo: 'B', manufacturer: 'M' }))
    act(() => result.current.removeItem('A', 'M'))
    expect(result.current.getLine('A', 'M')).toBeUndefined()
    expect(result.current.lines).toHaveLength(1)
    act(() => result.current.clear())
    expect(result.current.lines).toHaveLength(0)
  })
})

describe('totalCount', () => {
  it('sums quantities across lines', () => {
    const { result } = mount()
    act(() => result.current.addItem({ partNo: 'A', manufacturer: 'M', quantity: 3 }))
    act(() => result.current.addItem({ partNo: 'B', manufacturer: 'M', quantity: 2 }))
    expect(result.current.totalCount).toBe(5)
  })
})

describe('persistence', () => {
  it('writes the cart to localStorage', () => {
    const { result } = mount()
    act(() => result.current.addItem({ partNo: 'A', manufacturer: 'M', quantity: 2 }))
    const raw = window.localStorage.getItem('asap:cart:v1')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual([{ partNo: 'A', manufacturer: 'M', description: undefined, quantity: 2 }])
  })

  it('hydrates from localStorage on mount', () => {
    window.localStorage.setItem(
      'asap:cart:v1',
      JSON.stringify([{ partNo: 'X', manufacturer: 'M', quantity: 3 }]),
    )
    const { result } = mount()
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.totalCount).toBe(3)
  })
})

describe('useCart guard', () => {
  it('throws when used outside a provider', () => {
    expect(() => renderHook(() => useCart())).toThrow(/must be used within a CartProvider/)
  })
})
