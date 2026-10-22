import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import App from './App'
import { SIG_D, SIG_DOT_D, SIG_VIEWBOX } from './signature'

const PROFILE = 'https://github.com/Santhosh-Rubenraj-Solomon'
const LINKEDIN = 'https://www.linkedin.com/in/santhosh-ruben-raj-solomon'
const EMAIL = 'santhoshrubenc@gmail.com'
const NAV = ['work', 'projects', 'approach', 'stack', 'about', 'contact']

const section = (id: string) => document.getElementById(id) as HTMLElement

describe('App rendering', () => {
  it('renders the hero heading and kicker', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Everything real was once imagined/)
    expect(screen.getByText(/Santhosh Rubenraj Solomon/, { selector: '.hero-kicker' })).toBeInTheDocument()
  })

  it('renders every nav section with an id and a matching nav link', () => {
    render(<App />)
    const nav = document.querySelector('nav.bar-nav') as HTMLElement
    for (const id of NAV) {
      expect(section(id)).toBeInTheDocument()
      expect(within(nav).getByRole('link', { name: id })).toHaveAttribute('href', `#${id}`)
    }
  })

  it('renders section titles', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Things I built that hold weight.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Agents and systems I built/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'A product person who ships the backend.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What I reach for.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Engineering payments from Chennai/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Let’s talk/ })).toBeInTheDocument()
  })

  it('renders 7 work tiles, each with a sparkline, and metrics that land on their written value', () => {
    render(<App />)
    const tiles = section('work').querySelectorAll('.tile')
    expect(tiles).toHaveLength(7)
    tiles.forEach((t) => expect(t.querySelector('svg.spark')).not.toBeNull())
    const metrics = [...section('work').querySelectorAll('.tile-metric')].map((m) => m.textContent)
    expect(metrics).toEqual(['2,500+', '−40%', '15+', '1.2s → 0.8s', '1 → 5', '04 hrs', '−50%'])
  })

  it('renders sparkline paths as valid moveto/lineto data', () => {
    render(<App />)
    section('work').querySelectorAll('svg.spark').forEach((svg) => {
      expect(svg).toHaveAttribute('viewBox', '0 0 60 20')
      const line = svg.querySelector('.spark-line')!.getAttribute('d')!
      expect(line).toMatch(/^M\d+(\.\d)?,\d+(\.\d)?( L\d+(\.\d)?,\d+(\.\d)?){5}$/)
      expect(svg.querySelector('.spark-area')!.getAttribute('d')).toMatch(/ Z$/)
    })
  })

  it('renders 4 project records with sequential ids and a count tag', () => {
    render(<App />)
    const recs = section('projects').querySelectorAll('article.record')
    expect(recs).toHaveLength(4)
    expect([...recs].map((r) => r.querySelector('.rec-id')!.textContent)).toEqual(['PRJ-01', 'PRJ-02', 'PRJ-03', 'PRJ-04'])
    expect(within(section('projects')).getByText('4 records')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI-DS Ledger Reconciler' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Diff Reviewer' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Code Analyzer' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Car Repossession Dashboard' })).toBeInTheDocument()
  })

  it('marks only the live project status as live', () => {
    render(<App />)
    const live = section('projects').querySelectorAll('.rec-status.live')
    expect(live).toHaveLength(1)
    expect(live[0]).toHaveTextContent('runs end-to-end')
  })

  it('renders the approach list, skills and facts', () => {
    render(<App />)
    expect(section('approach').querySelectorAll('article.appr')).toHaveLength(4)
    expect(section('stack').querySelectorAll('.skillrow')).toHaveLength(7)
    expect(within(section('stack')).getByText('NestJS')).toBeInTheDocument()
    expect(section('about').querySelectorAll('.factlist > div')).toHaveLength(5)
    expect(within(section('about')).getByText('Chennai, India')).toBeInTheDocument()
  })

  it('renders the signature SVG with the exported path data', () => {
    render(<App />)
    const svg = screen.getByRole('img', { name: 'Rubenraj, signed' })
    expect(svg).toHaveAttribute('viewBox', SIG_VIEWBOX)
    expect(svg.querySelector('.sig-draw')).toHaveAttribute('d', SIG_D)
    expect(svg.querySelector('.sig-draw')).toHaveAttribute('pathLength', '1')
    expect(svg.querySelector('.sig-fill')).toHaveAttribute('d', SIG_D)
    expect(svg.querySelector('.sig-dot')).toHaveAttribute('d', SIG_DOT_D)
  })

  it('renders the status bar and footer', () => {
    render(<App />)
    expect(screen.getByText('open to work')).toBeInTheDocument()
    expect(screen.getByText(/© 2026 santhosh rubenraj solomon/)).toBeInTheDocument()
  })

  it('has no command palette or boot overlay by default (reduced motion)', () => {
    render(<App />)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.querySelector('.boot')).toBeNull()
  })

  it('reveals all .reveal panels immediately when reduced motion is preferred', () => {
    render(<App />)
    const reveals = document.querySelectorAll('.reveal')
    expect(reveals.length).toBe(6)
    reveals.forEach((el) => expect(el).toHaveClass('in'))
  })
})

describe('links', () => {
  it('the résumé links point at /resume.pdf with a download filename, and the file exists', () => {
    render(<App />)
    const cvLinks = [...document.querySelectorAll('a[href="/resume.pdf"]')]
    expect(cvLinks).toHaveLength(2)
    cvLinks.forEach((a) => expect(a).toHaveAttribute('download', 'Santhosh-Rubenraj-Solomon-CV.pdf'))
    expect(screen.getByRole('link', { name: /download cv/ })).toHaveAttribute('href', '/resume.pdf')
    expect(existsSync(resolve(__dirname, '../public/resume.pdf'))).toBe(true)
  })

  it('every target=_blank link is external and has rel=noopener', () => {
    render(<App />)
    const blank = [...document.querySelectorAll('a[target="_blank"]')]
    expect(blank.length).toBeGreaterThan(0)
    blank.forEach((a) => {
      expect(a.getAttribute('href')).toMatch(/^https:\/\//)
      expect(a.getAttribute('rel') ?? '').toMatch(/\bnoopener\b/)
    })
  })

  it('every external http(s) link opens in a new tab', () => {
    render(<App />)
    document.querySelectorAll('a[href^="http"]').forEach((a) => expect(a).toHaveAttribute('target', '_blank'))
  })

  it('every in-page hash link resolves to an element', () => {
    render(<App />)
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute('href')!.slice(1)
      expect(document.getElementById(id), `#${id}`).not.toBeNull()
    })
  })

  it('hero CTAs point at #work, the CV and GitHub', () => {
    render(<App />)
    const cta = within(document.querySelector('.hero-cta') as HTMLElement)
    expect(cta.getAllByRole('link')).toHaveLength(3)
    expect(cta.getByRole('link', { name: /see the work/ })).toHaveAttribute('href', '#work')
    expect(cta.getByRole('link', { name: /download cv/ })).toHaveAttribute('download', 'Santhosh-Rubenraj-Solomon-CV.pdf')
    const gh = cta.getByRole('link', { name: /^github/ })
    expect(gh).toHaveAttribute('href', PROFILE)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#top')
  })

  it('contact links: mailto, LinkedIn, GitHub, résumé', () => {
    render(<App />)
    const c = within(section('contact'))
    expect(c.getByRole('link', { name: new RegExp(EMAIL) })).toHaveAttribute('href', `mailto:${EMAIL}`)
    expect(c.getByRole('link', { name: /linkedin/ })).toHaveAttribute('href', LINKEDIN)
    expect(c.getByRole('link', { name: /github/ })).toHaveAttribute('href', PROFILE)
    expect(c.getByRole('link', { name: /résumé/ })).toHaveAttribute('href', '/resume.pdf')
  })

  it('each project has a GitHub source link', () => {
    render(<App />)
    const srcs = within(section('projects')).getAllByRole('link', { name: /source/ })
    expect(srcs).toHaveLength(4)
    srcs.forEach((a) => expect(a.getAttribute('href')).toMatch(/^https:\/\/github\.com\/Santhosh-Rubenraj-Solomon/))
    expect(srcs[1]).toHaveAttribute('href', 'https://github.com/Santhosh-Rubenraj-Solomon/ai-diff-reviewer')
    expect(srcs[0].getAttribute('href')).toMatch(/AI_agents\/tree\/main\/.*\/ai-ds-ledger-reconciler$/)
  })

  it('the ledger project links to the fix commit', () => {
    render(<App />)
    const fix = screen.getByRole('link', { name: /the commit that closed it/ })
    expect(fix.getAttribute('href')).toMatch(/^https:\/\/github\.com\/Santhosh-Rubenraj-Solomon\/AI_agents\/commit\/[0-9a-f]{40}$/)
  })
})
