import { useState, useEffect, useRef, useMemo, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { SIG_D, SIG_DOT_D, SIG_VIEWBOX } from './signature'

/* ------------------------------------------------------------------ links */
const PROFILE = 'https://github.com/Santhosh-Rubenraj-Solomon'
const LINKEDIN = 'https://www.linkedin.com/in/santhosh-ruben-raj-solomon'
const EMAIL = 'santhoshrubenc@gmail.com'
const REPO = 'https://github.com/Santhosh-Rubenraj-Solomon/AI_agents/tree/main/Documents/santhosh_%28%29'

/* ------------------------------------------------------------------ icons */
const I = {
  arrow: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  down: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  github: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

/* ------------------------------------------------------------------ data */
type Work = { metric: string; unit: string; title: string; desc: string; tag: string }
const SURFBOARD: Work[] = [
  { metric: '2,500+', unit: 'POS terminals', title: 'Device management, from scratch', desc: 'Provisions and manages POS terminals across 3 markets — data model, APIs, hardware provisioning, RBAC. Provisioning: 45 min → under 5.', tag: 'APIs · fleet · RBAC' },
  { metric: '−40%', unit: 'incidents', title: 'Payment methods, V2', desc: 'Ground-up NestJS rewrite of the core payment-methods service — the path every transaction routes through.', tag: 'NestJS · core service' },
  { metric: '15+', unit: 'partner integrations', title: 'Developer & partner APIs', desc: 'Service-account APIs + Developer Portal for external integrators — JWT across isolated envs, versioned contracts. Zero cross-env security incidents.', tag: 'JWT · API contracts' },
  { metric: '1.2s → 0.8s', unit: 'p95 latency', title: '~87 services, made to talk less', desc: 'Consolidated shared logic across the estate; async messaging + caching cut redundant calls and peak-load latency.', tag: 'event-driven · caching' },
  { metric: '1 → 5', unit: 'return markets', title: 'Carrier migration, Fraktjakt → nShift', desc: 'Owned the returns platform’s move to nShift behind a provider-agnostic abstraction — both carriers live, swapped by env flag, so a rollback is config, not a redeploy. Country-aware routing opened returns from Sweden alone to five countries.', tag: 'carriers · returns' },
  { metric: '04 hrs', unit: 'per week', title: 'Logistics & shipping automation', desc: 'Async webhooks for real-time delivery tracking — status lag: hours → under a minute. Return approval now books the shipment, pulls the carrier label inline and emails it to the merchant.', tag: 'webhooks · logistics' },
  { metric: '−50%', unit: 'time-to-ack', title: 'Incident ticketing + ops agents', desc: 'Replaced ad-hoc Slack alerts with a raise → monitor → resolve flow + ops agents. ~15 hrs/week back to the team.', tag: 'AI agents · ops' },
]

type Demo = 'concurrency' | 'review' | 'analyzer' | 'risk' | null
type Project = {
  name: string; one: string; whyLabel: string; why: string
  stack: string[]; href: string; run: string; runKind: 'live' | 'demo'; demo: Demo
  fix?: { label: string; text: string; href: string; hrefLabel: string }
}
const PROJECTS: Project[] = [
  {
    name: 'AI-DS Ledger Reconciler',
    one: 'When you tap your card, the “payment succeeded” message can arrive several times (networks retry). This makes sure the purchase is recorded exactly once — never double-counted — even across many servers. An AI then checks our records against the bank and fixes any that drifted.',
    whyLabel: 'The clever bit',
    why: 'The safety “lock” that prevents double-processing is deliberately held for 10 seconds after a success — so any duplicate “paid!” in that window is quietly ignored, not charged again. Simple, and easy to reverse if you ever want the opposite.',
    stack: ['NestJS', 'Redis', 'Nginx LB', 'Vercel AI SDK', 'Docker'],
    href: `${REPO}/ai-ds-ledger-reconciler`, run: 'builds clean · lock verified on Redis', runKind: 'demo', demo: 'concurrency',
    fix: {
      label: 'What I got wrong → fixed',
      text: 'At first the safety check ran on each server’s private copy of the records, so servers could disagree. I flagged it, then fixed it — one shared database everyone reads, and the safety check became a reusable building block.',
      href: 'https://github.com/Santhosh-Rubenraj-Solomon/AI_agents/commit/d2dbd6d4d44d0525ffc172bad215740d5b278dbb',
      hrefLabel: 'the commit that closed it',
    },
  },
  {
    name: 'AI Diff Reviewer',
    one: 'A second pair of eyes on your code before it goes live. It looks at exactly what you changed — and the history of those lines — and points out likely bugs.',
    whyLabel: 'The clever bit',
    why: 'Most auto-reviewers spam you with wrong guesses. This one makes every comment “defend itself” first — anything unsure is thrown away — so it only speaks up when it’s fairly sure. Saying nothing is a perfectly good answer.',
    stack: ['Bun', 'TypeScript', 'Gemini', 'git blame', 'zero deps'],
    href: 'https://github.com/Santhosh-Rubenraj-Solomon/ai-diff-reviewer', run: 'caught a planted regression · 38 tests', runKind: 'demo', demo: 'review',
  },
  {
    name: 'AI Code Analyzer',
    one: 'Paste a link to any codebase into a chat and ask questions in plain English — what it’s built with, what a change might break, how to fix a bug.',
    whyLabel: 'The clever bit',
    why: 'It works out what a project is built with instantly and for free — then only spends the expensive AI on the genuinely hard questions.',
    stack: ['TypeScript', 'Telegraf', 'Claude / GPT-4o', 'SQLite'],
    href: `${REPO}/AI-agent-code`, run: 'stack-detection demo verified', runKind: 'demo', demo: 'analyzer',
  },
  {
    name: 'Car Repossession Dashboard',
    one: 'Helps a car-loan lender see which overdue borrowers to act on first — turning a messy spreadsheet into a clear “who to call today” list.',
    whyLabel: 'The clever bit',
    why: 'It doesn’t just show a number. It ranks each account by risk and names the exact next step — a friendly reminder, a warning, a field visit, or repossession.',
    stack: ['Node', 'Express', 'SQLite', 'Dashboard'],
    href: PROFILE, run: 'runs end-to-end · synthetic data', runKind: 'live', demo: 'risk',
  },
]

const APPROACH = [
  { n: '01', title: 'I write the PRD, not just the ticket', desc: 'Two years shaping product at Surfboard — PRDs, user flows, API design from the user’s side. CAPM-certified.' },
  { n: '02', title: 'I optimize for the decision', desc: 'The car-loan dashboard doesn’t report a rate — it tells a collector who to call first. Surface decisions, not rows.' },
  { n: '03', title: 'Safety is a feature, not a flag', desc: 'The dangerous action is made unreachable first, then deliberately wired. A toggle you can flip is not a safety mechanism.' },
  { n: '04', title: 'I state the seam', desc: 'Every system ships with the one thing it gets wrong said out loud — the line between a demo and a decision.' },
]

const SKILLS = [
  { cat: 'Languages', vals: ['TypeScript', 'JavaScript', 'Python'] },
  { cat: 'Backend', vals: ['Node.js', 'NestJS', 'Fastify', 'REST', 'gRPC', 'Webhooks'] },
  { cat: 'Data', vals: ['PostgreSQL', 'Prisma', 'Redis', 'MySQL', 'Firebase'] },
  { cat: 'Cloud / Ops', vals: ['Azure', 'Docker', 'CI/CD', 'Load balancing', 'OpenAPI'] },
  { cat: 'Architecture', vals: ['Distributed systems', 'Microservices', 'Event-driven', 'Caching', 'API versioning'] },
  { cat: 'AI', vals: ['AI agents', 'Workflow automation', 'Prompt engineering'] },
  { cat: 'Product', vals: ['PRDs', 'User flows', 'Wireframes', 'Information architecture', 'Roadmapping'] },
]

const READOUT = [
  { k: 'role', v: <>Backend eng · <span className="hl">payments</span></> },
  { k: 'based', v: 'Chennai · UTC+5:30' },
  { k: 'exp', v: '4+ yrs @ Surfboard' },
  { k: 'cert', v: 'CAPM · product mgmt' },
  { k: 'stack', v: 'TS · NestJS · Postgres · Redis' },
]

const FACTS = [
  { k: 'Based', v: 'Chennai, India' },
  { k: 'Since', v: '2022 · Surfboard' },
  { k: 'Focus', v: 'Payments backends + AI' },
  { k: 'Cert', v: 'CAPM — Product Mgmt' },
  { k: 'Degree', v: 'B.E. EIE — St. Joseph’s' },
]

/* ------------------------------------------------------------------ hooks */
const scrollState = { reachedBottom: false }

function useScrollBottomLatch() {
  useEffect(() => {
    const check = () => {
      if (!scrollState.reachedBottom &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
        scrollState.reachedBottom = true
      }
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [])
}

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in')
        else if (!scrollState.reachedBottom) e.target.classList.remove('in')
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useClock() {
  const [t, setT] = useState('––:––:––')
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })
    setT(fmt())
    const id = window.setInterval(() => setT(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

/* ------------------------------------------------------------ status bar */
function StatusBar({ active, onOpenPalette }: { active: string; onOpenPalette: () => void }) {
  const clock = useClock()
  const path = active ? `:~/${active}$` : ':~$'
  return (
    <div className="bar">
      <div className="wrap bar-inner">
        <div className="bar-left">
          <a href="#top" className="mark" aria-label="Home">SRS</a>
          <button className="bar-path" onClick={onOpenPalette} title="Command palette (⌘K)">
            santhosh<b>@payments-backend</b>{path}<span className="bar-hint">⌘K</span>
          </button>
        </div>
        <nav className="bar-nav">
          {NAV.map((n) => <a key={n} href={`#${n}`} className={active === n ? 'active' : ''}>{n}</a>)}
        </nav>
        <div className="bar-right">
          <span className="status-dot"><i />open to work</span>
          <span className="clock">IST&nbsp;<b>{clock}</b></span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ safety chip */
function StatePill() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return }
    const t = setTimeout(() => setOn(true), 1100)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`statepill ${on ? 'enabled' : 'blocked'}`} aria-live="polite">
      <span className="led" />
      <span>{on ? 'submit() · deliberately wired' : 'submit() · unreachable'}</span>
    </div>
  )
}

/* ------------------------------------------------------------ panel */
function Panel({ id, cmd, tag, children }: { id: string; cmd: ReactNode; tag?: string; children: ReactNode }) {
  return (
    <section id={id} className="panel">
      <div className="wrap reveal">
        <div className="panel-head">
          <span className="prompt">›</span>
          <span className="cmd">{cmd}</span>
          <span className="cursor" aria-hidden="true" />
          <span className="spacer" />
          {tag && <span className="tag">{tag}</span>}
        </div>
        {children}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ concurrency demo */
function ConcurrencyDemo() {
  const N = 10
  const [state, setState] = useState<('idle' | 'pass' | 'block')[]>(Array(N).fill('idle'))
  const [release, setRelease] = useState(false)
  const [fired, setFired] = useState(false)
  const timers = useRef<number[]>([])
  const fire = () => {
    timers.current.forEach(clearTimeout)
    setFired(true)
    setState(Array(N).fill('idle'))
    for (let i = 0; i < N; i++) {
      const id = window.setTimeout(() => {
        setState((prev) => {
          const next = [...prev]
          if (i === 0) next[i] = 'pass'
          else next[i] = release && i === N - 1 ? 'pass' : 'block'
          return next
        })
      }, 120 + i * 70)
      timers.current.push(id)
    }
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const passes = state.filter((s) => s === 'pass').length
  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-title">one purchase · {N} duplicate “paid!” messages</span>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="demo-toggle" role="switch" aria-checked={release} tabIndex={0}
            onClick={() => setRelease((v) => !v)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRelease((v) => !v) } }}>
            <span className={`switch ${release ? 'on' : ''}`} />unlock early
          </span>
          <button className="demo-btn" onClick={fire}>send {N} “paid!” →</button>
        </div>
      </div>
      <div className="txgrid">
        {state.map((s, i) => (
          <div key={i} className={`tx ${s}`}>
            <div className="id">“paid!”</div>
            <div className="st">
              {s === 'idle' ? '— waiting' : s === 'pass' ? <><span className="led" />recorded once</> : <><span className="led" />ignored (dupe)</>}
            </div>
          </div>
        ))}
      </div>
      <p className="demo-note">
        {!fired
          ? 'The same purchase, ten “paid!” messages (network retries). Watch it get recorded once.'
          : release
            ? `${passes} got through — unlocking early re-opens the door, so a late duplicate is processed again (a double-charge).`
            : `Recorded once, ${N - 1} duplicates ignored — the lock is held long enough to swallow every retry.`}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------ review demo (diff reviewer) */
const REVIEW = [
  { t: 'This could crash if the list is empty', keep: true },
  { t: 'Maybe rename this variable?', keep: false },
  { t: 'This payment could run twice on a retry', keep: true },
  { t: 'Consider a different style here', keep: false },
  { t: 'This date is off by one in a leap year', keep: true },
  { t: 'This might be a little slow', keep: false },
]
function ReviewDemo() {
  const [judged, setJudged] = useState(false)
  const kept = REVIEW.filter((r) => r.keep).length
  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-title">6 possible comments · only the confident ones survive</span>
        <button className="demo-btn" onClick={() => setJudged((v) => !v)}>{judged ? 'reset' : 'make each prove itself ▸'}</button>
      </div>
      <div className="rev-list">
        {REVIEW.map((r, i) => (
          <div key={i} className={`rev-item ${judged ? (r.keep ? 'keep' : 'drop') : ''}`}>
            <span className="rev-mark">{judged ? (r.keep ? I.check : '✕') : '•'}</span>
            <span className="rev-t">{r.t}</span>
            {judged && <span className="rev-tag">{r.keep ? 'kept' : 'dropped — not sure enough'}</span>}
          </div>
        ))}
      </div>
      <p className="demo-note">{judged ? `${kept} kept, ${REVIEW.length - kept} thrown away. Staying quiet is a valid answer.` : 'Most auto-reviewers dump every guess on you. This one throws away anything it can’t defend.'}</p>
    </div>
  )
}

/* ------------------------------------------------------------ analyzer demo (code analyzer) */
const REPOS = [
  { name: 'an online shop', bars: [['TypeScript', 64], ['CSS', 22], ['other', 14]] as [string, number][], stack: 'React · Node · Postgres', q: 'What’s risky to change?', a: 'The checkout & payment flow — a bug there costs real money.' },
  { name: 'a payments API', bars: [['TypeScript', 71], ['SQL', 18], ['other', 11]] as [string, number][], stack: 'NestJS · Redis · Postgres', q: 'What breaks if I change the login token?', a: 'Every partner integration — they all sign in through it.' },
  { name: 'a mobile game', bars: [['C#', 80], ['shaders', 12], ['other', 8]] as [string, number][], stack: 'Unity · C#', q: 'Where’s the core logic?', a: 'The GameManager and the physics loop — start there.' },
]
function AnalyzerDemo() {
  const [sel, setSel] = useState<number | null>(null)
  const r = sel != null ? REPOS[sel] : null
  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-title">paste a codebase · ask in plain english</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {REPOS.map((rp, i) => <button key={i} className={`demo-btn ${sel === i ? 'sel' : ''}`} onClick={() => setSel(i)}>{rp.name}</button>)}
        </div>
      </div>
      {r ? (
        <div className="anz">
          <div className="anz-card">
            <div className="anz-k">detected instantly (no AI needed)</div>
            <div className="anz-stack">{r.stack}</div>
            <div className="anz-bars">{r.bars.map(([l, v]) => (<div key={l} className="anz-bar"><span>{l}</span><i style={{ width: `${v}%` }} /><b>{v}%</b></div>))}</div>
          </div>
          <div className="anz-qa"><div className="anz-q">Q: {r.q}</div><div className="anz-a">A: {r.a}</div></div>
        </div>
      ) : <p className="demo-note">Pick a codebase — it detects what it’s built with instantly, then answers questions in plain English.</p>}
    </div>
  )
}

/* ------------------------------------------------------------ risk demo (car dashboard) */
const LOANS = [
  { name: 'A. Kumar', days: 12 },
  { name: 'R. Iyer', days: 96 },
  { name: 'S. Nair', days: 45 },
  { name: 'M. Das', days: 130 },
  { name: 'P. Roy', days: 5 },
]
function loanAction(days: number): { label: string; lvl: string } {
  if (days >= 120) return { label: 'Initiate repossession', lvl: 'stop' }
  if (days >= 90) return { label: 'Field visit', lvl: 'stop' }
  if (days >= 30) return { label: 'Escalate — warning call', lvl: 'warn' }
  return { label: 'Friendly reminder', lvl: 'ok' }
}
function RiskDemo() {
  const [sorted, setSorted] = useState(false)
  const rows = sorted ? [...LOANS].sort((a, b) => b.days - a.days) : LOANS
  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-title">overdue car loans · who to chase first</span>
        <button className="demo-btn" onClick={() => setSorted((v) => !v)}>{sorted ? 'reset order' : 'prioritise ▸'}</button>
      </div>
      <div className="risk">
        {rows.map((l) => {
          const a = loanAction(l.days)
          return (
            <div key={l.name} className={`risk-row ${a.lvl}`}>
              <span className="rk-name">{l.name}</span>
              <span className="rk-days">{l.days}d overdue</span>
              <span className="rk-act">{a.label}</span>
            </div>
          )
        })}
      </div>
      <p className="demo-note">{sorted ? 'Sorted by risk, each with its exact next step — the collector knows who to call today.' : 'A messy list of overdue accounts. Hit “prioritise” to turn it into a plan.'}</p>
    </div>
  )
}

/* ------------------------------------------------------------ ledger record */
function Record({ p, idx }: { p: Project; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="record">
      <div className="record-main">
        <div className="record-head">
          <span className="rec-id">PRJ-{String(idx + 1).padStart(2, '0')}</span>
          <h3 className="rec-name">{p.name}</h3>
          <span className={`rec-status ${p.runKind === 'live' ? 'live' : ''}`}><i />{p.run}</span>
        </div>
        <p className="rec-one">{p.one}</p>
        <p className="rec-why"><span className="lbl">{p.whyLabel}</span>{p.why}</p>
        {p.fix && (
          <p className="rec-fix">
            <span className="lbl">{p.fix.label}</span>{p.fix.text}{' '}
            <a className="fixlink" href={p.fix.href} target="_blank" rel="noopener">{p.fix.hrefLabel} ↗</a>
          </p>
        )}
        {p.demo && (
          <div className="run-row">
            <button className="run-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
              {open ? '▾ hide interactive demo' : '▸ run interactive demo'}
            </button>
          </div>
        )}
      </div>
      {open && p.demo === 'concurrency' && <ConcurrencyDemo />}
      {open && p.demo === 'review' && <ReviewDemo />}
      {open && p.demo === 'analyzer' && <AnalyzerDemo />}
      {open && p.demo === 'risk' && <RiskDemo />}
      <div className="record-foot">
        <div className="stack">{p.stack.map((s) => <i key={s}>{s}</i>)}</div>
        <a className="plink" href={p.href} target="_blank" rel="noopener">{I.github} source ↗</a>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------ signature */
function Signature() {
  const ref = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDrawn(true); return }
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setDrawn(true); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setDrawn(true)
        else if (!scrollState.reachedBottom) setDrawn(false)
      }),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div className="sign">
      <span className="dash">—</span>
      <div ref={ref} className={`sig-wrap ${drawn ? 'drawn' : ''}`}>
        <svg className="sig" viewBox={SIG_VIEWBOX} role="img" aria-label="Rubenraj, signed">
          <path className="sig-draw" d={SIG_D} pathLength={1} />
          <path className="sig-fill" d={SIG_D} />
          <path className="sig-dot" d={SIG_DOT_D} />
        </svg>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ count-up */
function Stat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [t, setT] = useState(0)
  const tRef = useRef(0)
  const rafRef = useRef(0)
  const parts = useMemo(() => {
    const out: { text?: string; target?: number; decimals?: number; comma?: boolean; pad?: number }[] = []
    const re = /-?\d[\d,]*(?:\.\d+)?/g
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(value)) !== null) {
      if (m.index > last) out.push({ text: value.slice(last, m.index) })
      const raw = m[0]
      // A written "04" must still read "04" once the count-up lands — parseFloat
      // drops the zero, so keep the original integer width and pad it back.
      const intDigits = raw.replace('-', '').split('.')[0].length
      out.push({ target: parseFloat(raw.replace(/,/g, '')), decimals: (raw.split('.')[1] || '').length, comma: raw.includes(','), pad: /^-?0\d/.test(raw) ? intDigits : 0 })
      last = m.index + raw.length
    }
    if (last < value.length) out.push({ text: value.slice(last) })
    return out
  }, [value])
  useEffect(() => {
    const set = (v: number) => { tRef.current = v; setT(v) }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { set(1); return }
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { set(1); return }
    const animateTo = (target: number) => {
      cancelAnimationFrame(rafRef.current)
      const from = tRef.current
      if (from === target) return
      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 1100)
        set(from + (target - from) * (1 - Math.pow(1 - p, 3)))
        if (p < 1) rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) animateTo(1)
        else if (!scrollState.reachedBottom) animateTo(0)
      }),
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(rafRef.current) }
  }, [])
  return (
    <span ref={ref}>
      {parts.map((p, i) => {
        if (p.text !== undefined) return <span key={i}>{p.text}</span>
        const cur = (p.target ?? 0) * t
        const raw = p.decimals ? cur.toFixed(p.decimals) : p.comma ? Math.round(cur).toLocaleString('en-US') : String(Math.round(cur))
        const shown = p.pad ? raw.padStart(p.pad, '0') : raw
        return <span key={i}>{shown}</span>
      })}
    </span>
  )
}

/* ------------------------------------------------------------------ app */
/* ------------------------------------------------------------ enhancements */
const NAV = ['work', 'projects', 'approach', 'stack', 'about', 'contact'] as const
/* One row per SURFBOARD entry, in the same order — index-paired in the tile
   grid. Add a row here whenever you add one there. */
const SPARKS: number[][] = [
  [3, 5, 8, 12, 18, 25],
  [10, 9, 8.5, 7.6, 6.6, 6],
  [2, 5, 7, 10, 13, 15],
  [18, 15, 12, 9, 7, 6],
  [1, 1, 2, 3, 4, 5],
  [20, 15, 10, 6, 3.5, 2],
  [10, 8.6, 7, 5.6, 4.6, 4],
]

function goTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  else window.location.hash = id
}
function downloadCV() {
  const a = document.createElement('a')
  a.href = '/resume.pdf'
  a.download = 'Santhosh-Rubenraj-Solomon-CV.pdf'
  document.body.appendChild(a); a.click(); a.remove()
}

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + window.innerHeight * 0.35
      let cur = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= line) cur = id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [ids])
  return active
}

function Spark({ data }: { data: number[] }) {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDrawn(true); return }
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setDrawn(true); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setDrawn(true)
        else if (!scrollState.reachedBottom) setDrawn(false)
      }),
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  // Guarded after the hooks so hook order stays constant. A missing or
  // single-point series must not take the page down with it: Math.min(...
  // undefined) throws before React mounts and the whole site renders blank.
  // Losing one sparkline is the correct failure.
  if (!Array.isArray(data) || data.length < 2) return null
  const w = 60, h = 20, pad = 2.5
  const min = Math.min(...data), max = Math.max(...data)
  const nx = (i: number) => pad + (i / (data.length - 1)) * (w - 2 * pad)
  const ny = (v: number) => pad + (1 - (v - min) / ((max - min) || 1)) * (h - 2 * pad)
  const line = 'M' + data.map((v, i) => `${nx(i).toFixed(1)},${ny(v).toFixed(1)}`).join(' L')
  const area = `${line} L${nx(data.length - 1).toFixed(1)},${h - pad} L${nx(0).toFixed(1)},${h - pad} Z`
  return (
    <svg ref={ref} className={`spark ${drawn ? 'drawn' : ''}`} viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <path className="spark-area" d={area} />
      <path className="spark-line" d={line} pathLength={1} />
      <circle className="spark-dot" cx={nx(data.length - 1)} cy={ny(data[data.length - 1])} r="2" />
    </svg>
  )
}

const CMDS: { name: string; desc: string }[] = [
  { name: 'help', desc: 'list commands' },
  { name: 'work', desc: 'jump to selected work' },
  { name: 'projects', desc: 'jump to projects' },
  { name: 'approach', desc: 'jump to approach' },
  { name: 'stack', desc: 'jump to the stack' },
  { name: 'about', desc: 'jump to background' },
  { name: 'contact', desc: 'jump to contact' },
  { name: 'cv', desc: 'download résumé (pdf)' },
  { name: 'github', desc: 'open github ↗' },
  { name: 'linkedin', desc: 'open linkedin ↗' },
  { name: 'whoami', desc: 'who is this' },
  { name: 'reboot', desc: 'replay boot sequence' },
  { name: 'clear', desc: 'clear the screen' },
]

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [input, setInput] = useState('')
  const [sel, setSel] = useState(0)
  const [log, setLog] = useState<ReactNode[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const q = input.trim().toLowerCase()
  const suggestions = q ? CMDS.filter((c) => c.name.startsWith(q)) : CMDS

  useEffect(() => { if (open) { setSel(0); setTimeout(() => inputRef.current?.focus(), 30) } }, [open])
  useEffect(() => { setSel(0) }, [input])
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const print = (node: ReactNode) => setLog((l) => [...l, <div className="pl-out" key={'o' + l.length}>{node}</div>])
  const exec = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    setLog((l) => [...l, <div className="pl-cmd" key={'c' + l.length}><span className="pl-caret">›</span> {cmd}</div>])
    switch (cmd) {
      case 'help':
        print(<div className="pl-help">{CMDS.filter((c) => c.name !== 'help').map((c) => (<div key={c.name}><b>{c.name}</b><span>{c.desc}</span></div>))}</div>); break
      case 'work': case 'projects': case 'approach': case 'stack': case 'about': case 'contact':
        onClose(); goTo(cmd); break
      case 'cv': case 'resume':
        downloadCV(); print('↓ downloading Santhosh-Rubenraj-Solomon-CV.pdf'); break
      case 'github': window.open(PROFILE, '_blank', 'noopener'); print('↗ opening github…'); break
      case 'linkedin': window.open(LINKEDIN, '_blank', 'noopener'); print('↗ opening linkedin…'); break
      case 'whoami': print('Santhosh Rubenraj Solomon — product-minded backend engineer · payments @ Surfboard · Chennai. Backend by title; I know the infra end to end.'); break
      case 'reboot': try { sessionStorage.removeItem('booted') } catch { /* */ } window.location.reload(); break
      case 'clear': setLog([]); break
      default: print(<><span className="pl-err">command not found: {cmd}</span> — type <b>help</b></>)
    }
  }
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter') {
      const exact = CMDS.find((c) => c.name === q)
      exec(exact ? exact.name : (suggestions[sel]?.name ?? input)); setInput('')
    } else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((i) => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Tab') { e.preventDefault(); if (suggestions[sel]) setInput(suggestions[sel].name) }
    else if (e.key === 'Escape') { onClose() }
  }
  return (
    <div className="pl-overlay" onClick={onClose}>
      <div className="pl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette">
        <div className="pl-bar"><span className="lamp g" /><span className="lamp" /><span className="lamp" /><span>SRS // command — try “help”, esc to close</span></div>
        {log.length > 0 && <div className="pl-log">{log}</div>}
        <div className="pl-input">
          <span className="pl-caret">›</span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="type a command…" spellCheck={false} autoComplete="off" aria-label="command" />
        </div>
        <div className="pl-sug">
          {suggestions.map((c, i) => (
            <button key={c.name} className={`pl-sug-item ${i === sel ? 'on' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => { exec(c.name); setInput('') }}>
              <b>{c.name}</b><span>{c.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const BOOT_LINES: ReactNode[] = [
  <>› initializing <b>payments-terminal</b>…</>,
  <>› mounting ledger @ shared-postgres … <span className="ok">ok</span></>,
  <>› redis idempotency-lock … <span className="ok">armed</span></>,
  <>› loading <b>santhosh.profile</b> … <span className="ok">ok</span></>,
  <>› ready.</>,
]
function Boot() {
  const gated = (() => { try { return sessionStorage.getItem('booted') === '1' } catch { return true } })()
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const skip = gated || reduce
  const [shown, setShown] = useState(skip ? BOOT_LINES.length : 0)
  const [done, setDone] = useState(skip)
  useEffect(() => {
    if (skip) return
    let i = 0
    const finish = () => { try { sessionStorage.setItem('booted', '1') } catch { /* */ } setDone(true) }
    const id = window.setInterval(() => {
      i += 1; setShown(i)
      if (i >= BOOT_LINES.length) { clearInterval(id); window.setTimeout(finish, 480) }
    }, 260)
    const onSkip = () => { clearInterval(id); finish() }
    window.addEventListener('keydown', onSkip)
    window.addEventListener('pointerdown', onSkip)
    return () => { clearInterval(id); window.removeEventListener('keydown', onSkip); window.removeEventListener('pointerdown', onSkip) }
  }, [])
  if (skip) return null
  return (
    <div className={`boot ${done ? 'gone' : ''}`} aria-hidden="true">
      <div className="boot-inner">
        {BOOT_LINES.slice(0, shown).map((l, i) => <div className="boot-line" key={i}>{l}</div>)}
        <span className="cursor" />
      </div>
    </div>
  )
}

export default function App() {
  useScrollBottomLatch()
  useReveal()
  const [palette, setPalette] = useState(false)
  const active = useActiveSection(NAV)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((o) => !o) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <>
      <Boot />
      <a id="top" />
      <StatusBar active={active} onOpenPalette={() => setPalette(true)} />

      {/* HERO */}
      <header className="panel hero" style={{ borderTop: 'none' }}>
        <div className="wrap">
          <p className="hero-kicker">Santhosh Rubenraj Solomon <b>// backend engineer · payments</b></p>
          <div className="hero-grid">
            <div>
              <h1>Everything real was once imagined - until someone made it true.</h1>
              <p className="hero-thesis">
                Agents and distributed backends, built the same way: the action that could do real damage —{' '}
                <span className="ink">submit the application, reprocess the payment, write to the repo</span> — is made structurally
                unreachable first, then deliberately wired. A config flag you can flip is not a safety mechanism.
              </p>
              <p className="hero-bridge">
                # Backend Engineer with 4 years in a Nordic payments stack. Close enough to the infrastructure to know where it breaks, and just as involved in product direction as code.
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#work">see the work {I.arrow}</a>
                <a className="btn" href="/resume.pdf" download="Santhosh-Rubenraj-Solomon-CV.pdf">download cv {I.down}</a>
                <a className="btn" href={PROFILE} target="_blank" rel="noopener">github {I.github}</a>
              </div>
            </div>
            <aside className="readout">
              <div className="readout-bar"><span className="lamp g" /><span className="lamp" /><span className="lamp" /><span>system: nominal</span></div>
              <div className="readout-rows">
                {READOUT.map((r) => (
                  <div className="r" key={r.k}><span className="k">{r.k}</span><span className="v">{r.v}</span></div>
                ))}
              </div>
              <div className="readout-foot"><StatePill /></div>
            </aside>
          </div>
        </div>
      </header>

      {/* WORK */}
      <Panel id="work" cmd={<>query <b>--metrics</b> --scope=surfboard</>} tag="load-bearing">
        <h2 className="p-title">Things I built that hold weight.</h2>
        <p className="p-lead">Not a task list — the systems the business runs on, and what changed because they exist.</p>
        <p className="work-role"><b>Software Engineer</b> · May 2022 — Present · Chennai, India</p>
        <div className="tiles">
          {SURFBOARD.map((w, i) => (
            <div className="tile" key={w.title}>
              <Spark data={SPARKS[i]} />
              <div className="tile-metric"><Stat value={w.metric} /></div>
              <div className="tile-unit">{w.unit}</div>
              <div className="tile-title">{w.title}</div>
              <div className="tile-desc">{w.desc}</div>
              <div className="tile-tag">{w.tag}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* PROJECTS */}
      <Panel id="projects" cmd={<>ls <b>./projects</b> --with-demos</>} tag={`${PROJECTS.length} records`}>
        <h2 className="p-title">Agents and systems I built to think through a problem.</h2>
        <p className="p-lead">Each runs. Each leads with the interesting decision — plus an honest note on what it doesn’t do yet. Hit <span className="mono" style={{ color: 'var(--gold)' }}>▸ run</span> to try the live ones.</p>
        <div className="records" style={{ marginTop: 30 }}>
          {PROJECTS.map((p, i) => <Record key={p.name} p={p} idx={i} />)}
        </div>
      </Panel>

      {/* APPROACH */}
      <Panel id="approach" cmd={<>cat <b>approach.md</b></>} tag="how i work">
        <h2 className="p-title">A product person who ships the backend.</h2>
        <p className="p-lead">The engineering is the proof. The product thinking is why it’s the right thing to build.</p>
        <div className="appr-list" style={{ marginTop: 30 }}>
          {APPROACH.map((a) => (
            <article className="appr" key={a.n}>
              <span className="n">{a.n}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </Panel>

      {/* SKILLS */}
      <Panel id="stack" cmd={<>stack <b>--list</b></>} tag="toolbox">
        <h2 className="p-title">What I reach for.</h2>
        <div className="skills" style={{ marginTop: 24 }}>
          {SKILLS.map((s) => (
            <div className="skillrow" key={s.cat}>
              <span className="cat">{s.cat}</span>
              <span className="vals">{s.vals.map((v) => <span key={v}>{v}</span>)}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* ABOUT */}
      <Panel id="about" cmd={<>whoami <b>--verbose</b></>} tag="background">
        <div className="about-grid">
          <div className="about">
            <h2 className="p-title">Engineering payments from Chennai, with an eye for product and resilience.</h2>
            <p>
              I’m Santhosh. Coming from an <span className="ink">Electronics &amp; Instrumentation</span> background, I entered
              tech as a full-stack intern before finding my niche in payments. Over the last four years, I’ve helped keep backend
              systems running reliably for a Nordic fintech, gaining end-to-end visibility across the stack.
            </p>
            <p>
              I bring a strong product instinct to engineering—thinking through user experience, architecture, and feature
              viability before writing a line of code. I’d rather be the engineer who helps shape the product strategy and builds
              it ground-up than someone who just receives a spec and hands it off halfway.
            </p>
            <div className="sign-block">
              <p className="sign-label">// authorized_by</p>
              <Signature />
            </div>
          </div>
          <div className="factlist">
            {FACTS.map((f) => (<div key={f.k}><span>{f.k}</span><b>{f.v}</b></div>))}
          </div>
        </div>
      </Panel>

      {/* CONTACT */}
      <Panel id="contact" cmd={<>./contact <b>--open</b></>} tag="reach out">
        <div className="contact">
          <h2>Building something that has to be correct? Let’s talk.</h2>
          <div className="clinks">
            <a className="clink" href={`mailto:${EMAIL}`}><span className="ck">email</span>{EMAIL}<span className="arrow">↗</span></a>
            <a className="clink" href={LINKEDIN} target="_blank" rel="noopener"><span className="ck">linkedin</span>/santhosh-ruben-raj-solomon<span className="arrow">↗</span></a>
            <a className="clink" href={PROFILE} target="_blank" rel="noopener"><span className="ck">github</span>/Santhosh-Rubenraj-Solomon<span className="arrow">↗</span></a>
            <a className="clink" href="/resume.pdf" download="Santhosh-Rubenraj-Solomon-CV.pdf"><span className="ck">résumé</span>Santhosh-Rubenraj-Solomon-CV.pdf<span className="arrow">↓</span></a>
          </div>
        </div>
      </Panel>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span>© 2026 santhosh rubenraj solomon</span>
          <span>built as a terminal, not a template · react + vite</span>
        </div>
      </footer>
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </>
  )
}
