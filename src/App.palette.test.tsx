import { describe, it, expect, vi } from 'vitest'
import { render, screen, within, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const PROFILE = 'https://github.com/Santhosh-Rubenraj-Solomon'
const LINKEDIN = 'https://www.linkedin.com/in/santhosh-ruben-raj-solomon'
const ALL_CMDS = ['help', 'work', 'projects', 'approach', 'stack', 'about', 'contact', 'cv', 'github', 'linkedin', 'whoami', 'reboot', 'clear']

const dialog = () => screen.getByRole('dialog', { name: 'Command palette' })
const input = () => screen.getByRole('textbox', { name: 'command' })
const suggestionNames = () => [...dialog().querySelectorAll('.pl-sug-item b')].map((b) => b.textContent)
const logText = () => dialog().querySelector('.pl-log')?.textContent ?? ''

async function openPalette() {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByTitle('Command palette (⌘K)'))
  return user
}

describe('opening and closing', () => {
  it('is closed initially and opens from the status-bar button', async () => {
    render(<App />)
    expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.setup().click(screen.getByTitle('Command palette (⌘K)'))
    expect(dialog()).toBeInTheDocument()
  })

  it('⌘K and Ctrl+K toggle it; plain K does not', () => {
    render(<App />)
    fireEvent.keyDown(window, { key: 'k' })
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(dialog()).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'K', ctrlKey: true })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('focuses the input shortly after opening', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    act(() => { vi.advanceTimersByTime(50) })
    expect(input()).toHaveFocus()
  })

  it('Escape closes it', async () => {
    const user = await openPalette()
    await user.type(input(), '{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('clicking the overlay closes it, clicking inside does not', async () => {
    const user = await openPalette()
    await user.click(dialog())
    expect(dialog()).toBeInTheDocument()
    await user.click(document.querySelector('.pl-overlay')!)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('locks body scroll while open and restores it on close', async () => {
    const user = await openPalette()
    expect(document.body.style.overflow).toBe('hidden')
    await user.type(input(), '{Escape}')
    expect(document.body.style.overflow).toBe('')
  })
})

describe('suggestions', () => {
  it('lists every command when empty, with the first one highlighted', async () => {
    await openPalette()
    expect(suggestionNames()).toEqual(ALL_CMDS)
    expect(dialog().querySelector('.pl-sug-item.on b')).toHaveTextContent('help')
  })

  it('filters by prefix, case-insensitively and ignoring whitespace', async () => {
    const user = await openPalette()
    await user.type(input(), '  LI')
    expect(suggestionNames()).toEqual(['linkedin'])
    await user.clear(input())
    await user.type(input(), 'w')
    expect(suggestionNames()).toEqual(['work', 'whoami'])
    await user.clear(input())
    await user.type(input(), 'zzz')
    expect(suggestionNames()).toEqual([])
  })

  it('ArrowDown/ArrowUp move the highlight and clamp at the ends', async () => {
    const user = await openPalette()
    await user.type(input(), 'c')
    expect(suggestionNames()).toEqual(['contact', 'cv', 'clear'])
    const on = () => dialog().querySelector('.pl-sug-item.on b')!.textContent
    await user.keyboard('{ArrowUp}')
    expect(on()).toBe('contact')
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')
    expect(on()).toBe('clear')
    await user.keyboard('{ArrowUp}')
    expect(on()).toBe('cv')
  })

  it('hovering a suggestion highlights it', async () => {
    const user = await openPalette()
    const items = dialog().querySelectorAll('.pl-sug-item')
    await user.hover(items[3])
    expect(items[3]).toHaveClass('on')
    expect(items[0]).not.toHaveClass('on')
  })

  it('Tab completes the highlighted suggestion', async () => {
    const user = await openPalette()
    await user.type(input(), 'wh')
    await user.keyboard('{Tab}')
    expect(input()).toHaveValue('whoami')
    expect(dialog()).toBeInTheDocument()
  })

  it('typing resets the highlight to the first match', async () => {
    const user = await openPalette()
    await user.keyboard('{ArrowDown}{ArrowDown}')
    await user.type(input(), 'p')
    expect(dialog().querySelector('.pl-sug-item.on b')).toHaveTextContent('projects')
  })
})

describe('commands', () => {
  it('help prints all commands except itself', async () => {
    const user = await openPalette()
    await user.type(input(), 'help{Enter}')
    const help = dialog().querySelector('.pl-help')!
    const names = [...help.querySelectorAll('b')].map((b) => b.textContent)
    expect(names).toEqual(ALL_CMDS.filter((c) => c !== 'help'))
    expect(input()).toHaveValue('')
    expect(dialog().querySelector('.pl-cmd')).toHaveTextContent('› help')
  })

  it('Enter runs the highlighted prefix match', async () => {
    const user = await openPalette()
    await user.type(input(), 'who{Enter}')
    expect(logText()).toMatch(/Santhosh Rubenraj Solomon — product-minded backend engineer/)
  })

  it('Enter after ArrowDown runs the selected suggestion', async () => {
    const user = await openPalette()
    await user.type(input(), 'w')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(logText()).toMatch(/whoami/)
    expect(dialog()).toBeInTheDocument()
  })

  it('unknown commands print "command not found"', async () => {
    const user = await openPalette()
    await user.type(input(), 'rm -rf{Enter}')
    expect(within(dialog()).getByText('command not found: rm -rf')).toHaveClass('pl-err')
  })

  it('whitespace-only input falls through to the highlighted suggestion (help)', async () => {
    const user = await openPalette()
    await user.type(input(), '   ')
    // suggestions are the full list when the trimmed query is empty, so Enter runs the highlighted one (help)
    await user.keyboard('{Enter}')
    expect(dialog().querySelector('.pl-help')).not.toBeNull()
  })

  it('clear empties the log', async () => {
    const user = await openPalette()
    await user.type(input(), 'whoami{Enter}')
    expect(dialog().querySelector('.pl-log')).not.toBeNull()
    await user.type(input(), 'clear{Enter}')
    expect(dialog().querySelector('.pl-log')).toBeNull()
  })

  it('clicking a suggestion runs it', async () => {
    const user = await openPalette()
    await user.click(within(dialog()).getByRole('button', { name: /whoami/ }))
    expect(logText()).toMatch(/Chennai/)
  })

  it.each(['work', 'projects', 'approach', 'stack', 'about', 'contact'])('"%s" closes the palette and scrolls to the section', async (id) => {
    const spy = vi.spyOn(Element.prototype, 'scrollIntoView')
    const user = await openPalette()
    await user.type(input(), `${id}{Enter}`)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.contexts[0]).toBe(document.getElementById(id))
    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it.each(['cv', 'resume'])('"%s" downloads /resume.pdf with the CV filename', async (cmd) => {
    let clicked: HTMLAnchorElement | null = null
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { clicked = this })
    const user = await openPalette()
    const before = document.querySelectorAll('a').length
    await user.type(input(), `${cmd}{Enter}`)
    expect(clicked).not.toBeNull()
    expect(clicked!.getAttribute('href')).toBe('/resume.pdf')
    expect(clicked!.download).toBe('Santhosh-Rubenraj-Solomon-CV.pdf')
    expect(document.querySelectorAll('a').length).toBe(before) // temp anchor removed
    expect(logText()).toMatch(/downloading Santhosh-Rubenraj-Solomon-CV\.pdf/)
  })

  it('github opens the profile in a new tab with noopener', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const user = await openPalette()
    await user.type(input(), 'github{Enter}')
    expect(open).toHaveBeenCalledWith(PROFILE, '_blank', 'noopener')
    expect(logText()).toMatch(/opening github/)
  })

  it('linkedin opens LinkedIn in a new tab with noopener', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const user = await openPalette()
    await user.type(input(), 'linkedin{Enter}')
    expect(open).toHaveBeenCalledWith(LINKEDIN, '_blank', 'noopener')
  })

  it('reboot clears the boot flag (and asks the page to reload)', async () => {
    // jsdom does not implement navigation; it reports "Not implemented" through console.error/virtual console.
    vi.spyOn(console, 'error').mockImplementation(() => {})
    sessionStorage.setItem('booted', '1')
    const user = await openPalette()
    await user.type(input(), 'reboot{Enter}')
    expect(sessionStorage.getItem('booted')).toBeNull()
  })
})
