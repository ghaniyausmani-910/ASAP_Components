'use client'

import { useState } from 'react'
import { RfqForm, type RfqDefaults } from '@/components/rfq/RfqForm'
import { BomUpload } from '@/components/rfq/BomUpload'

// Pairs the full RFQ form with the BOM upload panel. AOG hides BOM (an AOG is a
// single urgent part). A parsed/attached BOM in turn hides the RFQ Part Details
// — the BOM itself is the parts list, so re-entering a part number is redundant.
export function InstantRfqPanel({ defaults }: { defaults?: RfqDefaults }) {
  const [aog, setAog] = useState(false)
  const [hasBom, setHasBom] = useState(false)
  // Idle: drop-zone lives below the form as an alternative path. Once a BOM is
  // attached it becomes the parts list, so it flips above the contact form —
  // natural reading order is: "these are your parts → now enter contact info".
  // Reorder visually via flex `order` — swapping DOM slots would remount
  // BomUpload and blow away its parsed rows.
  return (
    <div className="flex flex-col gap-6">
      <div style={{ order: hasBom ? 1 : 2 }}>
        <RfqForm variant="full" defaults={defaults} onAogChange={setAog} hasBom={hasBom} />
      </div>
      {!aog && (
        <div style={{ order: hasBom ? 0 : 3 }}>
          <BomUpload onBomChange={setHasBom} />
        </div>
      )}
    </div>
  )
}
