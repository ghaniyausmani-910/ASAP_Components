'use client'

// G1 · Emits the `rfq_start` event when a user lands on an RFQ intake surface.
// Client shim so the page itself can stay a Server Component. `source` tags the
// lane (instant-rfq, aog, search-miss, part-detail, header).

import { useEffect } from 'react'
import { trackRfqStart } from '@/lib/analytics'

export function RfqStartTracker({
  source,
  partNo,
  manufacturer,
}: {
  source: string
  partNo?: string
  manufacturer?: string
}) {
  useEffect(() => {
    trackRfqStart(source, { partNo, manufacturer })
  }, [source, partNo, manufacturer])
  return null
}
