import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BomReview } from '@/components/rfq/BomReview'
import type { ParsedBomRow } from '@/lib/rfq/parseBom'

const rows: ParsedBomRow[] = [
  { partNo: 'AN3-4A', manufacturer: 'Boeing', description: 'Bolt', quantity: 2 },
  { partNo: 'AN960-10', manufacturer: 'Kapco Valtec', description: 'Washer', quantity: 1 },
]

function setup(props: Partial<Parameters<typeof BomReview>[0]> = {}) {
  const onRowsChange = vi.fn()
  render(
    <BomReview rows={rows} onRowsChange={onRowsChange} fileName="bom.csv" skipped={0} {...props} />,
  )
  return { onRowsChange }
}

describe('BomReview — header & summary', () => {
  it('renders one row per part and a plural count', () => {
    setup()
    expect(screen.getByText(/We found 2 parts in/)).toBeInTheDocument()
    expect(screen.getByText('bom.csv')).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Part number, row/)).toHaveLength(2)
  })

  it('shows a pluralized skipped note when rows were skipped', () => {
    setup({ skipped: 2 })
    expect(screen.getByText(/2 rows were skipped/)).toBeInTheDocument()
  })

  it('shows the empty state when there are no rows', () => {
    setup({ rows: [] })
    expect(screen.getByText(/No parts left/)).toBeInTheDocument()
  })
})

describe('BomReview — editing (controlled callbacks)', () => {
  it('emits the updated array when a part number is edited', () => {
    const { onRowsChange } = setup()
    fireEvent.change(screen.getByLabelText('Part number, row 1'), { target: { value: 'NEWPN' } })
    const next = onRowsChange.mock.calls.at(-1)![0]
    expect(next[0]).toMatchObject({ partNo: 'NEWPN', manufacturer: 'Boeing' })
    expect(next[1]).toMatchObject({ partNo: 'AN960-10' })
  })

  it('emits an incremented quantity', async () => {
    const user = userEvent.setup()
    const { onRowsChange } = setup()
    await user.click(screen.getAllByRole('button', { name: 'Increase quantity' })[0])
    const next = onRowsChange.mock.calls.at(-1)![0]
    expect(next[0].quantity).toBe(3)
  })

  it('emits an array without the removed row', async () => {
    const user = userEvent.setup()
    const { onRowsChange } = setup()
    await user.click(screen.getByRole('button', { name: 'Remove row 1' }))
    const next = onRowsChange.mock.calls.at(-1)![0]
    expect(next).toHaveLength(1)
    expect(next[0]).toMatchObject({ partNo: 'AN960-10' })
  })
})
