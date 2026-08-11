'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { track } from '@/lib/analytics'

/** Parse an rgb/rgba string into [r,g,b,a]; returns null if fully transparent/unparseable. */
function parseColor(value: string): [number, number, number, number] | null {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return null
  const parts = match[1].split(',').map((p) => parseFloat(p.trim()))
  const [r, g, b, a = 1] = parts
  if (a === 0) return null
  return [r, g, b, a]
}

/** Perceived luminance (0–255). < ~140 reads as "dark". */
function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const detect = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Sample every element under the button center, skipping the widget itself,
    // and use the first one with an opaque-enough background color.
    const stack = document.elementsFromPoint(x, y)
    for (const el of stack) {
      if (btn.parentElement?.contains(el)) continue
      const bg = parseColor(getComputedStyle(el).backgroundColor)
      if (!bg || bg[3] < 0.5) continue
      setOnDark(luminance(bg[0], bg[1], bg[2]) < 140)
      return
    }
    setOnDark(false)
  }, [])

  useEffect(() => {
    detect()
    window.addEventListener('scroll', detect, { passive: true })
    window.addEventListener('resize', detect)
    return () => {
      window.removeEventListener('scroll', detect)
      window.removeEventListener('resize', detect)
    }
  }, [detect])

  return (
    <div className="fixed bottom-5 right-5 z-[65] print:hidden">
      {open && (
        <div className="mb-3 w-[300px] border border-hairline bg-white shadow-hover animate-fade">
          <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <span className="font-display text-sm font-medium">Chat with a specialist</span>
            <button aria-label="Close chat" onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <div className="bg-surface p-3 text-secondary">
              Hi! Need help finding a part or getting a quote? Message us and a sourcing specialist will respond right away.
            </div>
            <div className="field-shell flex items-center gap-2 p-1">
              <input className="min-w-0 flex-1 px-2 py-1.5 text-sm outline-none" placeholder="Type a message…" />
              <button className="bg-accent p-2 text-white" aria-label="Send"><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}
      <button
        ref={buttonRef}
        onClick={() => {
          if (!open) track('chat_open', {})
          setOpen((v) => !v)
        }}
        aria-label="Open chat"
        className={
          onDark
            ? 'flex h-14 w-14 items-center justify-center border border-hairline bg-white text-ink shadow-hover transition-colors hover:bg-surface'
            : 'flex h-14 w-14 items-center justify-center bg-accent text-white shadow-hover transition-colors hover:bg-accent-hover'
        }
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  )
}
