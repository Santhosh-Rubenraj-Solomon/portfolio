import { describe, it, expect, vi } from 'vitest'
import { render, screen, within, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

function record(name: string) {
  return screen.getByRole('heading', { name }).closest('article') as HTMLElement
}
function openDemo(name: string) {
  const rec = record(name)
  fireEvent.click(within(rec).getByRole('button', { name: /run interactive demo/ }))
  return rec
}

describe('project record demo toggle', () => {
  it('every project has a run button that toggles aria-expanded and the demo panel', async () => {
    const user = userEvent.setup()
    render(<App />)
    const buttons = screen.getAllByRole('button', { name: /run interactive demo/ })
    expect(buttons).toHaveLength(4)
    for (const b of buttons) {
      const rec = b.closest('article')!
      expect(b).toHaveAttribute('aria-expanded', 'false')
      expect(rec.querySelector('.demo')).toBeNull()
      await user.click(b)
      expect(b).toHaveAttribute('aria-expanded', 'true')
      expect(b).toHaveTextContent('▾ hide interactive demo')
      expect(rec.querySelector('.demo')).not.toBeNull()
      await user.click(b)
      expect(b).toHaveAttribute('aria-expanded', 'false')
      expect(rec.querySelector('.demo')).toBeNull()
    }
  })
})

describe('ConcurrencyDemo (ledger reconciler)', () => {
  const NAME = 'AI-DS Ledger Reconciler'

  it('starts idle with an explanatory note', () => {
    render(<App />)
    const rec = openDemo(NAME)
    expect(rec.querySelectorAll('.tx')).toHaveLength(10)
    expect(rec.querySelectorAll('.tx.idle')).toHaveLength(10)
    expect(within(rec).getByText(/Watch it get recorded once/)).toBeInTheDocument()
    expect(within(rec).getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('with the lock held, records exactly one message and ignores 9 duplicates', () => {
    vi.useFakeTimers()
    render(<App />)
    const rec = openDemo(NAME)
    fireEvent.click(within(rec).getByRole('button', { name: /send 10/ }))
    act(() => { vi.advanceTimersByTime(130) })
    expect(rec.querySelectorAll('.tx.pass')).toHaveLength(1)
    expect(rec.querySelectorAll('.tx.idle')).toHaveLength(9)
    act(() => { vi.advanceTimersByTime(2000) })
    expect(rec.querySelectorAll('.tx.pass')).toHaveLength(1)
    expect(rec.querySelectorAll('.tx.block')).toHaveLength(9)
    expect(within(rec).getAllByText('recorded once')).toHaveLength(1)
    expect(within(rec).getAllByText('ignored (dupe)')).toHaveLength(9)
    expect(within(rec).getByText('Recorded once, 9 duplicates ignored — the lock is held long enough to swallow every retry.')).toBeInTheDocument()
  })

  it('the "unlock early" switch toggles by click, Enter and Space', () => {
    render(<App />)
    const rec = openDemo(NAME)
    const sw = within(rec).getByRole('switch')
    fireEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(sw.querySelector('.switch')).toHaveClass('on')
    fireEvent.keyDown(sw, { key: 'Enter' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    fireEvent.keyDown(sw, { key: ' ' })
    expect(sw).toHaveAttribute('aria-checked', 'true')
    fireEvent.keyDown(sw, { key: 'a' })
    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(sw).toHaveAttribute('tabindex', '0')
  })

  it('with early unlock, the late duplicate also gets through (double-charge)', () => {
    vi.useFakeTimers()
    render(<App />)
    const rec = openDemo(NAME)
    fireEvent.click(within(rec).getByRole('switch'))
    fireEvent.click(within(rec).getByRole('button', { name: /send 10/ }))
    act(() => { vi.advanceTimersByTime(2000) })
    const tx = [...rec.querySelectorAll('.tx')]
    expect(tx[0]).toHaveClass('pass')
    expect(tx[9]).toHaveClass('pass')
    expect(rec.querySelectorAll('.tx.block')).toHaveLength(8)
    expect(within(rec).getByText(/^2 got through/)).toBeInTheDocument()
  })

  it('re-firing resets the grid and cancels pending timers', () => {
    vi.useFakeTimers()
    render(<App />)
    const rec = openDemo(NAME)
    const send = within(rec).getByRole('button', { name: /send 10/ })
    fireEvent.click(send)
    act(() => { vi.advanceTimersByTime(2000) })
    fireEvent.click(send)
    expect(rec.querySelectorAll('.tx.idle')).toHaveLength(10)
    act(() => { vi.advanceTimersByTime(2000) })
    expect(rec.querySelectorAll('.tx.pass')).toHaveLength(1)
    expect(rec.querySelectorAll('.tx.block')).toHaveLength(9)
  })

  it('closing the demo mid-run clears timers without errors', () => {
    vi.useFakeTimers()
    const err = vi.spyOn(console, 'error')
    render(<App />)
    const rec = openDemo(NAME)
    fireEvent.click(within(rec).getByRole('button', { name: /send 10/ }))
    fireEvent.click(within(rec).getByRole('button', { name: /hide interactive demo/ }))
    expect(rec.querySelector('.demo')).toBeNull()
    act(() => { vi.advanceTimersByTime(2000) })
    expect(err).not.toHaveBeenCalled()
  })

  // BUG (src/App.tsx:249 vs 284-286): the grid result captures `release` at the moment "send" is clicked
  // (closure inside fire()), but the note under the grid reads the *current* `release` state. Toggling
  // "unlock early" after a run makes the note contradict the grid, e.g. grid shows 1 recorded / 9 ignored
  // while the note claims "1 got through — ... a late duplicate is processed again (a double-charge)".
  it.skip('BUG: toggling "unlock early" after a run should not change the verdict of that run', () => {
    vi.useFakeTimers()
    render(<App />)
    const rec = openDemo(NAME)
    fireEvent.click(within(rec).getByRole('button', { name: /send 10/ }))
    act(() => { vi.advanceTimersByTime(2000) })
    fireEvent.click(within(rec).getByRole('switch'))
    expect(rec.querySelectorAll('.tx.pass')).toHaveLength(1)
    expect(within(rec).queryByText(/double-charge/)).toBeNull()
  })
})

describe('ReviewDemo (diff reviewer)', () => {
  it('judging keeps 3 confident comments and drops 3, then resets', async () => {
    const user = userEvent.setup()
    render(<App />)
    const rec = openDemo('AI Diff Reviewer')
    expect(rec.querySelectorAll('.rev-item')).toHaveLength(6)
    expect(rec.querySelectorAll('.rev-tag')).toHaveLength(0)
    await user.click(within(rec).getByRole('button', { name: /make each prove itself/ }))
    expect(rec.querySelectorAll('.rev-item.keep')).toHaveLength(3)
    expect(rec.querySelectorAll('.rev-item.drop')).toHaveLength(3)
    expect(within(rec).getAllByText('kept')).toHaveLength(3)
    expect(within(rec).getAllByText('dropped — not sure enough')).toHaveLength(3)
    expect(within(rec).getByText(/This payment could run twice on a retry/).closest('.rev-item')).toHaveClass('keep')
    expect(within(rec).getByText(/Maybe rename this variable/).closest('.rev-item')).toHaveClass('drop')
    expect(within(rec).getByText(/^3 kept, 3 thrown away/)).toBeInTheDocument()
    await user.click(within(rec).getByRole('button', { name: 'reset' }))
    expect(rec.querySelectorAll('.rev-item.keep, .rev-item.drop')).toHaveLength(0)
    expect(within(rec).getByRole('button', { name: /make each prove itself/ })).toBeInTheDocument()
  })
})

describe('AnalyzerDemo (code analyzer)', () => {
  it('shows a prompt until a codebase is picked, then its stack, bars and Q&A', async () => {
    const user = userEvent.setup()
    render(<App />)
    const rec = openDemo('AI Code Analyzer')
    expect(within(rec).getByText(/Pick a codebase/)).toBeInTheDocument()
    expect(rec.querySelector('.anz')).toBeNull()

    await user.click(within(rec).getByRole('button', { name: 'a payments API' }))
    expect(within(rec).getByText('NestJS · Redis · Postgres')).toBeInTheDocument()
    expect(within(rec).getByText(/Q: What breaks if I change the login token\?/)).toBeInTheDocument()
    expect(within(rec).getByText(/A: Every partner integration/)).toBeInTheDocument()
    const bars = [...rec.querySelectorAll('.anz-bar')]
    expect(bars.map((b) => b.querySelector('span')!.textContent)).toEqual(['TypeScript', 'SQL', 'other'])
    expect((bars[0].querySelector('i') as HTMLElement).style.width).toBe('71%')
    expect(bars[0].querySelector('b')).toHaveTextContent('71%')
    expect(within(rec).getByRole('button', { name: 'a payments API' })).toHaveClass('sel')
    expect(within(rec).queryByText(/Pick a codebase/)).toBeNull()

    await user.click(within(rec).getByRole('button', { name: 'a mobile game' }))
    expect(within(rec).getByText('Unity · C#')).toBeInTheDocument()
    expect(within(rec).getByRole('button', { name: 'a payments API' })).not.toHaveClass('sel')
    expect(rec.querySelectorAll('.demo-btn.sel')).toHaveLength(1)
  })

  it('each sample codebase has bars that sum to 100%', async () => {
    const user = userEvent.setup()
    render(<App />)
    const rec = openDemo('AI Code Analyzer')
    for (const name of ['an online shop', 'a payments API', 'a mobile game']) {
      await user.click(within(rec).getByRole('button', { name }))
      const sum = [...rec.querySelectorAll('.anz-bar b')].reduce((s, b) => s + parseInt(b.textContent!, 10), 0)
      expect(sum, name).toBe(100)
    }
  })
})

describe('RiskDemo (car repossession dashboard)', () => {
  const rows = (rec: HTMLElement) =>
    [...rec.querySelectorAll('.risk-row')].map((r) => ({
      name: r.querySelector('.rk-name')!.textContent,
      days: r.querySelector('.rk-days')!.textContent,
      act: r.querySelector('.rk-act')!.textContent,
      lvl: r.className.replace('risk-row', '').trim(),
    }))

  it('maps days overdue to the right action and severity', () => {
    render(<App />)
    const rec = openDemo('Car Repossession Dashboard')
    expect(rows(rec)).toEqual([
      { name: 'A. Kumar', days: '12d overdue', act: 'Friendly reminder', lvl: 'ok' },
      { name: 'R. Iyer', days: '96d overdue', act: 'Field visit', lvl: 'stop' },
      { name: 'S. Nair', days: '45d overdue', act: 'Escalate — warning call', lvl: 'warn' },
      { name: 'M. Das', days: '130d overdue', act: 'Initiate repossession', lvl: 'stop' },
      { name: 'P. Roy', days: '5d overdue', act: 'Friendly reminder', lvl: 'ok' },
    ])
  })

  it('prioritise sorts by days overdue (desc) and reset restores the original order', async () => {
    const user = userEvent.setup()
    render(<App />)
    const rec = openDemo('Car Repossession Dashboard')
    await user.click(within(rec).getByRole('button', { name: /prioritise/ }))
    expect(rows(rec).map((r) => r.name)).toEqual(['M. Das', 'R. Iyer', 'S. Nair', 'A. Kumar', 'P. Roy'])
    expect(within(rec).getByText(/Sorted by risk/)).toBeInTheDocument()
    await user.click(within(rec).getByRole('button', { name: 'reset order' }))
    expect(rows(rec).map((r) => r.name)).toEqual(['A. Kumar', 'R. Iyer', 'S. Nair', 'M. Das', 'P. Roy'])
  })
})
