import { vi } from 'vitest'

/** A controllable IntersectionObserver stand-in. `trigger(el, isIntersecting)` fires the callback. */
export function installMockIntersectionObserver() {
  const observers: MockIO[] = []
  class MockIO {
    cb: IntersectionObserverCallback
    els = new Set<Element>()
    constructor(cb: IntersectionObserverCallback) { this.cb = cb; observers.push(this) }
    observe(el: Element) { this.els.add(el) }
    unobserve(el: Element) { this.els.delete(el) }
    disconnect() { this.els.clear() }
    takeRecords() { return [] }
  }
  vi.stubGlobal('IntersectionObserver', MockIO)
  const trigger = (el: Element, isIntersecting: boolean) => {
    for (const o of observers) {
      if (o.els.has(el)) o.cb([{ target: el, isIntersecting } as unknown as IntersectionObserverEntry], o as unknown as IntersectionObserver)
    }
  }
  const triggerAll = (isIntersecting: boolean) => {
    for (const o of observers) {
      o.cb([...o.els].map((target) => ({ target, isIntersecting }) as unknown as IntersectionObserverEntry), o as unknown as IntersectionObserver)
    }
  }
  return { observers, trigger, triggerAll }
}
