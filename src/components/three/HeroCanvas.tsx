import { useEffect, useRef, useState } from 'react'
import { LiquidCanvas } from './Liquid'

/**
 * Live hero scene (loaded lazily, desktop only). Follows the pointer,
 * drifts up and shrinks as the hero scrolls away, and stops rendering
 * entirely when the hero is off-screen or the tab is hidden.
 */
export default function HeroCanvas({ section, onReady }: { section: React.RefObject<HTMLElement | null>; onReady: () => void }) {
  const scroll = useRef(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = section.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const h = el.offsetHeight || 1
      scroll.current = Math.min(1, Math.max(0, window.scrollY / h))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !document.hidden), { threshold: 0 })
    io.observe(el)
    const vis = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0)
    document.addEventListener('visibilitychange', vis)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', vis)
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [section])

  return (
    <LiquidCanvas
      className="!absolute inset-0"
      preset="hero"
      interactive
      scrollRef={scroll}
      frameloop={visible ? 'always' : 'never'}
      onReady={onReady}
    />
  )
}
