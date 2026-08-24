'use client'

import { useState } from 'react'
import { RfqForm, type RfqDefaults } from '@/components/rfq/RfqForm'
import { BomUpload } from '@/components/rfq/BomUpload'

// Pairs the full RFQ form with the BOM upload panel, and hides the BOM panel
// while the form is in AOG mode — an AOG request is a single urgent part, not a
// multi-line bill of materials, so the extra panel only slows intake.
export function InstantRfqPanel({ defaults }: { defaults?: RfqDefaults }) {
  const [aog, setAog] = useState(false)
  return (
    <div className="space-y-6">
      <RfqForm variant="full" defaults={defaults} onAogChange={setAog} />
      {!aog && <BomUpload />}
    </div>
  )
}
