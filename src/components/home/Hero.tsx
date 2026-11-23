import { lazy, Suspense, useEffect, useState } from 'react'
import { profile } from '../../data/profile'
import { PortraitStage } from './PortraitStage'

const Particles = lazy(() => import('../motion/Particles'))

/**
 * Hero: the colour portrait on black, a dotted ring drawing around the
 * head, drifting light particles, and the name set huge on both sides.
 * Everything here animates with CSS from first paint; only the particles
 * need JavaScript, and they load after the page is idle.
 */
export function Hero() {
  const [particles, setParticles] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const delay = document.documentElement.classList.contains('intro-play') ? 2600 : 200
    const t = window.setTimeout(() => setParticles(true), delay)
    return () => clearTimeout(t)
  }, [])

  return (
    <section aria-label="Introduction" className="hero relative h-[100svh] min-h-[600px] overflow-hidden">
      <PortraitStage className="hero__stage" colourClass="hero__colour" mono={false} />

      {particles && (
        <Suspense fallback={null}>
          <Particles className="pointer-events-none absolute inset-0 h-full w-full" />
        </Suspense>
      )}

      {/* dotted ring around the head */}
      <svg aria-hidden="true" className="hero__ring" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="0.1 5.4" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="0.1 2.6" opacity="0.5" />
      </svg>

      {/* fade into the page below */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-black via-black/75 to-transparent" />

      <div className="hero-type absolute inset-0">
        <h1 className="sr-only">
          {profile.name}, Java backend developer. I build the parts of software nobody sees.
        </h1>
        <div className="hero__left">
          <div aria-hidden="true" className="hero__name rise-now">
            <span className="line-mask"><span>{profile.firstName}</span></span>
          </div>
          <p className="hero__meta mono fade-now text-grey" style={{ '--i': 4 } as React.CSSProperties}>
            Java backend developer
            <br />
            {profile.location}
          </p>
        </div>
        <div className="hero__right">
          <p aria-hidden="true" className="hero__line fade-now" style={{ '--i': 3 } as React.CSSProperties}>
            I build the parts of software nobody sees.
          </p>
          <div aria-hidden="true" className="hero__name rise-now" style={{ '--i': 2 } as React.CSSProperties}>
            <span className="line-mask"><span>{profile.lastName}</span></span>
          </div>
        </div>
        <p className="hero__scroll mono fade-now text-grey" style={{ '--i': 5 } as React.CSSProperties}>
          Scroll <span aria-hidden="true" className="scroll-cue ml-2 inline-block">↓</span>
        </p>
      </div>
    </section>
  )
}
