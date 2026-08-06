'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Renders dropdown content in a fixed-positioned portal on document.body,
 * anchored under `anchorEl`. This escapes any `overflow: hidden/auto` ancestor
 * (e.g. the cart table's horizontal-scroll wrapper) that would otherwise clip a
 * normally-positioned absolute menu. Position tracks the anchor on scroll/resize
 * while open. The child list owns its own width via `w-full`; this sets the box.
 */
export function PortalDropdown({
  anchorEl,
  open,
  children,
}: {
  anchorEl: HTMLElement | null
  open: boolean
  children: ReactNode
}) {
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    if (!open || !anchorEl) {
      setRect(null)
      return
    }
    const update = () => {
      const r = anchorEl.getBoundingClientRect()
      setRect({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    update()
    // Capture phase so scrolling any ancestor (not just window) repositions it.
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, anchorEl])

  if (!open || !rect || typeof document === 'undefined') return null

  return createPortal(
    <div style={{ position: 'fixed', top: rect.top, left: rect.left, width: rect.width, zIndex: 60 }}>
      {children}
    </div>,
    document.body,
  )
}
