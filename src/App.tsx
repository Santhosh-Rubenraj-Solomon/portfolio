import { useState, useEffect, useRef, type ReactNode } from 'react'

/* ------------------------------------------------------------------ links */
const PROFILE = 'https://github.com/Santhosh-Rubenraj-Solomon'
const LINKEDIN = 'https://www.linkedin.com/in/santhosh-ruben-raj-solomon'
const EMAIL = 'santhoshrubenc@gmail.com'
const REPO = 'https://github.com/Santhosh-Rubenraj-Solomon/AI_agents/tree/main/Documents/santhosh_%28%29'

/* ------------------------------------------------------------------ icons */
const I = {
  arrow: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  down: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.63 0H2.37A2.35 2.35 0 000 2.33v11.34A2.35 2.35 0 002.37 16h11.26A2.35 2.35 0 0016 13.67V2.33A2.35 2.35 0 0013.63 0zM4.86 13.12H2.9V6.4h1.96v6.72zM3.88 5.5a1.14 1.14 0 110-2.28 1.14 1.14 0 010 2.28zm9.24 7.62h-1.96V9.74c0-.82-.02-1.87-1.14-1.87-1.14 0-1.32.9-1.32 1.81v3.44H6.75V6.4h1.88v.92h.03c.26-.5.9-1.02 1.85-1.02 1.98 0 2.35 1.3 2.35 3v3.82z" />
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 4l6 4.5L14 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M13 3l-1 1M4 12l-1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 107 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
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
  { metric: '10,000+', unit: 'POS terminals', title: 'Device management, from scratch', desc: 'Designed and built the system that provisions and manages payment terminals across 3 markets — data model, APIs, hardware provisioning, granular access. Provisioning went from ~45 min to under 5.', tag: 'APIs · fleet · RBAC' },
  { metric: '−40%', unit: 'incidents', title: 'Payment methods, V2', desc: 'Led the ground-up rewrite of the core payment-methods service into a modular NestJS implementation — the path every transaction routes through.', tag: 'NestJS · core service' },
  { metric: '15+', unit: 'partner integrations', title: 'Developer & partner APIs', desc: 'Built the service-account APIs and Developer Portal external integrators build on — JWT auth across isolated environments, with contracts, versioning and deprecation workflows. Zero cross-environment security incidents.', tag: 'JWT · API contracts' },
  { metric: '1.8s → 0.6s', unit: 'p95 latency', title: '~87 services, made to talk less', desc: 'Consolidated shared business logic across the microservice estate and introduced async messaging + caching — cutting redundant inter-service calls and peak-load latency.', tag: 'event-driven · caching' },
  { metric: '−20 hrs', unit: 'per week', title: 'Logistics & shipping migration', desc: 'Re-architected the shipping-provider integration with secure async webhooks for real-time delivery tracking — status lag dropped from hours to under a minute.', tag: 'webhooks · logistics' },
  { metric: '−50%', unit: 'time-to-acknowledge', title: 'Incident ticketing + ops agents', desc: 'Replaced ad-hoc Slack alerts with a raise → monitor → resolve workflow, and shipped internal AI agents for high-frequency ops — around 15 hrs/week back to the team.', tag: 'AI agents · ops' },
]

type Demo = 'concurrency' | 'guards' | null
type Project = {
  name: string; one: string; whyLabel: string; why: string
  stack: string[]; href: string; run: string; runKind: 'live' | 'demo'; demo: Demo
}
const PROJECTS: Project[] = [
  {
    name: 'AI-DS Ledger Reconciler',
    one: 'A distributed reconciler for the classic fintech headache — our books say PENDING but the processor says paid. Payment webhooks are de-duplicated across a cluster, and an AI agent inspects the ledger and self-heals each transaction’s status.',
    whyLabel: 'The decision',
    why: 'The Redis lock is deliberately never released on success — its 10-second TTL doubles as an idempotency window, so a duplicate txId inside 10s is rejected (429) instead of reprocessed. The escape hatch for the opposite policy is written down. A tradeoff, stated and reversible — not an accident.',
    stack: ['NestJS', 'Redis', 'Nginx LB', 'Vercel AI SDK', 'Docker'],
    href: `${REPO}/ai-ds-ledger-reconciler`, run: 'builds clean · full run needs Docker + key', runKind: 'demo', demo: 'concurrency',
  },
  {
    name: 'Job-Hunt Agent',
    one: 'An autonomous job-search agent that finds real openings, tailors the résumé per posting, and routes every application through a human approval gate.',
    whyLabel: 'The decision',
    why: 'I engineered it so it physically cannot auto-submit — four independent, each-sufficient guards. And I severed the graph edge to the submit step rather than using an interrupt: an interrupt is re-enabled by a config flag; a deleted edge isn’t. Defense in depth over one switch.',
    stack: ['Python', 'LangGraph', 'Gemini', 'Playwright', 'FastAPI'],
    href: `${REPO}/AI-job-hunt`, run: 'runs · submission inert by design', runKind: 'demo', demo: 'guards',
  },
  {
    name: 'ECR Dev Factory',
    one: 'A Slack-native dev agent: a teammate types /ecr and describes a task in plain English; it plans the work, writes the code in an isolated git worktree, self-reviews and fixes it, then opens a GitLab merge request — with a human approval gate before a line is written.',
    whyLabel: 'Why it holds up',
    why: 'A durable, resumable phase machine — analyze → approve → code → review-loop → finalize — persisted in SQLite, each phase a swappable agent. Safety is the design: throwaway worktrees, a hard path-scope boundary, and prompts piped through temp files to block injection.',
    stack: ['TypeScript', 'Slack Bolt', 'Claude CLI', 'SQLite', 'GitLab'],
    href: `${REPO}/AI-REPO-agent`, run: 'typechecks clean · internal WIP', runKind: 'demo', demo: null,
  },
  {
    name: 'AI Code Analyzer',
    one: 'Paste a GitHub URL into a Telegram chat; it clones the repo, detects the tech stack, and answers architecture, breaking-change and bug-fix questions in plain English.',
    whyLabel: 'The nice bit',
    why: 'Stack detection is LLM-free and deterministic — fast, and provable by a standalone demo anyone can run with zero secrets. The model (Claude or GPT, pluggable) sits on top only for the deep reasoning. It’s the read-and-understand sibling to the ship-it dev agent.',
    stack: ['TypeScript', 'Telegraf', 'Claude / GPT-4o', 'SQLite'],
    href: `${REPO}/AI-agent-code`, run: 'stack-detection demo verified', runKind: 'demo', demo: null,
  },
  {
    name: 'Car Repossession Dashboard',
    one: 'A collections-and-risk view over an auto-loan book: where repossessions concentrate, and which overdue accounts to act on first — replacing a manual spreadsheet.',
    whyLabel: 'The product bit',
    why: 'It doesn’t just report a rate; it turns the portfolio into decisions. Risk is segmented by credit band, days-past-due and region (loss climbs steeply past 90 DPD), and a watchlist ranks accounts with a concrete next action: Call → Escalate → Field visit → Initiate repossession.',
    stack: ['Node', 'Express', 'SQLite', 'Dashboard'],
    href: PROFILE, run: 'runs end-to-end · synthetic data', runKind: 'live', demo: null,
  },
]

const APPROACH = [
  { n: '01', title: 'I write the PRD, not just the ticket', desc: 'Two years shaping product direction at Surfboard — PRDs, user flows, API design from the user’s side. CAPM-certified in product management.' },
  { n: '02', title: 'I optimize for the decision', desc: 'The car-loan dashboard doesn’t report a rate; it tells a collector who to call first. A good backend surfaces decisions, not rows.' },
  { n: '03', title: 'Safety is a feature, not a flag', desc: 'The dangerous action is made structurally unreachable first, then deliberately wired. A config toggle you can flip is not a safety mechanism.' },
  { n: '04', title: 'I state the seam', desc: 'Every system here ships with the one thing it gets wrong said out loud. That’s the line between a demo and a decision.' },
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

const FACTS = [
  { k: 'Based', v: 'Chennai, India' },
  { k: 'Since', v: '2022 · Surfboard Payments' },
  { k: 'Focus', v: 'Payments infra + AI agents' },
  { k: 'Certified', v: 'CAPM — Product Management' },
  { k: 'Degree', v: 'B.E. EIE — St. Joseph’s, Chennai' },
]

/* ------------------------------------------------------------------ hooks */
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined' && document.documentElement.dataset.theme)
      return document.documentElement.dataset.theme as 'light' | 'dark'
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* ignore */ }
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ------------------------------------------------------------ signature pill */
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
          // first request acquires; if "release on success", a later one can also pass
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
        <span className="demo-title">Concurrency · one txId, {N} identical webhooks</span>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="demo-toggle" role="switch" aria-checked={release} tabIndex={0}
            onClick={() => setRelease((v) => !v)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRelease((v) => !v) } }}>
            <span className={`switch ${release ? 'on' : ''}`} />release on success
          </span>
          <button className="demo-btn" onClick={fire}>Fire {N} →</button>
        </div>
      </div>
      <div className="txgrid">
        {state.map((s, i) => (
          <div key={i} className={`tx ${s}`}>
            <div className="id">txId 9f3a</div>
            <div className="st">
              {s === 'idle' ? '— waiting' : s === 'pass' ? <><span className="led" />200 acquired</> : <><span className="led" />429 rejected</>}
            </div>
          </div>
        ))}
      </div>
      <p className="demo-note">
        {!fired
          ? 'Fire ten identical webhooks at the cluster and watch the lock arbitrate.'
          : release
            ? `${passes} acquired — releasing on success reopens the window: a later duplicate reprocesses (the reconcile hole).`
            : `1 acquired, ${N - 1} rejected — holding the lock for its full TTL turns the mutex into a dedup window.`}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------ guard demo */
const GUARDS = [
  { name: 'TEST_MODE off (live keys)', sub: 'guard 1' },
  { name: 'auto_submit: true', sub: 'guard 2' },
  { name: 'human types APPROVE', sub: 'guard 3' },
  { name: 'submit .click() wired', sub: 'guard 4' },
]
function GuardDemo() {
  const [on, setOn] = useState<boolean[]>([false, false, false, false])
  const armed = on.every(Boolean)
  const [note, setNote] = useState('')
  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-title">Four independent guards · all must fall to submit</span>
        <span className="runbadge demo"><span className="led" />each one alone blocks it</span>
      </div>
      <div className="guards">
        {GUARDS.map((g, i) => (
          <div key={i} className={`guardrow ${on[i] ? 'on' : ''}`} role="checkbox" aria-checked={on[i]} tabIndex={0}
            onClick={() => setOn((p) => p.map((v, j) => (j === i ? !v : v)))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOn((p) => p.map((v, j) => (j === i ? !v : v))) } }}>
            <span className="box">{on[i] ? I.check : null}</span>
            <span className="gname">{g.name}</span>
            <span className="gsub">{g.sub}</span>
          </div>
        ))}
      </div>
      <div className="submit-zone">
        <button className={`submit-btn ${armed ? 'armed' : ''}`} disabled={!armed}
          onClick={() => setNote('In the repo, guard 4 stays commented out — so this button never actually arms in production.')}>
          {armed ? 'Submit application' : 'Submit — unreachable'}
        </button>
        <span className="demo-note" style={{ margin: 0 }}>
          {note || (armed ? 'All four flipped. Only now does the edge to submit exist.' : 'Flip one and it’s still blocked three other ways.')}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ sections */
function Nav({ theme, toggle }: { theme: 'light' | 'dark'; toggle: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a className="brand" href="#top"><span className="dot" />Santhosh</a>
        <div className="nav-links">
          <a className="hide-sm" href="#work">Work</a>
          <a className="hide-sm" href="#projects">Projects</a>
          <a className="hide-sm" href="#approach">Approach</a>
          <a className="nav-cta" href="#contact">Contact</a>
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle colour theme">
            {theme === 'dark' ? I.sun : I.moon}
          </button>
        </div>
      </div>
    </nav>
  )
}

function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="section">
      <div className="wrap reveal">{children}</div>
    </section>
  )
}

export default function App() {
  const { theme, toggle } = useTheme()
  useReveal()
  return (
    <>
      <a id="top" />
      <Nav theme={theme} toggle={toggle} />

      {/* HERO */}
      <header className="section hero" style={{ borderTop: 'none' }}>
        <div className="wrap">
          <p className="hero-kicker">Santhosh Rubenraj Solomon · a claim, not a job title</p>
          <h1>The dangerous thing should be impossible before it&rsquo;s possible.</h1>
          <div className="hero-body">
            <div>
              <p>
                I mostly build autonomous agents and distributed backends, and I build them the same way. The action that
                could do real damage — <span className="ink">submit the application, reprocess the payment, write to the repo</span> —
                is made structurally unreachable first, and only then, deliberately, wired up. A config flag you can flip is not a
                safety mechanism.
              </p>
              <p className="hero-bridge">
                Four years shipping payments infrastructure at Surfboard — and I spend nearly as much time in the PRD as in the codebase.
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#work">See the work {I.arrow}</a>
                <a className="btn btn-ghost" href="/resume.pdf" target="_blank" rel="noopener">Résumé {I.down}</a>
                <a className="btn btn-ghost" href={PROFILE} target="_blank" rel="noopener">GitHub {I.github}</a>
              </div>
            </div>
            <aside className="hero-aside">
              <StatePill />
              <div className="chips">
                <span className="chip"><span className="k">4+</span> yrs · fintech</span>
                <span className="chip"><span className="k">10k+</span> terminals</span>
                <span className="chip"><span className="k">~87</span> services</span>
                <span className="chip">CAPM · product</span>
              </div>
            </aside>
          </div>
        </div>
      </header>

      {/* WORK */}
      <Section id="work">
        <p className="eyebrow">At Surfboard Payments</p>
        <h2 className="h2">Things I built that are load-bearing.</h2>
        <p className="lead">Not a task list — the systems the business runs on, and what changed because they exist.</p>
        <div className="work-head" style={{ marginTop: 30 }}>
          <span className="work-role"><b>Software Engineer</b> · May 2022 — Present · Chennai, India</span>
        </div>
        <div className="work-grid">
          {SURFBOARD.map((w) => (
            <article className="wcard" key={w.title}>
              <div className="metric">{w.metric} <span className="u" style={{ fontSize: 13 }}>{w.unit}</span></div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
              <span className="tag">{w.tag}</span>
            </article>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects">
        <p className="eyebrow">Side work · real code</p>
        <h2 className="h2">Agents and systems I built to think through a problem.</h2>
        <p className="lead">Each one runs. Each leads with the decision that was actually interesting — and, where it matters, an honest note on what it doesn&rsquo;t do yet.</p>
        <div className="proj-list" style={{ marginTop: 34 }}>
          {PROJECTS.map((p) => (
            <article className="pcard" key={p.name}>
              <div className="pcard-main">
                <div className="pcard-top">
                  <div>
                    <h3>{p.name}</h3>
                    <p className="oneliner">{p.one}</p>
                  </div>
                  <span className={`runbadge ${p.runKind === 'demo' ? 'demo' : ''}`}><span className="led" />{p.run}</span>
                </div>
                <p className="why"><span className="lbl">{p.whyLabel}</span>{p.why}</p>
              </div>
              {p.demo === 'concurrency' && <ConcurrencyDemo />}
              {p.demo === 'guards' && <GuardDemo />}
              <div className="pcard-foot">
                <div className="stack">{p.stack.map((s) => <i key={s}>{s}</i>)}</div>
                <div className="plinks">
                  <a className="plink" href={p.href} target="_blank" rel="noopener">{I.github} source</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* APPROACH */}
      <Section id="approach">
        <p className="eyebrow">How I work</p>
        <h2 className="h2">A product person who ships the backend.</h2>
        <p className="lead">The engineering is the proof. The product thinking is why it&rsquo;s the right thing to build.</p>
        <div className="appr-grid" style={{ marginTop: 34 }}>
          {APPROACH.map((a) => (
            <article className="appr" key={a.n}>
              <span className="n mono">{a.n}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills">
        <p className="eyebrow">Stack</p>
        <h2 className="h2">What I reach for.</h2>
        <div className="skills-grid" style={{ marginTop: 26 }}>
          {SKILLS.map((s) => (
            <div className="skillrow" key={s.cat}>
              <span className="cat">{s.cat}</span>
              <span className="vals">{s.vals.map((v) => <span key={v}>{v}</span>)}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ABOUT */}
      <Section id="about">
        <p className="eyebrow">Background</p>
        <div className="about-grid">
          <div className="about">
            <h2 className="h2">Chennai, payments, and a taste for the failure mode.</h2>
            <p>
              I&rsquo;m Santhosh — a backend engineer who landed in payments and stayed because the failure modes are the
              interesting part. I trained as an <span className="ink">electronics &amp; instrumentation engineer</span>, started as a
              full-stack intern building a load-balanced library system, and for the last four years have built the infrastructure a
              Nordic payments company runs on.
            </p>
            <p>
              Along the way I picked up the other half of the job — writing the PRDs, mapping the user flows, arguing the API design
              with product stakeholders. I like being the person who can both spec the thing and build it.
            </p>
          </div>
          <div className="factlist">
            {FACTS.map((f) => (<div key={f.k}><span>{f.k}</span><b>{f.v}</b></div>))}
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact">
        <div className="contact">
          <p className="eyebrow">Contact</p>
          <h2>Building something that has to be correct? Let&rsquo;s talk.</h2>
          <div className="links">
            <a className="clink" href={`mailto:${EMAIL}`}>{I.mail}<span className="mono">{EMAIL}</span></a>
            <a className="clink" href={LINKEDIN} target="_blank" rel="noopener">{I.linkedin} LinkedIn</a>
            <a className="clink" href={PROFILE} target="_blank" rel="noopener">{I.github} GitHub</a>
            <a className="clink" href="/resume.pdf" target="_blank" rel="noopener">{I.down} Résumé</a>
          </div>
        </div>
      </Section>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span>© 2026 Santhosh Rubenraj Solomon</span>
          <span>Built in React · designed to be honest, not impressive</span>
        </div>
      </footer>
    </>
  )
}
