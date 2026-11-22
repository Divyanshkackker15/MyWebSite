import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { asset } from '../../lib/asset'
import { profile } from '../../data/profile'

const HeroCanvas = lazy(() => import('../three/HeroCanvas'))

/** Live 3D only where it will run well: a mouse, a large screen, WebGL2, motion allowed. */
function canRun3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches) return false
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory < 4)) return false
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}

const lines = ['I build the parts', 'of software nobody sees.']

export function Hero() {
  const [live, setLive] = useState(false)
  const [ready, setReady] = useState(false)
  const section = useRef<HTMLElement>(null)

  // start the 3D scene once the page is idle (after the intro on a first visit)
  useEffect(() => {
    if (!canRun3D()) return
    const delay = document.documentElement.classList.contains('intro-play') ? 2600 : 300
    const t = window.setTimeout(() => {
      const start = () => setLive(true)
      if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1500 })
      else start()
    }, delay)
    return () => clearTimeout(t)
  }, [])

  return (
    <section ref={section} aria-label="Introduction" className="relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* still render: shown on phones, without WebGL, and until the live scene is ready */}
      <picture className={`absolute inset-0 transition-opacity duration-[1200ms] ${ready ? 'opacity-0' : 'opacity-100'}`}>
        <source media="(orientation: portrait)" srcSet={`${asset('images/hero-tall-sm.webp')} 540w, ${asset('images/hero-tall.webp')} 1080w`} sizes="100vw" />
        <img
          src={asset('images/hero-wide.webp')}
          srcSet={`${asset('images/hero-wide-sm.webp')} 1200w, ${asset('images/hero-wide.webp')} 2400w`}
          sizes="100vw"
          alt=""
          width={2400}
          height={1350}
          fetchPriority="high"
          className="hero-still h-full w-full object-cover"
        />
      </picture>

      {live && (
        <div className={`absolute inset-0 transition-opacity duration-[1200ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <div aria-hidden="true" className="hero-glow absolute inset-0" />
          <Suspense fallback={null}>
            <HeroCanvas section={section} onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}

      {/* fade into the page below */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="hero-type wrap absolute inset-x-0 bottom-0 pb-8 md:pb-12">
        <h1 className="display-hero rise-now text-center">
          <span className="sr-only">{profile.name}: </span>
          {lines.map((l, i) => (
            <span key={l} className="line-mask" style={{ '--i': i } as React.CSSProperties}>
              <span className="ink-fade">{l}</span>
            </span>
          ))}
        </h1>
        <div className="mt-8 flex items-end justify-between gap-6 md:mt-10">
          <p className="mono fade-now max-w-[24ch] text-grey" style={{ '--i': 3 } as React.CSSProperties}>
            {profile.name}
            <br />
            Java backend developer, writing from {profile.location.split(',')[0]}
          </p>
          <p className="mono fade-now text-right text-grey" style={{ '--i': 4 } as React.CSSProperties}>
            Scroll
            <span aria-hidden="true" className="scroll-cue ml-2 inline-block">↓</span>
          </p>
        </div>
      </div>
    </section>
  )
}
