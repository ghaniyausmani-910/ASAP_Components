'use client'

import { useEffect, useState } from 'react'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('asap-cookie-consent')) setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  function decide(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem('asap-cookie-consent', value)
    } catch {}
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-hairline bg-white/95 backdrop-blur">
      <div className="container-x flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 text-sm text-secondary">
          We use cookies to ensure you get the best experience on our website. You can accept all cookies or decline non-essential ones.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => decide('declined')} className="btn btn-outline !py-2.5 text-xs">Decline non-essential</button>
          <button onClick={() => decide('accepted')} className="btn btn-primary !py-2.5 text-xs">Accept cookies</button>
        </div>
      </div>
    </div>
  )
}
