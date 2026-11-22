import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'

/**
 * Lenis gives the whole site inertia-based smooth scrolling.
 * - Mouse wheel / trackpad: smoothed by Lenis.
 * - Touch devices: native scrolling (Lenis leaves touch alone by default).
 * - prefers-reduced-motion: Lenis is not started at all.
 *
 * The instance is shared through context so other parts (anchor links,
 * GSAP ScrollTrigger in the Journey section) can talk to it.
 */
const LenisContext = createContext<Lenis | null>(null)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const instance = new Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 1 })
    setLenis(instance)
    return () => instance.destroy()
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

const NAV_OFFSET = -72

/** Scroll to an element id (or the top), smoothly when allowed. */
export function scrollToTarget(lenis: Lenis | null, target: string | 0, immediate = false) {
  // Lenis caches the page height; after a route change it may still hold the
  // old page's height and clamp the scroll, so re-measure first.
  lenis?.resize()
  if (target === 0) {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    return
  }
  const el = document.getElementById(target)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: NAV_OFFSET, duration: immediate ? 0 : 1.3, immediate, force: true })
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const y = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET
    window.scrollTo({ top: y, behavior: reduce || immediate ? 'auto' : 'smooth' })
  }
}
