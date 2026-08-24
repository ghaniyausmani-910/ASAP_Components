'use client'

// G1 · Emits the typed `view_item` funnel event when a part-detail page mounts.
// Kept as a client shim so the page itself stays a Server Component.

import { useEffect } from 'react'
import { trackViewItem } from '@/lib/analytics'

export function ViewItemTracker({
  partNo,
  manufacturer,
  category,
}: {
  partNo: string
  manufacturer: string
  category?: string
}) {
  useEffect(() => {
    trackViewItem({ partNo, manufacturer, category })
  }, [partNo, manufacturer, category])
  return null
}
