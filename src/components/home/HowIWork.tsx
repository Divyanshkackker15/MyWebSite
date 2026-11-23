import { useRef, useState } from 'react'
import { phases } from '../../data/process'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { scrollToTarget, useLenis } from '../motion/SmoothScroll'
import { TLink } from '../layout/TLink'

/**
 * How We Sprint: four phases in a pinned layout. Left, the list of phases;
 * right, the active phase in a bracketed card above its painting. Scrolling
 * moves through the phases (about a quarter of the section each), and
 * clicking a phase scrolls to it. Below 1024px it's a simple stacked list.
 */
export function HowIWork() {
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const lenis = useLenis()

  const track = useScrollProgress<HTMLDivElement>((p) => {
    const i = Math.min(phases.length - 1, Math.floor(p * phases.length * 0.999))
    if (i !== activeRef.current) {
      activeRef.current = i
      setActive(i)
    }
  })

  const go = (i: number) => {
    const el = track.current
    if (!el) return
    const span = el.offsetHeight - window.innerHeight
    const y = el.getBoundingClientRect().top + window.scrollY + span * ((i + 0.5) / phases.length)
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section id="process" aria-labelledby="process-title" className="border-t border-line">
      <div className="wrap process__topline mono pt-24 text-grey" data-reveal>
        <span>[ <em>04</em> / <em>05</em> ]</span>
        <span>How we sprint</span>
      </div>
      <header className="wrap pb-16 pt-[8vh] text-center md:pt-[10vh]">
        <h2 id="process-title" className="process__title rise">
          <span className="line-mask"><span>How We Sprint</span></span>
        </h2>
        <p className="mx-auto mt-8 max-w-[52ch] text-lg leading-relaxed text-grey" data-reveal style={{ '--d': 120 } as React.CSSProperties}>
          I work in two-week sprints. Short enough to keep momentum and change course cheaply, long enough to build something worth
          showing at the end of each one.
        </p>
        <div aria-hidden="true" className="mx-auto mt-14 h-px max-w-3xl bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      </header>

      {/* large screens: pinned */}
      <div ref={track} className="process__track hidden lg:block">
        <div className="process__frame wrap">
         <div className="process__shell">
          <nav aria-label="Phases" className="process__list">
            <p className="flex items-center justify-between px-5 pb-8 pt-7 text-white">
              <span className="title">Kackker</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20" className="text-white">
                <circle cx="6" cy="6" r="4" fill="currentColor" />
                <circle cx="14" cy="7" r="3.4" fill="currentColor" />
                <circle cx="7" cy="14" r="3.4" fill="currentColor" />
                <circle cx="14.5" cy="14.5" r="4" fill="currentColor" />
              </svg>
            </p>
            <ol className="grid gap-2 px-3 pb-3">
              {phases.map((ph, i) => (
                <li key={ph.n}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={active === i ? 'step' : undefined}
                    className={`process__item ${active === i ? 'is-active' : ''}`}
                  >
                    <span className="process__dot" style={{ '--dot': ph.dot } as React.CSSProperties} />
                    Phase {ph.n}: {ph.name}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="process__stage">
            <div className="process__card">
              <span aria-hidden="true" className="bracket bracket--tl" />
              <span aria-hidden="true" className="bracket bracket--tr" />
              <span aria-hidden="true" className="bracket bracket--bl" />
              <span aria-hidden="true" className="bracket bracket--br" />
              {phases.map((ph, i) => (
                <div key={ph.n} className={`process__text ${active === i ? 'is-active' : ''}`} aria-hidden={active !== i}>
                  <h3 className="title text-white">{ph.n}. {ph.name}</h3>
                  <p className="mono mt-4 leading-[1.9] text-grey">{ph.body}</p>
                </div>
              ))}
            </div>
            <figure className="process__art">
              {phases.map((ph, i) => (
                <img
                  key={ph.n}
                  src={`${ph.image}.webp`}
                  srcSet={`${ph.image}-sm.webp 800w, ${ph.image}.webp 1600w`}
                  sizes="50vw"
                  alt={active === i ? ph.credit : ''}
                  width={1600}
                  height={1200}
                  loading="lazy"
                  className={active === i ? 'is-active' : ''}
                />
              ))}
              <figcaption className="mono">{phases[active].credit} · Public domain</figcaption>
            </figure>
          </div>
         </div>
        </div>
      </div>

      {/* small screens: stacked */}
      <ol className="wrap grid gap-20 pb-8 lg:hidden">
        {phases.map((ph) => (
          <li key={ph.n} className="grid gap-6">
            <div className="process__card" data-reveal>
              <span aria-hidden="true" className="bracket bracket--tl" />
              <span aria-hidden="true" className="bracket bracket--tr" />
              <span aria-hidden="true" className="bracket bracket--bl" />
              <span aria-hidden="true" className="bracket bracket--br" />
              <p className="mono flex items-center gap-2 text-grey">
                <span className="process__dot" style={{ '--dot': ph.dot } as React.CSSProperties} /> Phase {ph.n}
              </p>
              <h3 className="title mt-3 text-white">{ph.name}</h3>
              <p className="mono mt-4 leading-[1.9] text-grey">{ph.body}</p>
            </div>
            <figure className="process__art process__art--static" data-reveal="clip">
              <img src={`${ph.image}-sm.webp`} srcSet={`${ph.image}-sm.webp 800w, ${ph.image}.webp 1600w`} sizes="92vw" alt={ph.credit} width={1600} height={1200} loading="lazy" />
            </figure>
            <p className="mono -mt-3 text-mute">{ph.credit} · Public domain</p>
          </li>
        ))}
      </ol>

      <div className="wrap py-[16vh] text-center">
        <p className="mono text-grey" data-reveal>Available for full-time roles &amp; freelance projects</p>
        <TLink
          to="/#contact"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault()
              scrollToTarget(lenis, 'contact')
            }
          }}
          className="group mt-6 inline-block"
        >
          <span className="display-l rise block">
            <span className="line-mask"><span>Let’s build together <span className="inline-block text-signal transition-transform duration-500 group-hover:translate-x-3">→</span></span></span>
          </span>
        </TLink>
      </div>
    </section>
  )
}
