'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'

export function SiteHeader() {
  const pathname = usePathname()
  const overlay = pathname === '/'
  // Home floats the header as an overlay above the hero; every inner page uses
  // a sticky header that lives in normal flow (no spacer, no magic-number
  // offset that could ever leave content peeking underneath).
  return <Header variant={overlay ? 'overlay' : 'solid'} />

}
