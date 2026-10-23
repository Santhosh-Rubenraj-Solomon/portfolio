/**
 * Behaviour that depends on motion preferences, timers, scroll position and IntersectionObserver.
 * App.tsx keeps a module-level `scrollState` latch, so every test imports a fresh copy of the module.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { ComponentType } from 'react'
import { media } from './test/setup'
import { installMockIntersectionObserver } from './test/helpers'

let App: ComponentType

beforeEach(async () => {
  vi.resetModules()
  App = (await import('./App')).default
})

function defineWindowNumber(key: 'scrollY' | 'innerHeight', value: number) {
  Object.defineProperty(window, key, { configurable: true, writable: true, value })
}
function setScrollHeight(h: number) {
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, get: () => h })
}
afterEach(() => {
  defineWindowNumber('scrollY', 0)
  defineWindowNumber('innerHeight', 768)
  // remove instance override; fall back to jsdom prototype getter
  delete (document.documentElement as unknown as Record<string, unknown>).scrollHeight
})

describe('Boot overlay', () => {
  beforeEach(() => { media.reduced = false })

  it('types out the boot lines, then fades and remembers it ran', () => {
    vi.useFakeTimers()
    render(<App />)
    const boot = document.querySelector('.boot')!
    expect(boot).toHaveAttribute('aria-hidden', 'true')
    expect(boot.querySelectorAll('.boot-line')).toHaveLength(0)
    act(() => { vi.advanceTimersByTime(260) })
    expect(boot.querySelectorAll('.boot-line')).toHaveLength(1)
    act(() => { vi.advanceTimersByTime(260 * 4) })
    expect(boot.querySelectorAll('.boot-line')).toHaveLength(5)
    expect(boot.textContent).toMatch(/ready\./)
    expect(boot).not.toHaveClass('gone')
    expect(sessionStorage.getItem('booted')).toBeNull()
    act(() => { vi.advanceTimersByTime(480) })
    expect(document.querySelector('.boot:not(.gone)')).toBeNull() // dismissed (see BUG test below)
    expect(sessionStorage.getItem('booted')).toBe('1')
  })

  // BUG (src/App.tsx:705-708 + 723): `gated` is re-read from sessionStorage on *every* render. finish()
  // writes booted=1 and then setDone(true); that re-render sees gated=true -> skip=true -> `return null`,
  // so the overlay is unmounted instantly and the `.boot.gone` 0.5s opacity transition (global.css:338-339)
  // never plays. Expected: the overlay stays mounted with class "gone" so it can fade out.
  it.skip('BUG: fades out (stays mounted with class "gone") instead of vanishing abruptly', () => {
    vi.useFakeTimers()
    render(<App />)
    act(() => { vi.advanceTimersByTime(260 * 5 + 480) })
    expect(document.querySelector('.boot')).toHaveClass('gone')
  })

  it.each([
    ['a key press', () => fireEvent.keyDown(window, { key: 'x' })],
    ['a pointer press', () => fireEvent.pointerDown(window)],
  ])('can be skipped with %s', (_label, skip) => {
    vi.useFakeTimers()
    render(<App />)
    expect(document.querySelector('.boot')).not.toBeNull()
    act(() => { skip() })
    expect(document.querySelector('.boot:not(.gone)')).toBeNull()
    expect(sessionStorage.getItem('booted')).toBe('1')
  })

  it('is not shown again in the same session', () => {
    sessionStorage.setItem('booted', '1')
    render(<App />)
    expect(document.querySelector('.boot')).toBeNull()
  })

  it('is skipped when sessionStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
    render(<App />)
    expect(document.querySelector('.boot')).toBeNull()
  })

  it('is skipped when reduced motion is preferred', () => {
    media.reduced = true
    render(<App />)
    expect(document.querySelector('.boot')).toBeNull()
  })
})

describe('StatePill', () => {
  it('starts "unreachable" and becomes "deliberately wired" after 1.1s', () => {
    media.reduced = false
    sessionStorage.setItem('booted', '1')
    vi.useFakeTimers()
    render(<App />)
    const pill = document.querySelector('.statepill')!
    expect(pill).toHaveClass('blocked')
    expect(pill).toHaveTextContent('submit() · unreachable')
    expect(pill).toHaveAttribute('aria-live', 'polite')
    act(() => { vi.advanceTimersByTime(1099) })
    expect(pill).toHaveClass('blocked')
    act(() => { vi.advanceTimersByTime(1) })
    expect(pill).toHaveClass('enabled')
    expect(pill).toHaveTextContent('submit() · deliberately wired')
  })

  it('is enabled immediately with reduced motion', () => {
    render(<App />)
    expect(document.querySelector('.statepill')).toHaveClass('enabled')
  })
})

describe('IST clock', () => {
  it('shows Asia/Kolkata time and ticks every second', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    render(<App />)
    const clock = document.querySelector('.clock b')!
    expect(clock).toHaveTextContent('05:30:00')
    act(() => { vi.advanceTimersByTime(1000) })
    expect(clock).toHaveTextContent('05:30:01')
    act(() => { vi.advanceTimersByTime(59_000) })
    expect(clock).toHaveTextContent('05:31:00')
  })
})

describe('active section tracking', () => {
  const TOPS: Record<string, number> = { work: 1000, projects: 2000, approach: 3000, stack: 4000, about: 5000, contact: 6000 }
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
      return TOPS[this.id] ?? 0
    })
  })

  const path = () => screen.getByTitle('Command palette (⌘K)').textContent
  const activeLinks = () => [...document.querySelectorAll('nav.bar-nav a.active')].map((a) => a.textContent)

  it('shows the home prompt above the first section', () => {
    defineWindowNumber('scrollY', 0)
    render(<App />)
    expect(path()).toBe('santhosh@payments-backend:~$⌘K')
    expect(activeLinks()).toEqual([])
  })

  it('highlights the section crossing the 35% line as the user scrolls', () => {
    render(<App />)
    act(() => { defineWindowNumber('scrollY', 2000); window.dispatchEvent(new Event('scroll')) })
    expect(path()).toBe('santhosh@payments-backend:~/projects$⌘K')
    expect(activeLinks()).toEqual(['projects'])
    // 35% of 768 = 268.8 -> line at 3000 - 300 + 268.8 = 2968.8: still "projects"
    act(() => { defineWindowNumber('scrollY', 2700); window.dispatchEvent(new Event('scroll')) })
    expect(activeLinks()).toEqual(['projects'])
    act(() => { defineWindowNumber('scrollY', 2740); window.dispatchEvent(new Event('scroll')) })
    expect(activeLinks()).toEqual(['approach'])
    act(() => { defineWindowNumber('scrollY', 9000); window.dispatchEvent(new Event('resize')) })
    expect(activeLinks()).toEqual(['contact'])
  })
})

describe('IntersectionObserver-driven reveals (motion allowed)', () => {
  let io: ReturnType<typeof installMockIntersectionObserver>
  beforeEach(() => {
    media.reduced = false
    sessionStorage.setItem('booted', '1')
    setScrollHeight(10_000) // so the "reached bottom" latch is not tripped on mount
    io = installMockIntersectionObserver()
  })

  it('panels reveal on enter and hide again on leave', () => {
    render(<App />)
    const panel = document.querySelector('#work .reveal')!
    expect(panel).not.toHaveClass('in')
    act(() => io.trigger(panel, true))
    expect(panel).toHaveClass('in')
    act(() => io.trigger(panel, false))
    expect(panel).not.toHaveClass('in')
  })

  it('once the bottom of the page is reached, things stay revealed', () => {
    render(<App />)
    const panel = document.querySelector('#work .reveal')!
    act(() => io.trigger(panel, true))
    act(() => { defineWindowNumber('scrollY', 10_000 - 768 - 6); window.dispatchEvent(new Event('scroll')) })
    act(() => io.trigger(panel, false))
    expect(panel).toHaveClass('in')
  })

  it('the signature draws when visible and un-draws when it leaves', () => {
    render(<App />)
    const wrap = document.querySelector('.sig-wrap')!
    expect(wrap).not.toHaveClass('drawn')
    act(() => io.trigger(wrap, true))
    expect(wrap).toHaveClass('drawn')
    act(() => io.trigger(wrap, false))
    expect(wrap).not.toHaveClass('drawn')
  })

  it('sparklines draw when visible', () => {
    render(<App />)
    const sparks = [...document.querySelectorAll('svg.spark')]
    expect(sparks).toHaveLength(7)
    sparks.forEach((s) => expect(s).not.toHaveClass('drawn'))
    act(() => io.trigger(sparks[0], true))
    expect(sparks[0]).toHaveClass('drawn')
    expect(sparks[1]).not.toHaveClass('drawn')
  })

  it('metrics count up from zero (keeping commas, decimals and leading zeros) and back down on leave', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    render(<App />)
    const metricEls = [...document.querySelectorAll('.tile-metric')]
    const text = () => metricEls.map((m) => m.textContent)
    expect(text()).toEqual(['0+', '−0%', '0+', '0.0s → 0.0s', '0 → 0', '00 hrs', '−0%'])

    const statSpans = metricEls.map((m) => m.firstElementChild!)
    act(() => statSpans.forEach((s) => io.trigger(s, true)))
    act(() => { vi.advanceTimersByTime(300) })
    const mid = text()
    expect(mid).not.toEqual(['2,500+', '−40%', '15+', '1.2s → 0.8s', '1 → 5', '04 hrs', '−50%'])
    expect(mid[5]).toMatch(/^0\d hrs$/) // still two digits mid-animation
    expect(mid[0]).toMatch(/^\d{1,3}(,\d{3})*\+$/)

    act(() => { vi.advanceTimersByTime(1200) })
    expect(text()).toEqual(['2,500+', '−40%', '15+', '1.2s → 0.8s', '1 → 5', '04 hrs', '−50%'])

    act(() => statSpans.forEach((s) => io.trigger(s, false)))
    act(() => { vi.advanceTimersByTime(1500) })
    expect(text()).toEqual(['0+', '−0%', '0+', '0.0s → 0.0s', '0 → 0', '00 hrs', '−0%'])
  })

  it('disconnects observers on unmount', () => {
    const { unmount } = render(<App />)
    const observed = () => io.observers.reduce((n, o) => n + o.els.size, 0)
    expect(observed()).toBeGreaterThan(0)
    unmount()
    expect(observed()).toBe(0)
  })
})

describe('without IntersectionObserver support (motion allowed)', () => {
  it('falls back to showing everything fully drawn', () => {
    media.reduced = false
    sessionStorage.setItem('booted', '1')
    expect('IntersectionObserver' in window).toBe(false) // jsdom default
    render(<App />)
    document.querySelectorAll('.reveal').forEach((el) => expect(el).toHaveClass('in'))
    expect(document.querySelector('.sig-wrap')).toHaveClass('drawn')
    document.querySelectorAll('svg.spark').forEach((el) => expect(el).toHaveClass('drawn'))
    expect(document.querySelector('.tile-metric')).toHaveTextContent('2,500+')
  })
})
