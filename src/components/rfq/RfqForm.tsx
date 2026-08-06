'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, ShieldCheck, FileCheck2 } from 'lucide-react'
import { Select } from '@/components/ui/Select'

type Variant = 'full' | 'compact'

export interface RfqDefaults {
  partNo?: string
  manufacturer?: string
  qty?: string
  email?: string
}

/** Set when a BOM is attached — collapses the part-detail fields (the parts come
 *  from the uploaded list instead) and leaves only contact info + the AOG toggle. */
export interface RfqBom {
  partsCount: number
  fileName: string
}

export function RfqForm({
  variant = 'full',
  defaults,
  bom = null,
  onSentChange,
}: {
  variant?: Variant
  defaults?: RfqDefaults
  bom?: RfqBom | null
  onSentChange?: (sent: boolean) => void
}) {
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')
  const [aog, setAog] = useState(false)
  const [needBy, setNeedBy] = useState('')

  const bomActive = bom !== null

  function toggleAog(checked: boolean) {
    setAog(checked)
    if (checked) setNeedBy('Immediately')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id = 'ASAP-' + Math.floor(100000 + Math.random() * 899999)
    setRef(id)
    setSent(true)
    onSentChange?.(true)
  }

  function reset() {
    setSent(false)
    onSentChange?.(false)
  }

  // A count-aware phrase for the parts on an attached BOM (0 when the file is a
  // format we process manually, e.g. xlsx/pdf).
  const partsPhrase = bom && bom.partsCount > 0 ? `${bom.partsCount} ${bom.partsCount === 1 ? 'part' : 'parts'}` : 'the parts'

  if (sent) {
    return (
      <div className="border border-hairline bg-white p-8 text-center sm:p-12">
        <CheckCircle2 size={52} className="mx-auto text-success" />
        <h3 className="mt-4 font-display text-h4 font-medium">Your RFQ has been submitted</h3>
        <p className="mx-auto mt-2 max-w-md text-secondary">
          {bomActive ? (
            <>We&rsquo;ve received your request for {partsPhrase} from <span className="font-mono">{bom!.fileName}</span>. </>
          ) : null}
          A dedicated account manager will respond with a competitive quote — typically within 15 minutes, 24/7 × 365.
        </p>
        <p className="mt-4 inline-block bg-surface px-4 py-2 font-mono text-sm">Reference: {ref}</p>
        <div className="mt-4">
          <button className="btn btn-outline" onClick={reset}>Submit another RFQ</button>
        </div>
      </div>
    )
  }

  // AOG toggle — shared by the part-details grid and the collapsed BOM header.
  const aogField = (
    <label htmlFor="aog" className="flex cursor-pointer items-start gap-3 text-sm text-secondary">
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
  )

  // Note shown in place of the part-detail fields once a BOM is attached.
  const bomNote = bom && (
    <p className="flex items-start gap-2 text-sm text-secondary">
      <FileCheck2 size={18} className="mt-0.5 shrink-0 text-success" />
      <span>
        Quoting {partsPhrase} from <span className="font-mono text-ink">{bom.fileName}</span> — no need to enter part
        details. Just add your contact information below.
      </span>
    </p>
  )

  if (variant === 'compact') {
    return (
      <form onSubmit={submit} className="border border-hairline bg-white">
        <p className="border-b border-hairline bg-navy px-5 py-3 font-display text-sm font-medium text-white">
          {bomActive ? <>Add your details — we&rsquo;ll quote {partsPhrase} from your BOM</> : <>Please fill out the form below for {defaults?.partNo ?? 'this part'}</>}
        </p>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {bomActive ? (
            <div className="sm:col-span-2">{bomNote}</div>
          ) : (
            <>
              <Field id="c-pn" label="Mfg Part Number" required defaultValue={defaults?.partNo} />
              <Field id="c-mfr" label="Manufacturer" required defaultValue={defaults?.manufacturer} />
            </>
          )}
          <Field id="c-name" label="Contact Name" required />
          <Field id="c-email" label="Email" type="email" required defaultValue={defaults?.email} />
          {bomActive && <div className="sm:col-span-2">{aogField}</div>}
          <div className="sm:col-span-2">
            <button className="btn btn-primary w-full sm:w-auto">Submit RFQ</button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={submit} className="border border-hairline bg-white">
      {/* Part details — collapse to a BOM note + AOG once a list is attached */}
      <fieldset className="border-b border-hairline p-6">
        <legend className="float-left mb-4 w-full font-display text-sm font-medium text-navy">
          {bomActive ? 'Your Bill of Materials' : 'Part Details'}
        </legend>
        {bomActive ? (
          <div className="clear-both space-y-4">
            {bomNote}
            {aogField}
          </div>
        ) : (
          <div className="clear-both grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <Field id="pn" label="Mfg Part Number" required defaultValue={defaults?.partNo} />
            <Field id="mfr" label="Manufacturer" required defaultValue={defaults?.manufacturer} />
            <Field id="qty" label="Quantity (ea)" required defaultValue={defaults?.qty} />
            <div>
              <label htmlFor="need" className="field-label">Need Parts By <span className="text-accent">*</span></label>
              <Select
                id="need"
                required
                ariaLabel="Need Parts By"
                value={needBy}
                onChange={setNeedBy}
                options={['Immediately', '1–2 weeks', '1 month', 'Flexible']}
              />
            </div>
            <div className="sm:col-span-2">{aogField}</div>
          </div>
        )}
      </fieldset>

      {/* Contact info */}
      <fieldset className="p-6">
        <legend className="float-left mb-4 w-full font-display text-sm font-medium text-navy">Contact Information</legend>
        <div className="clear-both grid gap-x-6 gap-y-5 sm:grid-cols-2">
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
              rows={2}
              className="field-input"
              placeholder="Share anything that helps us quote — a target price, acceptable alternates, or preferred condition."
            />
          </div>
        </div>
      </fieldset>

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
