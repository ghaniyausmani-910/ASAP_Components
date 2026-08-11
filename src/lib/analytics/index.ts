import type { AnalyticsEvent, AnalyticsEventParams } from './events'

export type { AnalyticsEvent, AnalyticsEventParams } from './events'

/** GA4 Measurement ID (G-XXXXXXXXXX). Set NEXT_PUBLIC_GA_ID in .env.local. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID
/** Microsoft Clarity project ID. Set NEXT_PUBLIC_CLARITY_ID in .env.local. */
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

type Gtag = (...args: unknown[]) => void

function getGtag(): Gtag | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { gtag?: Gtag }
  return typeof w.gtag === 'function' ? w.gtag : undefined
}

/**
 * Send a typed CRO event to GA4.
 *
 * Safe to call anywhere: no-ops during SSR and when gtag hasn't loaded (e.g.
 * GA_ID unset, or the user declined cookies so the script never initialised).
 * This is the ONE place funnel events go through — see ./events.ts for the
 * allowed names and params.
 */
export function track<E extends AnalyticsEvent>(event: E, params?: AnalyticsEventParams[E]): void {
  const gtag = getGtag()
  if (!gtag) return
  gtag('event', event, params ?? {})
}

/**
 * Update GA4 Consent Mode (v2) and Clarity consent to match the user's
 * cookie-banner choice. Called on Accept/Decline and on load when a prior
 * choice exists. Defaults are set to "denied" in the loader (Analytics.tsx),
 * so nothing tracks until this grants it.
 */
export function updateConsent(granted: boolean): void {
  if (typeof window === 'undefined') return
  const gtag = getGtag()
  const value = granted ? 'granted' : 'denied'
  gtag?.('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  })
  const w = window as unknown as { clarity?: (...args: unknown[]) => void }
  if (granted && typeof w.clarity === 'function') w.clarity('consent')
}
