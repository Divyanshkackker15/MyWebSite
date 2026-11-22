/**
 * Renders the still images of the liquid object (run once, results are committed):
 *   npm run renders   (needs the dev server: npm run dev)
 * Output: public/images/renders/*.webp and *-sm.webp, public/images/hero-*.webp
 */
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const base = process.env.RENDER_URL ?? 'http://localhost:5173/scripts/renders/render.html'
const only = process.argv[2]
const out = path.resolve('public/images/renders')
const tmp = path.resolve('node_modules/.renders')
fs.mkdirSync(out, { recursive: true })
fs.mkdirSync(tmp, { recursive: true })

const jobs = []
const angles = [
  { ax: 0.55, ay: -0.35, az: 0.18, t: 3 },
  { ax: 1.2, ay: 0.4, az: -0.5, t: 7.5 },
  { ax: 0.15, ay: 0.9, az: 1.1, t: 12 },
]
for (const preset of ['volt', 'violet', 'magenta', 'emerald'])
  angles.forEach((a, i) => jobs.push({ name: `${preset}-${i + 1}`, preset, ...a, w: 1600, h: 1000, glow: 0.32 }))
jobs.push({ name: 'work-gocruze', preset: 'volt', ax: 1.35, ay: 0.1, az: 0.3, t: 5, w: 1600, h: 1100, glow: 0.3 })
jobs.push({ name: 'work-votezy', preset: 'violet', ax: 0.3, ay: 1.25, az: -0.2, t: 9, w: 1600, h: 1100, glow: 0.3 })
jobs.push({ name: 'hero-wide', preset: 'hero', ax: 0.55, ay: -0.35, az: 0.18, t: 3, w: 2400, h: 1350, glow: 0.16, dir: 'images' })
jobs.push({ name: 'hero-tall', preset: 'hero', ax: 0.55, ay: -0.35, az: 0.18, t: 3, w: 1080, h: 1620, glow: 0.16, dir: 'images' })

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
for (const j of jobs.filter((j) => !only || j.name.startsWith(only))) {
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h } })
  const q = new URLSearchParams({ preset: j.preset, t: j.t, ax: j.ax, ay: j.ay, az: j.az, glow: j.glow })
  await page.goto(`${base}?${q}`)
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 })
  const png = path.join(tmp, `${j.name}.png`)
  await page.screenshot({ path: png })
  await page.close()
  const dir = j.dir ? path.resolve('public', j.dir) : out
  const prefix = j.dir ? 'hero-' + j.name.slice(5) : j.name
  execFileSync('python3', ['scripts/renders/to_webp.py', png, path.join(dir, prefix)], { stdio: 'inherit' })
}
await browser.close()
