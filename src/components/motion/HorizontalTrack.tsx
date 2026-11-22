import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Vertical scrolling moves a row of panels sideways (desktop only).
 * The section gets exactly enough height for the row to travel its full
 * width, its inner frame is `position: sticky`, and the row's translateX
 * follows scroll progress. On touch screens and for reduced motion it's a
 * plain swipeable row with scroll snapping.
 */
export function HorizontalTrack({ children, header }: { children: ReactNode; header?: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const o = outer.current
    const r = row.current
    if (!o || !r) return
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)')
    let distance = 0
    let raf = 0

    const measure = () => {
      if (!mq.matches) {
        o.style.height = ''
        r.style.transform = ''
        o.dataset.mode = 'swipe'
        return
      }
      o.dataset.mode = 'pin'
      distance = Math.max(0, r.scrollWidth - window.innerWidth)
      o.style.height = `${window.innerHeight + distance}px`
      update()
    }
    const update = () => {
      raf = 0
      if (!mq.matches) return
      const top = o.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, -top / (distance || 1)))
      r.style.transform = `translate3d(${-p * distance}px, 0, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(r)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    mq.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
      mq.removeEventListener('change', measure)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={outer} className="htrack relative" data-mode="swipe">
      <div className="htrack__frame">
        {header}
        <div className="htrack__viewport">
          <div ref={row} className="htrack__row">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
