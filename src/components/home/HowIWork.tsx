import { useRef, useState } from 'react'
import { phases } from '../../data/process'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { scrollToTarget, useLenis } from '../motion/SmoothScroll'
import { TLink } from '../layout/TLink'

/**
 * How I Work: four phases in a pinned layout. Left, the list of phases;
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
      <header className="wrap pb-16 pt-[16vh] text-center md:pt-[20vh]">
        <p className="mono text-grey" data-reveal>(05) Process</p>
        <h2 id="process-title" className="display-l rise mt-6">
          <span className="line-mask"><span>How I Work.</span></span>
        </h2>
        <p className="mx-auto mt-8 max-w-[46ch] text-lg leading-relaxed text-grey" data-reveal style={{ '--d': 120 } as React.CSSProperties}>
          Software is a sequence of decisions. I make them in the open and in short cycles, so you always know what is being built, why,
          and what it will cost to change later.
        </p>
        <div aria-hidden="true" className="mx-auto mt-16 h-px max-w-3xl bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      </header>

      {/* large screens: pinned */}
      <div ref={track} className="process__track hidden lg:block">
        <div className="process__frame wrap">
          <nav aria-label="Phases" className="process__list frame">
            <p className="flex items-center justify-between px-5 pb-6 pt-5 text-white">
              <span className="title">Kackker</span>
              <span aria-hidden="true" className="mono text-grey">04</span>
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
