'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, Clock, ShieldCheck, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { QtyStepper } from '@/components/cart/QtyStepper'
import { cn } from '@/lib/utils'

export function CartView() {
  const { lines, totalCount, setQuantity, removeItem, clear } = useCart()
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id = 'ASAP-' + Math.floor(100000 + Math.random() * 899999)
    setRef(id)
    setSent(true)
    clear()
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
  if (lines.length === 0) {
    return (
      <>
        <PageHeader />
        <div className="mt-10 border border-hairline bg-white p-10 text-center sm:p-16">
        <ShoppingCart size={48} className="mx-auto text-tertiary" />
        <h2 className="mt-4 font-display text-h4 font-medium">Your cart is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-secondary">
          Add parts from any search result or catalog listing to build a single quote request for everything you need.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/catalog/aviation/part-types" className="btn btn-primary">Browse catalog</Link>
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
          <button onClick={clear} className="text-sm text-tertiary underline underline-offset-2 hover:text-accent">
            Clear cart
          </button>
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
              {lines.map((l) => (
                <tr key={`${l.manufacturer}-${l.partNo}`} className="border-t border-hairline hover:bg-surface">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact form — sticky on desktop, top-aligned with the eyebrow */}
      <form onSubmit={submit} className="h-fit border border-hairline bg-white lg:sticky lg:top-[96px] lg:self-start">
        <p className="border-b border-hairline bg-navy px-5 py-3 font-display text-sm font-medium text-white">
          Request a quote for all parts
        </p>
        <div className="space-y-4 p-5">
          <Field id="cart-name" label="Contact Name" required />
          <Field id="cart-company" label="Company Name" required />
          <div>
            <label htmlFor="cart-ctype" className="field-label">Company Type <span className="text-accent">*</span></label>
            <select id="cart-ctype" required className="field-input">
              <option value="">Select…</option>
              <option>Commercial</option>
              <option>Military / Defense</option>
              <option>Government</option>
              <option>MRO / FBO</option>
            </select>
          </div>
          <Field id="cart-phone" label="Phone" type="tel" required />
          <Field id="cart-email" label="Email" type="email" required />
          <div>
            <label htmlFor="cart-need" className="field-label">Need Parts By <span className="text-accent">*</span></label>
            <select id="cart-need" required className="field-input">
              <option value="">Select…</option>
              <option>Immediately (AOG)</option>
              <option>1–2 weeks</option>
              <option>1 month</option>
              <option>Flexible</option>
            </select>
          </div>
          <div>
            <label htmlFor="cart-comments" className="field-label">Comments</label>
            <textarea id="cart-comments" rows={2} className="field-input" />
          </div>
          <label className="flex items-start gap-3 text-sm text-secondary">
            <input type="checkbox" required className="mt-1 accent-[var(--color-accent)]" />
            <span>
              I acknowledge and accept the ASAP Semiconductor{' '}
              <a href="/policies/customer-terms" className="text-accent underline">Terms &amp; Conditions</a>.
            </span>
          </label>
          <button type="submit" className="btn btn-primary w-full justify-center">Submit RFQ</button>
          <div className="space-y-1.5 pt-1">
            <span className="flex items-center gap-2 text-xs text-tertiary"><Clock size={14} className="text-accent" /> Quotes back within 15 minutes</span>
            <span className="flex items-center gap-2 text-xs text-tertiary"><ShieldCheck size={14} className="text-accent" /> We never share your information</span>
          </div>
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
  label,
  type = 'text',
  required = false,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input id={id} type={type} required={required} className="field-input" />
    </div>
  )
}
