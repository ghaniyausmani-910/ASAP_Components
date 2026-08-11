import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider } from '@/lib/cart/CartContext'
import { AddToCartControl } from '@/components/cart/AddToCartControl'

function renderControl() {
  return render(
    <CartProvider>
      <AddToCartControl partNo="AN3-4A" manufacturer="Boeing" description="Bolt" />
    </CartProvider>,
  )
}

describe('AddToCartControl', () => {
  it('shows an Add button until the part is in the cart, then swaps to a stepper', async () => {
    const user = userEvent.setup()
    renderControl()

    const addBtn = screen.getByRole('button', { name: /add an3-4a to cart/i })
    await user.click(addBtn)

    // Add button gone; stepper present at quantity 1.
    expect(screen.queryByRole('button', { name: /add an3-4a to cart/i })).toBeNull()
    expect(screen.getByLabelText('Quantity')).toHaveValue('1')
  })

  it('increments quantity through the cart', async () => {
    const user = userEvent.setup()
    renderControl()
    await user.click(screen.getByRole('button', { name: /add an3-4a to cart/i }))
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    expect(screen.getByLabelText('Quantity')).toHaveValue('2')
  })

  it('removes the line when decrementing below one', async () => {
    const user = userEvent.setup()
    renderControl()
    await user.click(screen.getByRole('button', { name: /add an3-4a to cart/i }))
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))
    // Back to the Add state.
    expect(screen.getByRole('button', { name: /add an3-4a to cart/i })).toBeInTheDocument()
  })
})
