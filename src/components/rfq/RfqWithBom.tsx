'use client'

import { useState } from 'react'
import { RfqForm, type RfqDefaults } from '@/components/rfq/RfqForm'
import { BomUpload } from '@/components/rfq/BomUpload'
import { cn } from '@/lib/utils'

/**
 * Pairs the RFQ form with the BOM uploader and shares the state between them:
 * once a BOM is attached, the form collapses its part-detail fields (the parts
 * come from the list) and shows only contact info + the AOG toggle. The whole
 * request is submitted right here on the page — no cart hand-off. After submit,
 * the form swaps to its success panel and the uploader is hidden (kept mounted
 * so its state survives if the user submits another RFQ).
 */
export function RfqWithBom({
  variant,
  defaults,
  className,
}: {
  variant: 'full' | 'compact'
  defaults?: RfqDefaults
  className?: string
}) {
  const [bom, setBom] = useState<{ partsCount: number; fileName: string } | null>(null)
  const [sent, setSent] = useState(false)

  return (
    <div className={cn('space-y-6', className)}>
      <RfqForm variant={variant} defaults={defaults} bom={bom} onSentChange={setSent} />
      <BomUpload
        className={sent ? 'hidden' : undefined}
        onActiveChange={(active, partsCount, fileName) =>
          setBom(active && fileName ? { partsCount, fileName } : null)
        }
      />
    </div>
  )
}
