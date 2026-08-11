import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '@/components/search/CommandPalette'

// The palette routes via next/navigation's useRouter.
const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }))

beforeEach(() => {
  pushMock.mockClear()
})

describe('CommandPalette — open/close', () => {
  it('renders nothing when closed', () => {
    render(<CommandPalette open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders the dialog and default quick links when open', () => {
    render(<CommandPalette open onClose={() => {}} />)
    expect(screen.getByRole('dialog', { name: /site search/i })).toBeInTheDocument()
    expect(screen.getByText('Browse catalog')).toBeInTheDocument()
    expect(screen.getByText('Aviation Parts')).toBeInTheDocument()
  })

  it('focuses the input when opened', async () => {
    render(<CommandPalette open onClose={() => {}} />)
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveFocus())
  })
})

describe('CommandPalette — results', () => {
  it('shows grouped results for a catalog query', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open onClose={() => {}} />)
    await user.type(screen.getByRole('combobox'), 'D38999')
    expect(screen.getByText('Parts')).toBeInTheDocument()
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0)
  })

  it('shows the no-match / request-a-quote state for junk', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open onClose={() => {}} />)
    await user.type(screen.getByRole('combobox'), 'ZZNOTAPART')
    expect(screen.getByText(/No catalog match/)).toBeInTheDocument()
  })
})

describe('CommandPalette — keyboard', () => {
  it('routes a highlighted result to its part-detail page on Enter', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open onClose={() => {}} />)
    await user.type(screen.getByRole('combobox'), 'D38999')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock.mock.calls[0][0]).toMatch(/^\/catalog\//)
  })

  it('submits a miss straight to a pre-filled RFQ on Enter', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open onClose={() => {}} />)
    await user.type(screen.getByRole('combobox'), 'ZZNOTAPART{Enter}')
    expect(pushMock).toHaveBeenCalledWith('/rfq/search?partno=ZZNOTAPART')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<CommandPalette open onClose={onClose} />)
    await user.type(screen.getByRole('combobox'), '{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
