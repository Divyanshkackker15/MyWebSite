import { useEffect, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { scrollToTarget, useLenis } from '../motion/SmoothScroll'
import { EASE_OUT_EXPO } from '../motion/Reveal'

/**
 * Wraps every route. Handles the page transition and the scroll position.
 *
 * Transition (inside <AnimatePresence mode="wait"> in App):
 *   leaving page  → a dark curtain with an amber edge rises from the bottom
 *   entering page → the curtain lifts off the top, revealing the new page
 */
export function Page({ children }: { children: ReactNode }) {
  const { hash } = useLocation()
  const lenis = useLenis()

  // new page: jump to the #section in the URL, or to the top
  useEffect(() => {
    const id = decodeURIComponent(hash.replace('#', ''))
    if (id) {
      const jump = () => scrollToTarget(lenis, id, true)
      const t = window.setTimeout(jump, 60)
      // sections that change the page height after mounting (the pinned
      // Journey timeline) announce it, and we jump again to stay on target
      window.addEventListener('dk:layout-change', jump)
      const stop = window.setTimeout(() => window.removeEventListener('dk:layout-change', jump), 4000)
      return () => {
        clearTimeout(t)
        clearTimeout(stop)
        window.removeEventListener('dk:layout-change', jump)
      }
    }
    scrollToTarget(lenis, 0)
    // run once per mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <m.main
        id="main"
        tabIndex={-1}
        className="outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.25 } }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        {children}
      </m.main>
      <m.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[85] bg-[#0a0e18] shadow-[0_-2px_0_var(--color-amber),0_-30px_80px_-20px_rgba(255,181,71,0.35)]"
        initial={{ scaleY: 1, originY: 0 }}
        animate={{ scaleY: 0, originY: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } }}
        exit={{ scaleY: 1, originY: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } }}
      />
    </>
  )
}
