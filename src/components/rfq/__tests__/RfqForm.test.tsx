import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RfqForm } from '@/components/rfq/RfqForm'

describe('RfqForm — variants & prefill', () => {
  it('renders the full variant field set', () => {
    render(<RfqForm variant="full" />)
    expect(screen.getByText('Part Details')).toBeInTheDocument()
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Company Name/)).toBeInTheDocument()
  })

  it('renders the compact variant with a part-specific prompt', () => {
    render(<RfqForm variant="compact" defaults={{ partNo: 'AN3-4A' }} />)
    expect(screen.getByText(/Please fill out the form below for AN3-4A/)).toBeInTheDocument()
  })

  it('prefills provided defaults', () => {
    render(<RfqForm defaults={{ partNo: 'AN3-4A', manufacturer: 'Boeing', email: 'a@b.com' }} />)
    expect(screen.getByLabelText(/Mfg Part Number/)).toHaveValue('AN3-4A')
    expect(screen.getByLabelText(/Manufacturer/)).toHaveValue('Boeing')
    expect(screen.getByLabelText(/^Email/)).toHaveValue('a@b.com')
  })
})

describe('RfqForm — AOG toggle', () => {
  it('sets "Need Parts By" to Immediately when AOG is checked', async () => {
    const user = userEvent.setup()
    render(<RfqForm />)
    await user.click(screen.getByRole('checkbox', { name: /AOG/i }))
    expect(screen.getByRole('button', { name: 'Need Parts By' })).toHaveTextContent('Immediately')
  })
})

describe('RfqForm — BOM mode', () => {
  it('collapses part-detail fields and shows a count-aware phrase', () => {
    render(<RfqForm bom={{ partsCount: 3, fileName: 'bom.csv' }} />)
    expect(screen.getByText('Your Bill of Materials')).toBeInTheDocument()
    expect(screen.getByText(/3 parts/)).toBeInTheDocument()
    expect(screen.getByText('bom.csv')).toBeInTheDocument()
    // Part-detail fields are gone in BOM mode.
    expect(screen.queryByLabelText(/Mfg Part Number/)).toBeNull()
  })

  it('uses the singular for a single part', () => {
    render(<RfqForm bom={{ partsCount: 1, fileName: 'one.csv' }} />)
    expect(screen.getByText(/1 part\b/)).toBeInTheDocument()
  })

  it('uses "the parts" when the count is zero', () => {
    render(<RfqForm bom={{ partsCount: 0, fileName: 'scan.pdf' }} />)
    expect(screen.getByText(/Quoting the parts from/)).toBeInTheDocument()
  })
})

describe('RfqForm — submit success state', () => {
  it('shows a confirmation with a reference id and fires onSentChange', () => {
    const onSentChange = vi.fn()
    const { container } = render(<RfqForm onSentChange={onSentChange} />)
    // Submit directly to bypass native required-field validation in jsdom.
    fireEvent.submit(container.querySelector('form')!)

    expect(screen.getByText('Your RFQ has been submitted')).toBeInTheDocument()
    expect(screen.getByText(/Reference: ASAP-\d{6}/)).toBeInTheDocument()
    expect(onSentChange).toHaveBeenCalledWith(true)
  })

  it('resets to the form when submitting another RFQ', async () => {
    const user = userEvent.setup()
    const onSentChange = vi.fn()
    const { container } = render(<RfqForm onSentChange={onSentChange} />)
    fireEvent.submit(container.querySelector('form')!)
    await user.click(screen.getByRole('button', { name: /Submit another RFQ/i }))
    expect(screen.getByText('Part Details')).toBeInTheDocument()
    expect(onSentChange).toHaveBeenLastCalledWith(false)
  })
})
