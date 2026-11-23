import { useEffect, useRef } from 'react'

/**
 * Drifting light specks and the odd streak of light around the hero
 * portrait. Canvas 2D, about 80 particles, capped pixel ratio, and it stops
 * drawing whenever it is off-screen or the tab is hidden.
 */
const COLOURS = ['#f5f5f5', '#3d7bff', '#8b5cf6', '#e0409a']

export default function Particles({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = 0
    let h = 0
    let raf = 0
    let running = true
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const count = window.innerWidth < 768 ? 45 : 85

    type P = { x: number; y: number; r: number; vy: number; sway: number; phase: number; c: string; a: number }
    let ps: P[] = []
    let streak = { x: 0, y: 0, len: 0, life: 0 }

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const spawn = (anywhere: boolean): P => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.4 + 0.3,
      vy: Math.random() * 0.25 + 0.06,
      sway: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      c: COLOURS[(Math.random() * COLOURS.length) | 0],
      a: Math.random() * 0.6 + 0.25,
    })

    resize()
    ps = Array.from({ length: count }, () => spawn(true))

    const frame = (t: number) => {
      raf = 0
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.y -= p.vy
        const x = p.x + Math.sin(t / 2400 + p.phase) * 12 * p.sway
        if (p.y < -10) Object.assign(p, spawn(false))
        const fade = Math.min(1, p.y / (h * 0.25)) // fade out near the top
        ctx.globalAlpha = p.a * fade
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      // a light streak every few seconds, diagonally across the frame
      if (streak.life <= 0 && Math.random() < 0.006) streak = { x: Math.random() * w * 0.6, y: Math.random() * h * 0.5 + h * 0.2, len: 120 + Math.random() * 180, life: 1 }
      if (streak.life > 0) {
        streak.life -= 0.018
        streak.x += 9
        streak.y -= 3
        const g = ctx.createLinearGradient(streak.x - streak.len, streak.y + streak.len / 3, streak.x, streak.y)
        g.addColorStop(0, 'rgba(61,123,255,0)')
        g.addColorStop(1, `rgba(224,64,154,${0.55 * streak.life})`)
        ctx.globalAlpha = 1
        ctx.strokeStyle = g
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(streak.x - streak.len, streak.y + streak.len / 3)
        ctx.lineTo(streak.x, streak.y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (!raf && running) raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !document.hidden
      if (running) start()
    })
    io.observe(canvas)
    const vis = () => {
      running = !document.hidden
      if (running) start()
    }
    document.addEventListener('visibilitychange', vis)
    window.addEventListener('resize', resize)
    start()
    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', vis)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
