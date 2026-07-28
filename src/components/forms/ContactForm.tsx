'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center border border-hairline bg-surface p-10 text-center">
        <CheckCircle2 size={48} className="text-success" />
        <h3 className="mt-4 font-display text-h4 font-medium">Message received</h3>
        <p className="mt-2 max-w-sm text-secondary">
          Thank you for reaching out. One of our representatives will contact you shortly — typically within 15 minutes
          during business hours.
        </p>
        <button className="btn btn-outline mt-6" onClick={() => setSent(false)}>Send another message</button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
      className="border border-hairline bg-white p-6 sm:p-8"
    >
      <p className="mb-6 text-xs uppercase tracking-[0.08em] text-tertiary">
        Fields marked <span className="text-accent">*</span> are required
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name" required id="fn" />
        <Field label="Last Name" required id="ln" />
        <Field label="Email" type="email" required id="em" />
        <Field label="Phone" type="tel" id="ph" />
        <Field label="Company" id="co" />
        <Field label="Country" id="cn" />
        <div className="sm:col-span-2">
          <label htmlFor="msg" className="field-label">Message <span className="text-accent">*</span></label>
          <textarea id="msg" required rows={5} className="field-input" placeholder="How can we help?" />
        </div>
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm text-secondary">
        <input type="checkbox" required className="mt-1 accent-[var(--color-accent)]" />
        <span>All quotes and sales are subject to ASAP Semiconductor&apos;s Terms &amp; Conditions.</span>
      </label>
      <button type="submit" className="btn btn-primary mt-6">Submit</button>
    </form>
  )
}

function Field({
  label,
  id,
  type = 'text',
  required = false,
}: {
  label: string
  id: string
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
