import { useEffect, useRef } from 'react'
import { m, useScroll } from 'framer-motion'
import { journey } from '../../data/journey'
import { SectionHeader } from '../ui/SectionHeader'
import { useLenis } from '../motion/SmoothScroll'

/**
 * Journey timeline: Java → Spring Boot → Microservices → System Design.
 *
 * Desktop (GSAP ScrollTrigger): the section pins in place while you scroll;
 * a glowing path draws itself from step to step and each step lights up
 * when the path reaches it. `scrub` ties the animation to the scrollbar, so
 * scrolling back un-draws it.
 *
 * Phone / reduced motion: no pinning. A vertical line fills as you scroll
 * (Framer Motion) and all cards are readable at once.
 */
// node positions in the 1200 × 220 drawing (x, y)
const POINTS: [number, number][] = [
  [150, 170],
  [450, 60],
  [750, 170],
  [1050, 60],
]
const PATH = POINTS.reduce((d, [x, y], i) => {
  if (i === 0) return `M 0 ${y} L ${x} ${y}`
  const [px, py] = POINTS[i - 1]
  const mid = (px + x) / 2
  return `${d} C ${mid} ${py}, ${mid} ${y}, ${x} ${y}`
}, '') + ` L 1200 ${POINTS[POINTS.length - 1][1]}`

export function Journey() {
  const lenis = useLenis()
  const stage = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const glow = useRef<SVGPathElement>(null)
  const nodes = useRef<(HTMLSpanElement | null)[]>([])
  const cards = useRef<(HTMLLIElement | null)[]>([])
  const list = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 0.7', 'end 0.6'] })

  useEffect(() => {
    let cancelled = false
    let revert = () => {}
    const desktopMotion = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
    // phones and reduced-motion visitors never download GSAP at all
    if (!window.matchMedia(desktopMotion).matches) return
    ;(async () => {
      // GSAP is only downloaded when this section mounts on desktop
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled || !stage.current || !path.current) return
      gsap.registerPlugin(ScrollTrigger)
      const onScroll = () => ScrollTrigger.update()
      lenis?.on('scroll', onScroll)

      const mm = gsap.matchMedia()
      mm.add(desktopMotion, () => {
        const len = path.current!.getTotalLength()
        const lines = [path.current, glow.current]
        gsap.set(lines, { strokeDasharray: len, strokeDashoffset: len })
        gsap.set(nodes.current, { scale: 0.55, backgroundColor: '#1F2840' })
        // cards wait slightly lowered and faded (0.85 keeps text above WCAG contrast)
        gsap.set(cards.current, { opacity: 0.85, y: 28, filter: 'saturate(0.2)' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage.current,
            start: 'top top+=110',
            end: '+=1500',
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        })
        tl.to(lines, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
        POINTS.forEach(([x], i) => {
          const at = Math.max(0, x / 1200 - 0.03) // when the line reaches this x
          tl.to(nodes.current[i], { scale: 1, backgroundColor: i === POINTS.length - 1 ? '#FFB547' : '#4FD1FF', duration: 0.04 }, at)
          tl.to(cards.current[i], { opacity: 1, y: 0, filter: 'saturate(1)', duration: 0.12, ease: 'power2.out' }, at)
        })
      })
      // pinning adds scroll height: tell the page so a #hash jump can re-align
      ScrollTrigger.refresh()
      window.dispatchEvent(new Event('dk:layout-change'))
      revert = () => {
        mm.revert()
        lenis?.off('scroll', onScroll)
      }
    })()
    return () => {
      cancelled = true
      revert()
    }
  }, [lenis])

  return (
    <section id="journey" className="scroll-mt-20 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          id="journey"
          title={<>How I got <span className="font-serif font-normal italic text-amber">here</span>.</>}
          intro="Each step built on the one before. I'm in the fourth one now."
        />
      </div>

      <div ref={stage} className="container-x mt-14 lg:mt-20">
        {/* desktop: the drawn path with glowing nodes */}
        <div className="relative hidden aspect-[1200/220] lg:block" aria-hidden="true">
          <svg viewBox="0 0 1200 220" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="journey-line" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#4FD1FF" />
                <stop offset="0.75" stopColor="#4FD1FF" />
                <stop offset="1" stopColor="#FFB547" />
              </linearGradient>
              <filter id="journey-glow" x="-10%" y="-50%" width="120%" height="200%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            <path d={PATH} fill="none" stroke="#1F2840" strokeWidth="2" />
            <path ref={glow} d={PATH} fill="none" stroke="url(#journey-line)" strokeWidth="6" opacity="0.35" filter="url(#journey-glow)" />
            <path ref={path} d={PATH} fill="none" stroke="url(#journey-line)" strokeWidth="2.5" />
          </svg>
          {POINTS.map(([x, y], i) => (
            <span
              key={i}
              ref={(el) => {
                nodes.current[i] = el
              }}
              className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-void bg-cyan shadow-[0_0_0_1px_#1F2840,0_0_20px_rgba(79,209,255,0.6)] ${
                journey[i]?.current ? 'animate-ping-soft text-amber' : ''
              }`}
              style={{ left: `${(x / 1200) * 100}%`, top: `${(y / 220) * 100}%` }}
            />
          ))}
        </div>

        {/* the four steps (cards). On phones: vertical list with a filling line */}
        <ol ref={list} className="relative grid gap-6 pl-8 lg:mt-10 lg:grid-cols-4 lg:gap-6 lg:pl-0">
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-wire lg:hidden" />
          <m.span
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-cyan shadow-[0_0_10px_#4FD1FF] lg:hidden"
            style={{ scaleY: scrollYProgress }}
          />
          {journey.map((step, i) => (
            <li
              key={step.id}
              ref={(el) => {
                cards.current[i] = el
              }}
              className="relative rounded-2xl border border-wire bg-hull p-6"
            >
              <span
                aria-hidden="true"
                className={`absolute -left-[31px] top-7 h-3 w-3 rounded-full border-2 border-void lg:hidden ${step.current ? 'bg-amber' : 'bg-cyan'}`}
              />
              <div className="flex items-center justify-between">
                <span className="label text-cyan">Step {String(i + 1).padStart(2, '0')}</span>
                {step.current && (
                  <span className="rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-amber">
                    Learning now
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-dim">{step.note}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${step.title} topics`}>
                {step.topics.map((t) => (
                  <li key={t} className="rounded-md border border-wire px-2 py-1 font-mono text-[11px] text-ink/80">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
