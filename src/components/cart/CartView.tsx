'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { CheckCircle2, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { QtyStepper } from '@/components/cart/QtyStepper'
import { DraftLineRow, emptyDraft, isDraftValid, type DraftLine } from '@/components/cart/DraftLineRow'
import { Select } from '@/components/ui/Select'
import { describePartNo } from '@/lib/data/parts'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'

export function CartView() {
  const { lines, totalCount, keyFor, getLine, addItem, setQuantity, removeItem, clear } = useCart()
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // In-place "Add Line Item" entry. The draft is local UI state — never a real
  // CartLine until committed — so a half-typed row never hits localStorage.
  const [draft, setDraft] = useState<DraftLine | null>(null)
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map())
  const [flashKey, setFlashKey] = useState<string | null>(null)

  function flashRow(key: string) {
    setFlashKey(key)
    const el = rowRefs.current.get(key)
    if (el) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    }
    window.setTimeout(() => setFlashKey((k) => (k === key ? null : k)), 1300)
  }

  /** Fold a valid draft into the cart: merge into an existing line, else add. */
  function commitDraft(d: DraftLine) {
    if (!isDraftValid(d)) return
    const partNo = d.partNo.trim()
    const manufacturer = d.manufacturer.trim()
    const existing = getLine(partNo, manufacturer)
    if (existing) {
      setQuantity(partNo, manufacturer, existing.quantity + d.quantity)
      flashRow(keyFor(partNo, manufacturer))
    } else {
      addItem({ partNo, manufacturer, description: d.description || describePartNo(partNo) || undefined, quantity: d.quantity })
    }
  }

  // Opens the first draft, or — when a valid draft is already open — commits it
  // and opens a fresh one (one editable draft at a time).
  function handleAddLineItem() {
    if (draft) {
      if (!isDraftValid(draft)) return
      commitDraft(draft)
      setDraft(emptyDraft())
    } else {
      setDraft(emptyDraft())
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    const form = e.currentTarget
    if (draft && isDraftValid(draft)) commitDraft(draft)
    setDraft(null)
    // Snapshot the cart before we clear it on success.
    const snapshot = lines
    const partsCount = snapshot.length
    setError(null)
    setSubmitting(true)

    const payload: Record<string, string> = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]),
    )
    payload.method = 'cart'
    payload.partsCount = String(partsCount)
    payload.parts = snapshot
      .map((l) => `${l.partNo} | ${l.manufacturer} | qty ${l.quantity}${l.description ? ` | ${l.description}` : ''}`)
      .join('\n')

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || 'We could not submit your RFQ. Please try again.')
      }
      const { reference } = (await res.json()) as { reference: string }
      setRef(reference)
      setSent(true)
      track('generate_lead', { method: 'cart', parts_count: partsCount, reference })
      clear()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success state (mirrors RfqForm) ───────────────────────────
  if (sent) {
    return (
      <>
        <PageHeader />
        <div className="mt-10 border border-hairline bg-white p-8 text-center sm:p-12">
        <CheckCircle2 size={52} className="mx-auto text-success" />
        <h3 className="mt-4 font-display text-h4 font-medium">Your RFQ has been submitted</h3>
        <p className="mx-auto mt-2 max-w-md text-secondary">
          A dedicated account manager will respond with a competitive quote for all requested parts — typically within
          15 minutes, 24/7 × 365.
        </p>
        <p className="mt-4 inline-block bg-surface px-4 py-2 font-mono text-sm">Reference: {ref}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/search" className="btn btn-outline">Search more parts</Link>
          <Link href="/" className="btn btn-primary">Back to home</Link>
        </div>
        </div>
      </>
    )
  }

  // ── Empty state ───────────────────────────────────────────────
  // Skipped once a draft is open so the first typed part flips straight to the
  // table view (a memory-only RFQ needs no catalog visit).
  if (lines.length === 0 && !draft) {
    return (
      <>
        <PageHeader />
        <div className="mt-10 border border-hairline bg-white p-10 text-center sm:p-16">
        <ShoppingCart size={48} className="mx-auto text-tertiary" />
        <h2 className="mt-4 font-display text-h4 font-medium">Your cart is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-secondary">
          Add parts from any search result or catalog listing — or, if you already know the part number, add a line
          item here to build your quote request without searching.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/catalog/aviation/part-types" className="btn btn-primary">Browse catalog</Link>
          <button type="button" onClick={handleAddLineItem} className="btn btn-tertiary">
            <Plus size={16} /> Add Line Item
          </button>
        </div>
        </div>
      </>
    )
  }

  // ── Cart with items ───────────────────────────────────────────
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
      {/* Header + line items — the scrolling column */}
      <div>
        <PageHeader />

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-display text-h4 font-medium">
            {lines.length} {lines.length === 1 ? 'part' : 'parts'} · {totalCount} total qty
          </h2>
          {lines.length > 0 && (
            <button onClick={clear} className="text-sm text-tertiary underline underline-offset-2 hover:text-accent">
              Clear cart
            </button>
          )}
        </div>

        <div className="mt-4 overflow-x-auto border border-hairline">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-left text-white">
                <Th>Part No.</Th>
                <Th>Manufacturer</Th>
                <Th>Item Name</Th>
                <Th className="w-40 text-center">Quantity</Th>
                <Th className="w-16 text-center">Remove</Th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const k = keyFor(l.partNo, l.manufacturer)
                return (
                  <tr
                    key={k}
                    ref={(el) => {
                      if (el) rowRefs.current.set(k, el)
                      else rowRefs.current.delete(k)
                    }}
                    className={cn('border-t border-hairline hover:bg-surface', flashKey === k && 'row-flash')}
                  >
                    <td className="px-4 py-3 font-mono text-navy">{l.partNo}</td>
                    <td className="px-4 py-3 text-secondary">{l.manufacturer}</td>
                    <td className="px-4 py-3 text-secondary">{l.description ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <QtyStepper
                          size="md"
                          quantity={l.quantity}
                          onChange={(n) => setQuantity(l.partNo, l.manufacturer, n)}
                          onDecrementBelowOne={() => removeItem(l.partNo, l.manufacturer)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeItem(l.partNo, l.manufacturer)}
                        aria-label={`Remove ${l.partNo}`}
                        className="inline-flex h-8 w-8 items-center justify-center text-tertiary transition-colors hover:text-accent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}

              {draft && (
                <DraftLineRow
                  draft={draft}
                  onChange={setDraft}
                  onCommit={() => {
                    commitDraft(draft)
                    setDraft(null)
                  }}
                  onDiscard={() => setDraft(null)}
                />
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAddLineItem}
          disabled={draft !== null && !isDraftValid(draft)}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline disabled:cursor-not-allowed disabled:text-tertiary disabled:no-underline"
        >
          <Plus size={16} /> Add Line Item
        </button>
      </div>

      {/* Contact form — sticky on desktop, top-aligned with the eyebrow */}
      <form onSubmit={submit} className="h-fit border border-hairline bg-white lg:sticky lg:top-[96px] lg:self-start">
        <p className="border-b border-hairline bg-navy px-5 py-3 font-display text-sm font-medium text-white">
          Request a quote for all parts
        </p>
        <div className="space-y-4 p-5">
          <Field id="cart-name" name="contactName" label="Contact Name" required />
          <Field id="cart-company" name="company" label="Company Name" required />
          <div>
            <label htmlFor="cart-ctype" className="field-label">Company Type</label>
            <Select
              id="cart-ctype"
              name="companyType"
              ariaLabel="Company Type"
              options={['Manufacturer', 'Distributor', 'Airline', 'Broker']}
            />
          </div>
          <Field id="cart-phone" name="phone" label="Phone" type="tel" required />
          <Field id="cart-email" name="email" label="Email" type="email" required />
          <div>
            <label htmlFor="cart-need" className="field-label">Need Parts By <span className="text-accent">*</span></label>
            <Select
              id="cart-need"
              name="needBy"
              required
              ariaLabel="Need Parts By"
              options={['Immediately (AOG)', '1–2 weeks', '1 month', 'Flexible']}
            />
          </div>
          <div>
            <label htmlFor="cart-comments" className="field-label">Comments</label>
            <textarea id="cart-comments" name="comments" rows={2} className="field-input" />
          </div>
          <label className="flex items-start gap-3 text-sm text-secondary">
            <input type="checkbox" required className="mt-1 accent-[var(--color-accent)]" />
            <span>
              I acknowledge and accept the ASAP Semiconductor{' '}
              <a href="/policies/customer-terms" className="text-accent underline">Terms &amp; Conditions</a>.
            </span>
          </label>
          {error && <p className="text-sm text-warning">{error}</p>}
          <button type="submit" disabled={submitting} className="btn btn-primary w-full justify-center disabled:opacity-60">
            {submitting ? 'Submitting…' : 'Submit RFQ'}
          </button>
        </div>
      </form>
    </div>
  )
}

function PageHeader() {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">RFQ Cart</p>
      <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">Your parts cart</h1>
      <p className="mt-4 text-body-lg text-secondary">
        Review the parts you have collected, set quantities, and submit one request for a competitive quote on
        everything — answered within 15 minutes, 24/7.
      </p>
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn('px-4 py-3 font-medium', className)}>{children}</th>
}

function Field({
  id,
  name,
  label,
  type = 'text',
  required = false,
}: {
  id: string
  name?: string
  label: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input id={id} name={name ?? id} type={type} required={required} className="field-input" />
    </div>
  )
}
