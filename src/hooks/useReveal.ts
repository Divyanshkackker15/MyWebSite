import { useEffect } from 'react'

/**
 * Scroll reveals for the whole page with one IntersectionObserver.
 * Mark elements with `data-reveal` (rise + fade), `data-reveal="clip"`
 * (image wipe) or class `rise` (headline lines out of a mask); add
 * style={{ '--d': 200 }} for a delay in ms. Re-scans on every route.
 *
 * A fully clipped element never counts as visible, so for wipes the
 * parent is observed instead.
 */
export function useReveal(pathname: string) {
  useEffect(() => {
    const targets = new Map<Element, Element[]>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          targets.get(e.target)?.forEach((el) => el.classList.add('is-in'))
          targets.delete(e.target)
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )
    const scan = () =>
      document.querySelectorAll('[data-reveal]:not(.is-in), .rise:not(.is-in)').forEach((el) => {
        const watch = el.getAttribute('data-reveal') === 'clip' && el.parentElement ? el.parentElement : el
        const list = targets.get(watch)
        if (list?.includes(el)) return
        targets.set(watch, [...(list ?? []), el])
        io.observe(watch)
      })
    scan()
    // content that mounts a moment later (filtered lists, article bodies)
    const mo = new MutationObserver(scan)
    mo.observe(document.getElementById('main') ?? document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
}
