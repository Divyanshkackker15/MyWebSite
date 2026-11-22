import { flushSync } from 'react-dom'
import { Link, useLocation, useNavigate, type LinkProps } from 'react-router-dom'
import { preloadRoute } from '../../routes'
import { scrollToTarget, useLenis } from '../motion/SmoothScroll'

/**
 * Internal link with a page transition. Loads the next page's code first,
 * then swaps pages inside document.startViewTransition() so the browser
 * cross-fades old and new (styles in main.css). Same-page #links just
 * scroll. Browsers without View Transitions navigate normally.
 */
export function TLink({ to, onClick, ...props }: LinkProps & { to: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const lenis = useLenis()

  return (
    <Link
      to={to}
      {...props}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        const [path, hash] = to.split('#')
        const target = path || location.pathname
        if (target === location.pathname) {
          if (hash) {
            scrollToTarget(lenis, hash)
            history.replaceState(null, '', `#${hash}`)
          } else scrollToTarget(lenis, 0)
          return
        }
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        preloadRoute(target).then(() => {
          const go = () => flushSync(() => navigate(to))
          if (!document.startViewTransition || reduce) go()
          else document.startViewTransition(go)
        })
      }}
    />
  )
}
