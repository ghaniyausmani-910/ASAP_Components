import '@testing-library/jest-dom/vitest'
import { vi, afterEach } from 'vitest'

// jsdom doesn't implement matchMedia; framer-motion's useReducedMotion reads it.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// jsdom lacks scrollIntoView; CommandPalette calls it to keep the active row visible.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}

// jsdom in this Node/Vitest combo doesn't wire up window.localStorage; the cart
// persists there. Provide a minimal in-memory implementation.
if (!('localStorage' in window) || window.localStorage == null) {
  const store = new Map<string, string>()
  const localStorageMock: Storage = {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => void store.set(k, String(v)),
    removeItem: (k) => void store.delete(k),
    key: (i) => Array.from(store.keys())[i] ?? null,
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })
}

// Prevent cart state from bleeding between tests via the shared localStorage.
afterEach(() => {
  window.localStorage.clear()
})
