import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TLink } from './TLink'
import { ThemeToggle } from '../ui/theme-toggle'

const links = [
  { to: '/#blog', label: 'Blog' },
  { to: '/#process', label: 'Process' },
  { to: '/#contact', label: 'Contact' },
]

/**
 * Glass top bar. At the top of the page it spans the layout; once you scroll
 * it tightens into a floating pill, slides away while you read downwards and
 * comes back as soon as you scroll up.
 */
export function Nav() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        setScrolled(y > 24)
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 640)
          last = y
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // keyboard users always get the bar back
  const reveal = () => setHidden(false)

  return (
    <header className={`gnav ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`} onFocusCapture={reveal}>
      <nav aria-label="Main" className="gnav__bar">
        <TLink to="/" className="gnav__brand" aria-label="Divyansh Kackker, home">
          <span className="nav__sig">D</span>
          <span className="gnav__status mono" aria-hidden="true">
            <span className="gnav__dot" /> Available for work
          </span>
        </TLink>
        <ul className="gnav__links">
          {links.map((l) => {
            const active = l.to === '/#blog' ? pathname.startsWith('/blog') : false
            return (
              <li key={l.to}>
                <TLink to={l.to} className={`mono link pb-0.5 ${active ? 'bg-[length:100%_1px]' : ''}`} aria-current={active ? 'page' : undefined}>
                  {l.label}
                </TLink>
              </li>
            )
          })}
        </ul>
        <div className="gnav__actions">
          <ThemeToggle />
          <TLink to="/#contact" className="gnav__cta mono">Get in touch</TLink>
        </div>
      </nav>
    </header>
  )
}
