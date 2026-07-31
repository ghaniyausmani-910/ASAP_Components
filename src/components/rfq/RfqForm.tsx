'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react'

type Variant = 'full' | 'compact'

export interface RfqDefaults {
  partNo?: string
  manufacturer?: string
  qty?: string
  email?: string
}

export function RfqForm({ variant = 'full', defaults }: { variant?: Variant; defaults?: RfqDefaults }) {
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id = 'ASAP-' + Math.floor(100000 + Math.random() * 899999)
    setRef(id)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="border border-hairline bg-white p-8 text-center sm:p-12">
        <CheckCircle2 size={52} className="mx-auto text-success" />
        <h3 className="mt-4 font-display text-h4 font-medium">Your RFQ has been submitted</h3>
        <p className="mx-auto mt-2 max-w-md text-secondary">
          A dedicated account manager will respond with a competitive quote — typically within 15 minutes, 24/7 × 365.
        </p>
        <p className="mt-4 inline-block bg-surface px-4 py-2 font-mono text-sm">Reference: {ref}</p>
        <div className="mt-4">
          <button className="btn btn-outline" onClick={() => setSent(false)}>Submit another RFQ</button>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={submit} className="border border-hairline bg-white">
        <p className="border-b border-hairline bg-navy px-5 py-3 font-display text-sm font-medium text-white">
          Please fill out the form below for {defaults?.partNo ?? 'this part'}
        </p>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field id="c-pn" label="Mfg Part Number" required defaultValue={defaults?.partNo} />
          <Field id="c-mfr" label="Manufacturer" required defaultValue={defaults?.manufacturer} />
          <Field id="c-name" label="Contact Name" required />
          <Field id="c-email" label="Email" type="email" required />
          <div className="sm:col-span-2">
            <button className="btn btn-primary w-full sm:w-auto">Submit RFQ</button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={submit} className="border border-hairline bg-white">
      <div className="grid md:grid-cols-2">
        {/* Part details */}
        <fieldset className="border-b border-hairline px-6 pb-6 pt-10 md:border-b-0 md:border-r">
          <legend className="mb-4 font-display text-sm font-medium text-navy">Part Details</legend>
          <div className="space-y-4">
            <Field id="pn" label="Mfg Part Number" required defaultValue={defaults?.partNo} />
            <Field id="mfr" label="Manufacturer" required defaultValue={defaults?.manufacturer} />
            <Field id="qty" label="Quantity (ea)" required defaultValue={defaults?.qty} />
            <div>
              <label htmlFor="need" className="field-label">Need Parts By <span className="text-accent">*</span></label>
              <select id="need" required className="field-input">
                <option value="">Select…</option>
                <option>Immediately (AOG)</option>
                <option>1–2 weeks</option>
                <option>1 month</option>
                <option>Flexible</option>
              </select>
            </div>
            <Field id="target" label="Target Price (ea) USD" />
          </div>
        </fieldset>

        {/* Contact info */}
        <fieldset className="px-6 pb-6 pt-10">
          <legend className="mb-4 font-display text-sm font-medium text-navy">Contact Information</legend>
          <div className="space-y-4">
            <Field id="name" label="Contact Name" required />
            <Field id="company" label="Company Name" required />
            <div>
              <label htmlFor="ctype" className="field-label">Company Type <span className="text-accent">*</span></label>
              <select id="ctype" required className="field-input">
                <option value="">Select…</option>
                <option>Commercial</option>
                <option>Military / Defense</option>
                <option>Government</option>
                <option>MRO / FBO</option>
              </select>
            </div>
            <Field id="phone" label="Phone" type="tel" required defaultValue={defaults?.email ? '' : ''} />
            <Field id="email" label="Email" type="email" required defaultValue={defaults?.email} />
            <div>
              <label htmlFor="comments" className="field-label">Comments</label>
              <textarea id="comments" rows={2} className="field-input" />
            </div>
          </div>
        </fieldset>
      </div>

      {/* Consent + submit */}
      <div className="border-t border-hairline p-6">
        <label className="flex items-start gap-3 text-sm text-secondary">
          <input type="checkbox" required className="mt-1 accent-[var(--color-accent)]" />
          <span>
            I acknowledge and accept the ASAP Semiconductor <a href="/policies/customer-terms" className="text-accent underline">Terms &amp; Conditions</a>.
            This portal is for quotations based on part numbers only — please do not submit drawings or technical data.
          </span>
        </label>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <button type="submit" className="btn btn-primary">Submit RFQ</button>
          <span className="flex items-center gap-2 text-sm text-tertiary"><Clock size={15} className="text-accent" /> Quotes back within 15 minutes</span>
          <span className="flex items-center gap-2 text-sm text-tertiary"><ShieldCheck size={15} className="text-accent" /> We never share your information</span>
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
      <input id={id} type={type} required={required} defaultValue={defaultValue} className="field-input" />
    </div>
  )
}
