import { useLocation } from 'react-router-dom'
import { TLink } from './TLink'

const links = [
  { to: '/#blog', label: 'Blog' },
  { to: '/#process', label: 'Process' },
  { to: '/#contact', label: 'Contact' },
]

/** Minimal top bar. mix-blend-difference keeps it legible over images. */
export function Nav() {
  const { pathname } = useLocation()
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav aria-label="Main" className="wrap pointer-events-auto flex items-center justify-between py-5 md:py-6">
        <TLink to="/" className="nav__sig text-white" aria-label="Divyansh Kackker, home">
          D
        </TLink>
        <ul className="flex items-center gap-4 md:gap-9">
          {links.map((l) => {
            const active = l.to === '/#blog' ? pathname.startsWith('/blog') : false
            return (
              <li key={l.to}>
                <TLink to={l.to} className={`mono link pb-0.5 text-white ${active ? 'bg-[length:100%_1px]' : ''}`} aria-current={active ? 'page' : undefined}>
                  {l.label}
                </TLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
