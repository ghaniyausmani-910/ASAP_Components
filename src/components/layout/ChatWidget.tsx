'use client'

import { useState } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'

export function ChatWidget() {
  const [open, setOpen] = useState(false)

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
            <div className="flex items-center gap-2 border border-inputline p-1">
              <input className="min-w-0 flex-1 px-2 py-1.5 text-sm outline-none" placeholder="Type a message…" />
              <button className="bg-accent p-2 text-white" aria-label="Send"><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        className="flex h-14 w-14 items-center justify-center bg-accent text-white shadow-hover transition-colors hover:bg-accent-hover"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  )
}
