'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

/**
 * One delegated click listener for the whole app that fires `tel_click` /
 * `mailto_click` whenever any phone or email link is clicked — no matter which
 * (server) component rendered it (Footer, ContactCards, the quote page, …).
 *
 * Using event delegation keeps those components untouched (and server-rendered)
 * rather than converting each to a client component just to attach an onClick.
 */
export function OutboundLinkTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest('a')
      const href = anchor?.getAttribute('href')
      if (!href) return
      const location = window.location.pathname
      if (href.startsWith('tel:')) track('tel_click', { location })
      else if (href.startsWith('mailto:')) track('mailto_click', { location })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
