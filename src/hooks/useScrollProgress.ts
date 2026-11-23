import { useEffect, useRef } from 'react'

/**
 * Calls `onProgress(p)` with 0 → 1 as a tall element scrolls past a pinned
 * (sticky, 100vh) frame: 0 when its top reaches the top of the screen, 1 when
 * its bottom reaches the bottom. Runs in requestAnimationFrame, only while the
 * element is near the screen, and never re-renders React by itself.
 */
export function useScrollProgress<T extends HTMLElement>(onProgress: (p: number) => void) {
  const ref = useRef<T>(null)
  const cb = useRef(onProgress)
  cb.current = onProgress

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let near = false
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      cb.current(Math.min(1, Math.max(0, -r.top / (span || 1))))
    }
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting
      if (near) onScroll()
    }, { rootMargin: '50% 0px' })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return ref
}
