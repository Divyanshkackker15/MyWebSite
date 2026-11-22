import { useEffect, useLayoutEffect, useState } from 'react'

/** useLayoutEffect in the browser, useEffect on the server (no SSR warning). */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Subscribe to a CSS media query. Returns `false` during SSR and the first
 * client render (so hydration matches), then the real value.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return matches
}

/** Mouse or trackpad (not touch): enables the custom cursor and magnetic buttons. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
