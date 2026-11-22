import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { scrollToTarget, useLenis } from '../motion/SmoothScroll'

/**
 * Link to a home-page section ("/#projects").
 * On the home page it scrolls smoothly with Lenis; from another page it
 * navigates home and the Page component scrolls to the section.
 */
export function SectionLink({
  id,
  children,
  className,
  onNavigate,
}: {
  id: string
  children: ReactNode
  className?: string
  onNavigate?: () => void
}) {
  const { pathname } = useLocation()
  const lenis = useLenis()
  return (
    <Link
      to={`/#${id}`}
      className={className}
      onClick={(e) => {
        onNavigate?.()
        if (pathname === '/') {
          e.preventDefault()
          // next frame: lets the mobile menu close and un-pause scrolling first
          requestAnimationFrame(() => scrollToTarget(lenis, id))
          history.replaceState(null, '', `#${id}`)
        }
      }}
    >
      {children}
    </Link>
  )
}
