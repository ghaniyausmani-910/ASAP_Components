'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, PhoneCall, ShieldCheck } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { AogPulseDot } from '@/components/rfq/AogPulseDot'
import { trackLead, trackRfqFormStart } from '@/lib/analytics'
import { COMPANY } from '@/lib/data/site'
import { cn } from '@/lib/utils'

type Variant = 'full' | 'compact'

export interface RfqDefaults {
  partNo?: string
  manufacturer?: string
  qty?: string
  email?: string
}

export function RfqForm({
  variant = 'full',
  defaults,
  onAogChange,
  hasBom = false,
}: {
  variant?: Variant
  defaults?: RfqDefaults
  /** Lets a parent (e.g. the Instant RFQ page) react to the AOG toggle — used
      to hide non-essential panels like the BOM upload while in AOG mode. */
  onAogChange?: (aog: boolean) => void
  /** When a BOM is attached (parent-managed), the parts list lives in the BOM,
      so the Part Details section is hidden — only contact info is collected. */
  hasBom?: boolean
}) {
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')
  const [aog, setAog] = useState(false)
  const [needBy, setNeedBy] = useState('')

  function toggleAog(checked: boolean) {
    setAog(checked)
    setNeedBy(checked ? 'AOG' : '')
    onAogChange?.(checked)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget as HTMLFormElement)
    const g = (k: string) => String(fd.get(k) ?? '').trim()
    const name = [g('first'), g('last')].filter(Boolean).join(' ') || g('c-name')
    const partNo = g('pn') || g('c-pn')
    const mfr = g('mfr') || g('c-mfr')
    const qty = g('qty')
    const company = g('company')
    const email = g('email') || g('c-email')
    const phone = g('phone')
    const comments = g('comments')

    const partSummary = [partNo && `Part: ${partNo}`, mfr && `Mfr: ${mfr}`, qty && `Qty: ${qty}`]
      .filter(Boolean)
      .join(' · ')
    const partLine = partNo ? `AOG request for ${partNo}${mfr ? ` (${mfr})` : ''}.\n` : ''
    const commentBody = [partSummary, comments].filter(Boolean).join('\n\n')

    const id = 'ASAP-' + Math.floor(100000 + Math.random() * 899999)
    // Section-6 RFQ contract. No endpoint exists on this branch, so success is
    // mocked (as every form here does); the payload is fully built so wiring a
    // real POST to /api/rfq later is a one-line change. The aog / method /
    // PartsBy flags travel in the body — the backend needs no AOG-specific path.
    const payload = {
      CustFName: name,
      CustPhone1: phone,
      CustEmail: email,
      CustComp: aog ? 'AOG intake' : company,
      Comments: aog ? `${partLine}AOG request.\n\n${commentBody}`.trim() : commentBody,
      PartsBy: aog ? 'AOG' : needBy,
      aog,
      method: aog ? 'aog' : hasBom ? 'rfq-bom' : 'rfq',
      ref: id,
    }
    void payload

    setRef(id)
    setSent(true)
    trackLead({ method: aog ? 'aog' : hasBom ? 'rfq-bom' : 'rfq', ref: id })
  }

  if (sent) {
    return (
      <div role="status" aria-live="polite" className="border border-hairline bg-white p-8 text-center sm:p-12">
        <CheckCircle2 size={52} className="mx-auto text-success" />
        <h3 className="mt-4 font-display text-h4 font-medium">
          {aog ? 'Your AOG request has been submitted' : 'Your RFQ has been submitted'}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-secondary">
          {aog
            ? 'A specialist is picking it up now — first response within 15 minutes, day or night.'
            : 'A dedicated account manager will respond with a competitive quote — typically within 15 minutes, 24/7 × 365.'}
        </p>
        <p className="mt-4 inline-block bg-surface px-4 py-2 font-mono text-sm">Reference: {ref}</p>
        {/* C7 · surface the phone number on success (matches AogForm behaviour), so
            an anxious buyer can escalate without composing a second RFQ. */}
        <p className="mt-2 text-sm text-secondary">
          Need to escalate? Call{' '}
          <a href={`tel:${COMPANY.phone}`} className="font-medium text-accent">{COMPANY.phone}</a>.
        </p>
        {/* B5 · never terminate — offer a next search or a fresh RFQ, and a link
            home. Mirrors the cart success state so no lane dead-ends. */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/search" className="btn btn-outline">Search more parts</Link>
          <button className="btn btn-primary" onClick={() => setSent(false)}>Submit another RFQ</button>
        </div>
      </div>
    )
  }

  // G1 · idempotent per-session marker for the first meaningful interaction
  // with any RFQ intake (compact or full). Fires on the form's first focusin.
  const method = aog ? 'aog' : hasBom ? 'rfq-bom' : 'rfq'
  function onFirstFocus() {
    trackRfqFormStart(method)
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={submit} onFocusCapture={onFirstFocus} className="border border-hairline bg-white">
        <p className="border-b border-hairline bg-navy px-5 py-3 font-display text-sm font-medium text-white">
          Please fill out the form below for {defaults?.partNo ?? 'this part'}
        </p>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field id="c-pn" label="Mfg Part Number" required defaultValue={defaults?.partNo} />
          <Field id="c-mfr" label="Manufacturer" required defaultValue={defaults?.manufacturer} />
          <Field id="c-name" label="Contact Name" required />
          <Field id="c-email" label="Email" type="email" required />
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-primary w-full sm:w-auto">Submit RFQ</button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={submit} onFocusCapture={onFirstFocus} className="border border-hairline bg-white">
      {/* B1 · at ≥lg, Part Details + Contact Information sit side-by-side so the
          submit lands above the 1080 fold. Below lg the two fieldsets stack. */}
      <div className={cn('grid', !hasBom && 'lg:grid-cols-2 lg:divide-x lg:divide-hairline')}>
      {/* Part details — hidden when a BOM is attached; the BOM is the parts list. */}
      {!hasBom && (
      <fieldset className="border-b border-hairline p-5 lg:border-b-0">
        <legend className="float-left mb-4 w-full font-display text-sm font-medium text-navy">Part Details</legend>
        <div className="clear-both grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field id="pn" label="Mfg Part Number" required defaultValue={defaults?.partNo} />
          <Field id="mfr" label="Manufacturer" required defaultValue={defaults?.manufacturer} />
          <Field id="qty" label="Quantity (ea)" required defaultValue={defaults?.qty} />
          <div>
            <label htmlFor="need" className="field-label">Need Parts By <span className="text-accent">*</span></label>
            {aog ? (
              <div className="field-input flex items-center gap-2 bg-surface font-medium text-ink" aria-live="polite">
                <AogPulseDot /> AOG — immediate
              </div>
            ) : (
              <Select
                id="need"
                required
                ariaLabel="Need Parts By"
                value={needBy}
                onChange={setNeedBy}
                options={['Immediately', '1–2 weeks', '1 month', 'Flexible']}
              />
            )}
          </div>
          <label htmlFor="aog" className="flex cursor-pointer items-start gap-3 text-sm text-secondary sm:col-span-2">
            <input
              id="aog"
              type="checkbox"
              checked={aog}
              onChange={(e) => toggleAog(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-warning)]"
            />
            <span>
              <span className="font-medium text-ink">This is an AOG (Aircraft on Ground) request.</span>{' '}
              We&rsquo;ll prioritize it and expedite your quote.
            </span>
          </label>
        </div>
      </fieldset>
      )}

      {/* Contact info */}
      <fieldset className="p-5">
        <legend className="float-left mb-4 w-full font-display text-sm font-medium text-navy">Contact Information</legend>
        <div className="clear-both grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field id="first" label="First Name" required />
          <Field id="last" label="Last Name" required />
          <Field id="company" label="Company Name" required />
          <div>
            <label htmlFor="ctype" className="field-label">Company Type</label>
            <Select
              id="ctype"
              ariaLabel="Company Type"
              options={['Manufacturer', 'Distributor', 'Airline', 'Broker']}
            />
          </div>
          <Field id="phone" label="Phone" type="tel" required />
          <Field id="email" label="Email" type="email" required defaultValue={defaults?.email} />
          <div className="sm:col-span-2">
            <label htmlFor="comments" className="field-label">Comments</label>
            <textarea
              id="comments"
              name="comments"
              rows={2}
              className="field-input"
              placeholder="Share anything that helps us quote — a target price, acceptable alternates, or preferred condition."
            />
          </div>
        </div>
      </fieldset>
      </div>

      {/* Consent + submit */}
      <div className="border-t border-hairline p-5">
        <label className="flex items-start gap-3 text-sm text-secondary">
          <input type="checkbox" required className="mt-1 accent-[var(--color-accent)]" />
          <span>
            I acknowledge and accept the ASAP Semiconductor <a href="/policies/customer-terms" className="text-accent underline">Terms &amp; Conditions</a>.
            This portal is for quotations based on part numbers only — please do not submit drawings or technical data.
          </span>
        </label>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <button type="submit" className={cn('btn', aog ? 'btn-danger' : 'btn-primary')}>
            {aog ? <><PhoneCall size={16} /> Send AOG request</> : 'Submit RFQ'}
          </button>
          <span className="flex items-center gap-2 text-sm text-tertiary">
            {aog ? (
              <><ShieldCheck size={15} className="text-accent" /> First response within 15 minutes</>
            ) : (
              <><Clock size={15} className="text-accent" /> Quotes back within 15 minutes</>
            )}
          </span>
          {!aog && (
            <span className="flex items-center gap-2 text-sm text-tertiary"><ShieldCheck size={15} className="text-accent" /> We never share your information</span>
          )}
        </div>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  type = 'text',
  required = false,
  defaultValue,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  defaultValue?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input id={id} name={id} type={type} required={required} defaultValue={defaultValue} className="field-input" />
    </div>
  )
}
