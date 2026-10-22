import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

/** Controls what window.matchMedia('(prefers-reduced-motion: reduce)') reports. Default: reduced motion ON
 *  so the boot overlay / timers are skipped unless a test opts out. */
export const media = { reduced: true }

function installMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? media.reduced : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
installMatchMedia()

// jsdom does not implement scrollIntoView
Element.prototype.scrollIntoView = function () {}

afterEach(() => {
  cleanup()
  media.reduced = true
  installMatchMedia()
  try { sessionStorage.clear() } catch { /* */ }
  document.body.style.overflow = ''
  vi.useRealTimers()
})
