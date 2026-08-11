'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { track } from '@/lib/analytics'

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    const form = e.currentTarget
    setError(null)
    setSubmitting(true)
    const payload = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]),
    )
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || 'We could not send your message. Please try again.')
      }
      setSent(true)
      track('contact_submit', {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
    <form onSubmit={submit} className="border border-hairline bg-white p-6 sm:p-8">
      <p className="mb-6 text-xs uppercase tracking-[0.08em] text-tertiary">
        Fields marked <span className="text-accent">*</span> are required
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name" required id="fn" name="firstName" />
        <Field label="Last Name" required id="ln" name="lastName" />
        <Field label="Email" type="email" required id="em" name="email" />
        <Field label="Phone" type="tel" id="ph" name="phone" />
        <Field label="Company" id="co" name="company" />
        <Field label="Country" id="cn" name="country" />
        <div className="sm:col-span-2">
          <label htmlFor="msg" className="field-label">Message <span className="text-accent">*</span></label>
          <textarea id="msg" name="message" required rows={5} className="field-input" placeholder="How can we help?" />
        </div>
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm text-secondary">
        <input type="checkbox" required className="mt-1 accent-[var(--color-accent)]" />
        <span>All quotes and sales are subject to ASAP Semiconductor&apos;s Terms &amp; Conditions.</span>
      </label>
      {error && <p className="mt-4 text-sm text-warning">{error}</p>}
      <button type="submit" disabled={submitting} className="btn btn-primary mt-6 disabled:opacity-60">
        {submitting ? 'Sending…' : 'Submit'}
      </button>
    </form>
  )
}

function Field({
  label,
  id,
  name,
  type = 'text',
  required = false,
}: {
  label: string
  id: string
  name?: string
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
