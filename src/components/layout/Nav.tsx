import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'framer-motion'
import { profile } from '../../data/profile'
import { SectionLink } from './SectionLink'
import { Magnetic } from '../motion/Magnetic'
import { EASE_OUT_EXPO } from '../motion/Reveal'
import { useLenis } from '../motion/SmoothScroll'

const links = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'projects', label: 'Work' },
  { id: 'available', label: 'Services' },
]

/** Top bar: hides while scrolling down, comes back when scrolling up. */
export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const lenis = useLenis()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 160 && !open)
    setScrolled(y > 24)
  })

  // close the mobile menu on route change; lock scroll while it's open
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open, lenis])

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[120] -translate-y-20 rounded-full bg-amber px-4 py-2 text-sm font-medium text-void focus:translate-y-0"
      >
        Skip to content
      </a>
      <m.header
        className="fixed inset-x-0 top-0 z-[60] pt-[env(safe-area-inset-top,0px)]"
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      >
        <div
          className={`container-x flex h-[72px] items-center justify-between gap-6 transition-[background-color,backdrop-filter,border-color] duration-500 ${
            scrolled ? 'bg-void/70 backdrop-blur-xl' : ''
          }`}
        >
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-wire bg-hull font-display text-sm font-bold tracking-tight text-ink transition-colors group-hover:border-amber group-hover:text-amber">
              DK
            </span>
            <span className="hidden font-mono text-[11px] uppercase leading-tight tracking-[0.1em] text-ink sm:block">
              Divyansh Kackker
              <br />
              <span className="text-dim">Java · Spring Boot</span>
            </span>
            <span className="sr-only sm:hidden">{profile.name}, home</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <SectionLink
                key={l.id}
                id={l.id}
                className="rounded-full px-4 py-2 text-sm text-dim transition-colors hover:text-ink"
              >
                {l.label}
              </SectionLink>
            ))}
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition-colors hover:text-ink ${isActive ? 'text-amber' : 'text-dim'}`
              }
            >
              Blog
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Magnetic className="hidden sm:inline-block">
              <SectionLink
                id="contact"
                className="inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-medium text-void transition-shadow hover:shadow-[0_10px_30px_-8px_rgba(255,181,71,0.7)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-void/70" aria-hidden="true" />
                Hire me
              </SectionLink>
            </Magnetic>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-wire text-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300 ${open ? 'translate-y-1.5 rotate-45' : ''}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
                />
              </span>
            </button>
          </div>
        </div>
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-[55] flex flex-col justify-between bg-void px-6 pb-10 pt-28 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <nav aria-label="Mobile" className="grid gap-2">
              {[...links, { id: 'contact', label: 'Contact' }].map((l, i) => (
                <m.div
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE_OUT_EXPO }}
                >
                  <SectionLink
                    id={l.id}
                    onNavigate={() => setOpen(false)}
                    className="font-display text-5xl font-semibold tracking-[-0.03em] text-ink"
                  >
                    {l.label}
                  </SectionLink>
                </m.div>
              ))}
              <m.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <Link to="/blog" className="font-display text-5xl font-semibold tracking-[-0.03em] text-amber">
                  Blog
                </Link>
              </m.div>
            </nav>
            <p className="label">{profile.location}</p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
