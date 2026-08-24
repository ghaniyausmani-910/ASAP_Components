'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { X } from 'lucide-react'

/**
 * Minimal, dependency-free toast with an optional action (e.g. Undo).
 *
 * The app had no notification system; this is the smallest thing that satisfies
 * the "success toast with Undo" contract. Mounted once at the root (layout.tsx)
 * so a toast survives the route change that follows a bulk add-to-RFQ.
 */
export interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastItem {
  id: number
  message: string
  action?: ToastAction
}

interface ToastContextValue {
  showToast: (toast: { message: string; action?: ToastAction; duration?: number }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current[id]
    if (timer) {
      clearTimeout(timer)
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback<ToastContextValue['showToast']>(
    ({ message, action, duration = 6000 }) => {
      const id = (idRef.current += 1)
      setToasts((prev) => [...prev, { id, message, action }])
      timers.current[id] = setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-md items-center gap-4 border border-white/10 bg-ink px-4 py-3 text-sm text-white shadow-hover"
          >
            <span className="min-w-0 flex-1">{t.message}</span>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick()
                  dismiss(t.id)
                }}
                className="shrink-0 font-semibold uppercase tracking-[0.06em] text-white underline underline-offset-2 hover:text-white/80"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-white/60 transition-colors hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
