'use client'

import { forwardRef, useRef, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2, PhoneCall, ShieldCheck } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { COMPANY } from '@/lib/data/site'
import { trackLead, trackRfqFormStart } from '@/lib/analytics'

// When AOG is raised from a specific part (deep-linked from a part page), the
// part identity is prepended to the Comments blob — see buildPayload.
export interface AogDefaults {
  partNo?: string
  manufacturer?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'
type Errors = Partial<Record<Field, string>>
type Field =
  | 'firstName' | 'lastName' | 'phone' | 'email'
  | 'address' | 'city' | 'postal' | 'country' | 'details' | 'consent'

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia',
  'Germany', 'France', 'United Arab Emirates', 'Other',
]

// Focus order for "focus the first invalid field" (address is optional).
const FOCUS_ORDER: Field[] = [
  'firstName', 'lastName', 'phone', 'email', 'city', 'postal', 'country', 'details', 'consent',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AogForm({
  defaults,
  onAogChange,
}: {
  defaults?: AogDefaults
  /** Lets the parent (e.g. InstantRfqPanel) swap back to the standard RFQ form
      when the AOG toggle is unchecked from inside this form. */
  onAogChange?: (aog: boolean) => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [ref, setRef] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: '', postal: '', country: 'United States', details: '',
    consent: false,
  })

  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)
  const postalRef = useRef<HTMLInputElement>(null)
  const detailsRef = useRef<HTMLTextAreaElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key as Field]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): Errors {
    const e: Errors = {}
    if (!form.firstName.trim()) e.firstName = 'Enter your first name.'
    if (!form.lastName.trim()) e.lastName = 'Enter your last name.'
    const digits = (form.phone.match(/\d/g) || []).length
    if (digits < 7 || digits > 15) e.phone = 'Enter a valid phone number.'
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address.'
    if (!form.city.trim()) e.city = 'Enter a city.'
    if (!form.postal.trim()) e.postal = 'Enter a postal code.'
    if (!form.country) e.country = 'Select a country.'
    if (!form.details.trim()) e.details = 'Tell us what you need.'
    else if (form.details.length > 4000) e.details = 'Keep this under 4000 characters.'
    if (!form.consent) e.consent = 'Please accept the terms to continue.'
    return e
  }

  function focusFirst(e: Errors) {
    const map: Record<Field, () => void> = {
      firstName: () => firstNameRef.current?.focus(),
      lastName: () => lastNameRef.current?.focus(),
      phone: () => phoneRef.current?.focus(),
      email: () => emailRef.current?.focus(),
      address: () => {},
      city: () => cityRef.current?.focus(),
      postal: () => postalRef.current?.focus(),
      country: () => document.getElementById('aog-country')?.focus(),
      details: () => detailsRef.current?.focus(),
      consent: () => consentRef.current?.focus(),
    }
    const first = FOCUS_ORDER.find((k) => e[k])
    if (first) map[first]()
  }

  function buildPayload(id: string) {
    const shipTo = [form.address, form.city, form.postal, form.country]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(', ')
    const partLine = defaults?.partNo
      ? `AOG request for ${defaults.partNo}${defaults.manufacturer ? ` (${defaults.manufacturer})` : ''}.\n`
      : ''
    return {
      CustFName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      CustPhone1: form.phone.trim(),
      CustEmail: form.email.trim(),
      CustComp: 'AOG intake',
      Comments: `${partLine}AOG request. Ship-to: ${shipTo}\n\n${form.details.trim()}`,
      PartsBy: 'AOG',
      aog: true,
      method: 'aog',
      ref: id,
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      focusFirst(errs)
      return
    }
    setStatus('submitting')
    const id = 'ASAP-' + Math.floor(100000 + Math.random() * 899999)
    const payload = buildPayload(id)
    try {
      // This branch has no RFQ endpoint — the normal RFQ flow mocks success the
      // same way. When /api/rfq lands, replace this block with a real POST of
      // `payload` and read the server-authoritative ref from the response:
      //   const res = await fetch('/api/rfq', { method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(payload) })
      //   if (!res.ok) throw new Error('bad status')
      //   setRef((await res.json()).ref)
      void payload
      await new Promise((r) => setTimeout(r, 700))
      setRef(id)
      setStatus('success')
      trackLead({ method: 'aog', ref: id })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="border border-hairline bg-white p-8 text-center sm:p-12">
        <CheckCircle2 size={52} className="mx-auto text-success" />
        <p className="eyebrow mt-5">AOG request received</p>
        <h2 className="mt-2 font-display text-h4 font-medium">A specialist is picking this up now.</h2>
        <p className="mt-4 inline-block bg-surface px-4 py-2 font-mono text-sm">Reference: {ref}</p>
        <p className="mx-auto mt-4 max-w-md text-secondary">
          A named rep will reply by email shortly — first response within 15 minutes, day or night.
        </p>
        <p className="mt-2 text-secondary">
          Can&rsquo;t wait? Call the desk directly at{' '}
          <a href={`tel:${COMPANY.phone}`} className="font-medium text-accent">{COMPANY.phone}</a>.
        </p>
        {/* B5 · no lane terminates — offer a next search alongside the back-home. */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/search" className="btn btn-outline">Search more parts</Link>
          <Link href="/" className="btn btn-primary">Back to home</Link>
        </div>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form onSubmit={submit} onFocusCapture={() => trackRfqFormStart('aog')} noValidate className="border border-hairline bg-white">
      {status === 'error' && (
        <div role="alert" className="flex items-start gap-3 border-b border-hairline bg-[color-mix(in_srgb,var(--color-error)_8%,#fff)] p-5 text-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-error" />
          <p className="text-ink">
            Could not reach the desk. Call the AOG desk directly at{' '}
            <a href={`tel:${COMPANY.phone}`} className="font-medium text-accent">{COMPANY.phone}</a>{' '}
            or email{' '}
            <a href={`mailto:${COMPANY.email}`} className="font-medium text-accent">{COMPANY.email}</a>.
          </p>
        </div>
      )}

      {defaults?.partNo && (
        <p className="border-b border-hairline bg-navy px-5 py-3 font-display text-sm font-medium text-white">
          AOG request for {defaults.partNo}
          {defaults.manufacturer ? ` (${defaults.manufacturer})` : ''}
        </p>
      )}

      {/* AOG toggle — mirrors the checkbox in the standard RFQ form so the
          user can flip back without leaving the panel. Only rendered when the
          parent is listening for the flip (i.e. it's showing this form because
          the RFQ toggle is on). */}
      {onAogChange && (
        <label htmlFor="aog-toggle" className="flex cursor-pointer items-start gap-3 border-b border-hairline p-5 text-sm text-secondary">
          <input
            id="aog-toggle"
            type="checkbox"
            checked
            onChange={(e) => onAogChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-warning)]"
          />
          <span>
            <span className="font-medium text-ink">This is an AOG (Aircraft on Ground) request.</span>{' '}
            We&rsquo;ll prioritize it and expedite your quote.
          </span>
        </label>
      )}

      {/* Contact */}
      <fieldset className="border-b border-hairline p-6">
        <legend className="float-left mb-4 w-full font-display text-sm font-medium text-navy">Your details</legend>
        <div className="clear-both grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <TextField ref={firstNameRef} id="aog-first" label="First name" required autoComplete="given-name" maxLength={80}
            value={form.firstName} onChange={(v) => set('firstName', v)} error={errors.firstName} />
          <TextField ref={lastNameRef} id="aog-last" label="Last name" required autoComplete="family-name" maxLength={80}
            value={form.lastName} onChange={(v) => set('lastName', v)} error={errors.lastName} />
          <TextField ref={phoneRef} id="aog-phone" label="Phone number" required type="tel" autoComplete="tel" maxLength={24}
            placeholder={COMPANY.phone} value={form.phone} onChange={(v) => set('phone', v)} error={errors.phone} />
          <TextField ref={emailRef} id="aog-email" label="Email address" required type="email" autoComplete="email"
            placeholder="you@company.com" value={form.email} onChange={(v) => set('email', v)} error={errors.email} />
        </div>
      </fieldset>

      {/* Ship-to + situation */}
      <fieldset className="p-6">
        <legend className="float-left mb-4 w-full font-display text-sm font-medium text-navy">Ship-to &amp; the situation</legend>
        <div className="clear-both grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextField id="aog-address" label="Address" autoComplete="street-address" maxLength={120}
              placeholder="Hangar, FBO, or street" value={form.address} onChange={(v) => set('address', v)} error={errors.address} />
          </div>
          <TextField ref={cityRef} id="aog-city" label="City" required autoComplete="address-level2" maxLength={80}
            value={form.city} onChange={(v) => set('city', v)} error={errors.city} />
          <TextField ref={postalRef} id="aog-postal" label="Postal code" required autoComplete="postal-code" maxLength={16}
            value={form.postal} onChange={(v) => set('postal', v)} error={errors.postal} />
          <div>
            <label htmlFor="aog-country" className="field-label">Country <span className="text-accent">*</span></label>
            <Select
              id="aog-country"
              required
              ariaLabel="Country"
              value={form.country}
              onChange={(v) => set('country', v)}
              options={COUNTRIES}
            />
            {errors.country && <p id="aog-country-err" className="mt-1 text-xs text-error">{errors.country}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aog-details" className="field-label">Details <span className="text-accent">*</span></label>
            <textarea
              ref={detailsRef}
              id="aog-details"
              rows={4}
              maxLength={4000}
              required
              aria-invalid={!!errors.details}
              aria-describedby={errors.details ? 'aog-details-err' : 'aog-details-hint'}
              className="field-input"
              placeholder="e.g. MS27039, qty 2, A320 tail N123AB, on stand at KLAX"
              value={form.details}
              onChange={(e) => set('details', e.target.value)}
            />
            {errors.details ? (
              <p id="aog-details-err" className="mt-1 text-xs text-error">{errors.details}</p>
            ) : (
              <p id="aog-details-hint" className="mt-1 text-xs text-tertiary">
                Part number, NSN, tail number, or what failed. Whatever you have.
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Consent + submit */}
      <div className="border-t border-hairline p-6">
        <label className="flex items-start gap-3 text-sm text-secondary">
          <input
            ref={consentRef}
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'aog-consent-err' : undefined}
            className="mt-1 accent-[var(--color-accent)]"
          />
          <span>
            I acknowledge and accept the ASAP Semiconductor{' '}
            <a href="/policies/customer-terms" className="text-accent underline">Terms &amp; Conditions</a>{' '}
            and consent to be contacted about this request. We never share your information.
          </span>
        </label>
        {errors.consent && <p id="aog-consent-err" className="mt-2 text-xs text-error">{errors.consent}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-5">
          <button type="submit" className="btn btn-danger" disabled={submitting}>
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Sending…</>
            ) : (
              <><PhoneCall size={16} /> Send AOG request</>
            )}
          </button>
          <span className="flex items-center gap-2 text-sm text-tertiary">
            <ShieldCheck size={15} className="text-accent" /> First response within 15 minutes
          </span>
        </div>
      </div>
    </form>
  )
}

const TextField = forwardRef<HTMLInputElement, {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  type?: string
  autoComplete?: string
  maxLength?: number
  placeholder?: string
}>(function TextField(
  { id, label, value, onChange, error, required = false, type = 'text', autoComplete, maxLength, placeholder },
  ref,
) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="field-input"
      />
      {error && <p id={`${id}-err`} className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
})
