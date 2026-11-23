import { useEffect, useRef } from 'react'

/**
 * Stars flying gently towards the viewer. `warpRef.current` (0 → 1) stretches
 * them into hyperspace streaks and speeds them up. Canvas 2D, a few hundred
 * points, capped pixel ratio, paused whenever it's off-screen.
 */
export default function Starfield({ warpRef, className = '' }: { warpRef: React.RefObject<number>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const N = window.innerWidth < 768 ? 240 : 520
    let w = 0
    let h = 0
    let raf = 0
    let visible = false
    let warp = 0
    const stars = Array.from({ length: N }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }))

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = () => {
      raf = 0
      warp += ((warpRef.current ?? 0) - warp) * 0.08 // ease towards the target
      const speed = reduce ? 0 : 0.0016 + warp * 0.026
      const f = Math.max(w, h) * 0.5
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      ctx.lineCap = 'round'
      for (const s of stars) {
        s.z -= speed
        if (s.z <= 0.02) {
          s.x = Math.random() * 2 - 1
          s.y = Math.random() * 2 - 1
          s.z = 1
        }
        const px = cx + (s.x / s.z) * f
        const py = cy + (s.y / s.z) * f
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) continue
        const b = Math.min(1, (1 - s.z) * 1.4)
        if (warp > 0.05) {
          const tail = s.z + 0.02 + warp * 0.14
          const tx = cx + (s.x / tail) * f
          const ty = cy + (s.y / tail) * f
          ctx.strokeStyle = `rgba(245,245,245,${b * (0.35 + warp * 0.6)})`
          ctx.lineWidth = 0.6 + (1 - s.z) * 1.4
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(px, py)
          ctx.stroke()
        } else {
          ctx.fillStyle = `rgba(245,245,245,${b * 0.9})`
          const r = 0.4 + (1 - s.z) * 1.2
          ctx.fillRect(px - r / 2, py - r / 2, r, r)
        }
      }
      if (visible && !reduce) raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(draw)
    })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    return () => {
      visible = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [warpRef])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
