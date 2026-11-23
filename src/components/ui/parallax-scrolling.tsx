import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '../motion/SmoothScroll'

/**
 * Layered parallax header (adapted from Osmo's "Parallax Scrolling" via 21st.dev).
 *
 * Differences from the original snippet, on purpose:
 * - it reuses the site's one Lenis instance (SmoothScroll.tsx) instead of
 *   creating its own, so there are never two smooth-scrollers fighting;
 * - it kills only its own ScrollTrigger on unmount, not every trigger on the page;
 * - layers and content are props, so it works with real artwork;
 * - with reduced motion the layers simply stay put.
 *
 * Give it 3–5 transparent layers, back to front. `speed` is how far (in % of
 * its own height) a layer travels while the header scrolls out: far layers
 * move more, near layers less.
 *
 *   <ParallaxHeader layers={[{ src: '/images/sky.webp', speed: 70 }, …]} title="Blogging." />
 */
export interface ParallaxLayer {
  /** image for this layer; omit and pass `content` for text or custom markup */
  src?: string
  content?: ReactNode
  speed: number
  alt?: string
}

export function ParallaxHeader({
  layers,
  title,
  children,
  className = '',
}: {
  layers: ParallaxLayer[]
  title?: ReactNode
  children?: ReactNode
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>('[data-parallax-layers]')
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: '0% 0%', end: '100% 0%', scrub: 0 },
    })
    el.querySelectorAll<HTMLElement>('[data-parallax-layer]').forEach((layer, i) => {
      tl.to(layer, { yPercent: Number(layer.dataset.speed ?? 0), ease: 'none' }, i === 0 ? 0 : '<')
    })

    // keep ScrollTrigger in step with the shared Lenis instance
    const update = () => ScrollTrigger.update()
    lenis?.on('scroll', update)

    return () => {
      lenis?.off('scroll', update)
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [lenis])

  return (
    <div className={`parallax ${className}`} ref={root}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
            {layers.map((l, i) =>
              l.src ? (
                <img key={i} src={l.src} alt={l.alt ?? ''} data-parallax-layer data-speed={l.speed} className="parallax__layer-img" loading="eager" />
              ) : (
                <div key={i} data-parallax-layer data-speed={l.speed} className="parallax__layer-content">
                  {l.content}
                </div>
              ),
            )}
            {title && (
              <div data-parallax-layer data-speed={40} className="parallax__layer-title">
                <h2 className="parallax__title">{title}</h2>
              </div>
            )}
          </div>
          <div aria-hidden="true" className="parallax__fade" />
        </div>
      </section>
      {children && <section className="parallax__content">{children}</section>}
    </div>
  )
}
