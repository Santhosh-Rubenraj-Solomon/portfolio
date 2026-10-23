import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SIG_D, SIG_DOT_D, SIG_VIEWBOX } from './signature'

type Seg = { cmd: string; nums: number[] }

/** Minimal SVG path tokenizer: splits into command letters + their numeric args. */
function parsePath(d: string): Seg[] {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? []
  const segs: Seg[] = []
  for (const t of tokens) {
    if (/[A-Za-z]/.test(t)) segs.push({ cmd: t, nums: [] })
    else {
      if (!segs.length) throw new Error('number before first command')
      segs[segs.length - 1].nums.push(Number(t))
    }
  }
  return segs
}

function points(d: string): [number, number][] {
  const out: [number, number][] = []
  for (const s of parsePath(d)) for (let i = 0; i < s.nums.length; i += 2) out.push([s.nums[i], s.nums[i + 1]])
  return out
}

const vb = SIG_VIEWBOX.split(/\s+/).map(Number)
const [vx, vy, vw, vh] = vb

describe('SIG_VIEWBOX', () => {
  it('is four finite numbers', () => {
    expect(vb).toHaveLength(4)
    vb.forEach((n) => expect(Number.isFinite(n)).toBe(true))
  })
  it('has positive width and height', () => {
    expect(vw).toBeGreaterThan(0)
    expect(vh).toBeGreaterThan(0)
  })
  it('is a landscape box (signature is wider than tall)', () => {
    expect(vw / vh).toBeGreaterThan(1)
  })
})

describe.each([
  ['SIG_D', SIG_D],
  ['SIG_DOT_D', SIG_DOT_D],
])('%s path data', (_name, d) => {
  const segs = parsePath(d)

  it('is a non-empty string with only path-legal characters', () => {
    expect(typeof d).toBe('string')
    expect(d.length).toBeGreaterThan(0)
    expect(d).toMatch(/^[MC0-9.,\s-]+$/)
  })

  it('starts with an absolute moveto carrying exactly one point', () => {
    expect(segs[0].cmd).toBe('M')
    expect(segs[0].nums).toHaveLength(2)
  })

  it('has a single moveto (one continuous pen stroke) followed only by cubic curves', () => {
    expect(segs.filter((s) => s.cmd === 'M')).toHaveLength(1)
    expect(segs.slice(1).length).toBeGreaterThan(0)
    segs.slice(1).forEach((s) => expect(s.cmd).toBe('C'))
  })

  it('gives every cubic exactly 3 coordinate pairs', () => {
    segs.slice(1).forEach((s) => expect(s.nums).toHaveLength(6))
  })

  it('contains only finite numbers', () => {
    segs.forEach((s) => s.nums.forEach((n) => expect(Number.isFinite(n)).toBe(true)))
  })

  it('stays entirely inside SIG_VIEWBOX (nothing is clipped)', () => {
    for (const [x, y] of points(d)) {
      expect(x).toBeGreaterThanOrEqual(vx)
      expect(x).toBeLessThanOrEqual(vx + vw)
      expect(y).toBeGreaterThanOrEqual(vy)
      expect(y).toBeLessThanOrEqual(vy + vh)
    }
  })

  it('is a closed loop (last endpoint returns to the start point)', () => {
    const start = segs[0].nums
    const last = segs[segs.length - 1].nums
    expect(last.slice(-2)).toEqual(start)
  })
})

describe('signature geometry', () => {
  it('the main stroke spans most of the viewBox (the viewBox is tight to the ink)', () => {
    const pts = points(SIG_D)
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    const spanX = Math.max(...xs) - Math.min(...xs)
    const spanY = Math.max(...ys) - Math.min(...ys)
    expect(spanX / vw).toBeGreaterThan(0.9)
    expect(spanY / vh).toBeGreaterThan(0.9)
  })

  it('the dot is tiny compared with the main stroke', () => {
    const pts = points(SIG_DOT_D)
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan(10)
    expect(Math.max(...ys) - Math.min(...ys)).toBeLessThan(10)
    expect(SIG_DOT_D.length).toBeLessThan(SIG_D.length / 10)
  })

  it('the dot sits inside the bounding box of the main stroke (it dots a letter, not floating off-canvas)', () => {
    const main = points(SIG_D)
    const [dx, dy] = points(SIG_DOT_D)[0]
    expect(dx).toBeGreaterThan(Math.min(...main.map((p) => p[0])))
    expect(dx).toBeLessThan(Math.max(...main.map((p) => p[0])))
    expect(dy).toBeGreaterThan(Math.min(...main.map((p) => p[1])))
    expect(dy).toBeLessThan(Math.max(...main.map((p) => p[1])))
  })

  it('matches the viewBox and main stroke of public/signature.svg (the two copies have not drifted)', () => {
    const svg = readFileSync(resolve(__dirname, '../public/signature.svg'), 'utf8')
    expect(svg).toContain(`viewBox="${SIG_VIEWBOX}"`)
    expect(svg).toContain(SIG_D.slice(0, 200))
  })
})

describe('parsePath helper (sanity)', () => {
  it('parses a known path', () => {
    expect(parsePath('M 1,2 C 3 4, 5 6, 7 8')).toEqual([
      { cmd: 'M', nums: [1, 2] },
      { cmd: 'C', nums: [3, 4, 5, 6, 7, 8] },
    ])
  })
  it('throws on numbers before a command', () => {
    expect(() => parsePath('1 2 M 3 4')).toThrow()
  })
})
