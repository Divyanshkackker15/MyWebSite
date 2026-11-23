/**
 * Animated browser-tab mark. Most browsers show only the first frame of an
 * SVG favicon, so the "D" is drawn on a canvas and swapped in frame by frame:
 * once when the site opens and again when you come back to the tab after a
 * while. It then hands back to the static /favicon.svg. Skipped with reduced
 * motion.
 */
const SIZE = 64
const FRAMES = 26
const STATIC = '/favicon.svg'

function link() {
  return document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]')
}

function frame(ctx: CanvasRenderingContext2D, t: number) {
  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#0a0a0a'
  ctx.beginPath()
  ctx.roundRect(0, 0, SIZE, SIZE, 16)
  ctx.fill()
  const g = ctx.createLinearGradient(12, 6, 52, 58)
  g.addColorStop(0.02, '#8B6CF0')
  g.addColorStop(0.98, '#FFCE1F')
  ctx.strokeStyle = g
  ctx.lineWidth = 6.5
  ctx.lineJoin = 'round'
  const path = new Path2D('M21 15 H31 a17 17 0 0 1 0 34 H21 Z')
  const len = 130
  ctx.setLineDash([len * t, len])
  ctx.stroke(path)
}

let running = false

function play() {
  const el = link()
  if (!el || running) return
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx || typeof ctx.roundRect !== 'function') return
  running = true
  let i = 0
  const tick = () => {
    i++
    const t = i / FRAMES
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    frame(ctx, eased)
    el.href = canvas.toDataURL('image/png')
    if (i < FRAMES) window.setTimeout(tick, 40)
    else {
      el.href = STATIC
      running = false
    }
  }
  tick()
}

export function animateFavicon() {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  play()
  let hiddenAt = 0
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hiddenAt = Date.now()
    else if (hiddenAt && Date.now() - hiddenAt > 15000) play()
  })
}
