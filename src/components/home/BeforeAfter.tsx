import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { after, before, type Card } from '../../data/process'
import { asset } from '../../lib/asset'
import { useScrollProgress } from '../../hooks/useScrollProgress'

const Starfield = lazy(() => import('../motion/Starfield'))
const RingCanvas = lazy(() => import('../three/RingCanvas'))

/**
 * Before / After. A pinned starfield with the liquid ring in the middle.
 * Scrolling sends the "before" cards up past the title; halfway down, the
 * stars stretch into hyperspace, the title turns red to "After", and the
 * "after" cards follow. Card positions are written straight to the DOM.
 */
const SIDES = [-1, 1, -0.35]

function place(el: HTMLElement | null, t: number, side: number, mobile: boolean) {
  if (!el) return
  if (t <= 0 || t >= 1) {
    el.style.opacity = '0'
    el.style.visibility = 'hidden'
    return
  }
  const y = 62 - t * 132 // vh: from below the screen to above it
  const x = side * (mobile ? 9 : 21) // vw
  const rot = side * (11 - t * 15)
  el.style.visibility = 'visible'
  el.style.opacity = String(Math.min(1, t * 6, (1 - t) * 6))
  el.style.transform = `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}vh), 0) rotate(${rot}deg)`
}

function CardView({ card, tone, refFn }: { card: Card; tone: 'before' | 'after'; refFn: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={refFn} className={`ba-card ba-card--${tone}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="mono text-white">{card.title}.</p>
        <span aria-hidden="true" className="mono text-signal">[+]</span>
      </div>
      <p className="ba-card__body mono">{card.body}</p>
    </div>
  )
}

export function BeforeAfter() {
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const frame = useRef<HTMLDivElement>(null)
  const warp = useRef(0)
  const [live, setLive] = useState<'none' | 'stars' | 'ring'>('none')

  const wrap = useScrollProgress<HTMLDivElement>((p) => {
    // reduced motion: the section is a static stacked layout, nothing to move
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mobile = window.innerWidth < 768
    warp.current = Math.min(1, Math.max(0, (p - 0.44) / 0.1))
    frame.current?.classList.toggle('is-after', p >= 0.5)
    before.forEach((_, i) => place(cards.current[i], (p - 0.03 - i * 0.12) / 0.3, SIDES[i], mobile))
    after.forEach((_, i) => place(cards.current[3 + i], (p - 0.55 - i * 0.12) / 0.3, -SIDES[i], mobile))
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches
      let gl = false
      try {
        gl = Boolean(document.createElement('canvas').getContext('webgl2'))
      } catch {
        /* no WebGL */
      }
      setLive(desktop && gl ? 'ring' : 'stars')
      io.disconnect()
    }, { rootMargin: '100% 0px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [wrap])

  return (
    <section id="difference" aria-labelledby="ba-title" className="ba border-t border-line">
      <div ref={wrap} className="ba__track">
        <div ref={frame} className="ba__frame">
          {live !== 'none' && (
            <Suspense fallback={null}>
              <Starfield warpRef={warp} className="starfield absolute inset-0 h-full w-full" />
            </Suspense>
          )}
          <div className="ba__object" aria-hidden="true">
            {live === 'ring' ? (
              <Suspense fallback={null}>
                <RingCanvas className="absolute inset-0" />
              </Suspense>
            ) : (
              <img src={asset('images/hero-wide-sm.webp')} alt="" width={1200} height={675} loading="lazy" className="ba__still" />
            )}
          </div>

          <p className="mono ba__kicker text-grey">(03) The difference</p>
          <h2 id="ba-title" className="ba__title">
            <span className="ba__word ba__word--before">Before</span>
            <span className="ba__word ba__word--after">After</span>
            <span className="ba__slash">// Kackker</span>
          </h2>
          <p className="mono ba__caption ba__caption--before text-grey">(What most backends look like)</p>
          <p className="mono ba__caption ba__caption--after text-grey">(What I build instead)</p>

          {before.map((c, i) => (
            <CardView key={c.title} card={c} tone="before" refFn={(el) => (cards.current[i] = el)} />
          ))}
          <p className="ba__static-after" aria-hidden="true">
            <span className="text-signal">After</span> // Kackker
          </p>
          {after.map((c, i) => (
            <CardView key={c.title} card={c} tone="after" refFn={(el) => (cards.current[3 + i] = el)} />
          ))}
        </div>
      </div>
    </section>
  )
}
