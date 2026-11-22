import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { profile } from '../../data/profile'
import { useBooted } from '../layout/Boot'
import { EASE_OUT_EXPO } from '../motion/Reveal'
import { HeroMesh } from '../three/HeroMesh'
import { Portrait } from '../ui/Portrait'
import { Magnetic } from '../motion/Magnetic'
import { SectionLink } from '../layout/SectionLink'

/**
 * Hero (ebuka-style split name).
 * Desktop: first name top-left, surname bottom-right over the photo, the 3D
 * service mesh behind the head, a status card on the right.
 * Phone: everything stacks; the mesh is a static SVG.
 *
 * Intro: waits for the preloader (useBooted), then letters rise out of
 * masks one by one. Scrolling away moves layers at different speeds (parallax).
 */
function Letters({ text, delay, play, className = '' }: { text: string; delay: number; play: boolean; className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden pb-[0.08em] ${className}`} aria-hidden="true">
      {text.split('').map((ch, i) => (
        <m.span
          key={i}
          className="inline-block"
          initial={{ y: '105%' }}
          animate={play ? { y: '0%' } : undefined}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: delay + i * 0.045 }}
        >
          {ch}
        </m.span>
      ))}
    </span>
  )
}

export function Hero() {
  const booted = useBooted()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const meshScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: booted ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
  })

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative isolate overflow-hidden pt-[72px] lg:min-h-[100svh]"
    >
      {/* background: faint grid + two coloured glows */}
      <div aria-hidden="true" className="grid-bg absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_60%_38%,rgba(255,181,71,0.13),transparent_70%),radial-gradient(35%_45%_at_15%_85%,rgba(79,209,255,0.08),transparent_70%)]"
      />

      <div className="container-x relative grid gap-8 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-0">
        {/* ---------- name + intro (left) ---------- */}
        <m.div style={{ y: nameY }} className="relative z-20 pt-10 lg:col-span-6 lg:row-start-1 lg:self-center lg:pt-0">
          <m.p {...fade(0.2)} className="label mb-5 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-ok text-ok animate-ping-soft" aria-hidden="true" />
            {profile.availability.label}
          </m.p>
          <h1 className="font-display font-extrabold leading-[0.86] tracking-[-0.055em] text-ink">
            <span className="sr-only">{profile.name}</span>
            <Letters text={profile.firstName} delay={0.05} play={booted} className="text-[clamp(3.6rem,15vw,7rem)] lg:text-[clamp(5rem,9.2vw,9.5rem)]" />
            <span className="block lg:hidden">
              <Letters
                text={profile.lastName}
                delay={0.25}
                play={booted}
                className="font-serif text-[clamp(3.8rem,15.5vw,7.2rem)] font-normal italic tracking-[-0.03em] text-amber"
              />
            </span>
          </h1>
          <m.p {...fade(0.45)} className="mt-6 max-w-[34ch] text-lg leading-snug text-ink md:text-xl">
            {profile.title}
            <span className="text-dim"> · {profile.tagline}</span>
          </m.p>
          <m.p {...fade(0.55)} className="mt-3 max-w-[42ch] text-dim">
            I build backends that perform reliably at scale: secure REST APIs, transactional data and event-driven microservices.
          </m.p>
          <m.div {...fade(0.65)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <SectionLink
                id="projects"
                className="group inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 text-[15px] font-medium text-void transition-shadow hover:shadow-[0_12px_40px_-10px_rgba(255,181,71,0.75)]"
              >
                View Work
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:rotate-[-45deg]" aria-hidden="true" />
              </SectionLink>
            </Magnetic>
            <Magnetic>
              <SectionLink
                id="contact"
                className="group inline-flex items-center gap-2 rounded-full border border-wire px-6 py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-cyan hover:text-cyan"
              >
                Hire Me
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </SectionLink>
            </Magnetic>
          </m.div>
        </m.div>

        {/* ---------- photo + mesh + ring ---------- */}
        <m.div
          style={{ y: photoY }}
          className="relative mx-auto aspect-[960/1166] w-full max-w-[420px] lg:absolute lg:bottom-0 lg:left-[58%] lg:mx-0 lg:w-[min(38vw,600px)] lg:max-w-none lg:-translate-x-1/2"
        >
          <m.div style={{ scale: meshScale, opacity: fadeOut }} className="absolute -inset-x-[30%] -top-[28%] bottom-[22%] -z-10">
            <HeroMesh className="absolute inset-0" />
          </m.div>
          {/* rotating dashed ring behind the head */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="animate-spin-slow absolute left-1/2 top-[3%] -z-10 w-[86%] -translate-x-1/2"
          >
            <circle cx="100" cy="100" r="96" fill="none" stroke="#1F2840" strokeWidth="5" strokeDasharray="1.5 4.2" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#4FD1FF" strokeOpacity="0.16" strokeWidth="0.4" />
          </svg>
          {/* amber glow behind shoulders */}
          <div aria-hidden="true" className="absolute inset-x-[10%] bottom-[8%] top-[30%] -z-10 rounded-full bg-amber/15 blur-[70px]" />
          <m.div
            initial={{ scale: 1.04 }}
            animate={booted ? { scale: 1 } : undefined}
            transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
            className="h-full w-full origin-bottom"
          >
            <Portrait
              priority
              className="h-full w-full select-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,#000_82%,transparent)]"
            />
          </m.div>
        </m.div>

        {/* ---------- status card (right) ---------- */}
        <m.aside
          {...fade(0.9)}
          aria-label="Currently"
          className="z-20 hidden self-start justify-self-end rounded-2xl border border-wire bg-hull/70 p-4 backdrop-blur-md lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:mt-[14vh] lg:block lg:w-[240px]"
        >
          <p className="label flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber text-amber animate-ping-soft" aria-hidden="true" />
            Now learning
          </p>
          <p className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">{profile.currentlyLearning}</p>
          <p className="mt-1 text-sm text-dim">Scalability, load balancing and caching with Redis.</p>
          <div className="mt-4 border-t border-wire pt-3">
            <p className="label">Based in</p>
            <p className="mt-1 text-sm text-ink">Bhopal, India</p>
          </div>
        </m.aside>

        {/* ---------- surname (bottom right, desktop) ---------- */}
        <div className="pointer-events-none relative z-20 hidden lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:block lg:justify-self-end lg:pb-6">
          <Letters
            text={profile.lastName}
            delay={0.3}
            play={booted}
            className="font-serif text-[clamp(5rem,10.5vw,11rem)] italic leading-[0.85] tracking-[-0.03em] text-amber [text-shadow:0_10px_50px_rgba(7,10,18,0.8)]"
          />
        </div>

        {/* ---------- scroll cue ---------- */}
        <div className="hidden lg:absolute lg:bottom-8 lg:left-10 lg:flex lg:items-center lg:gap-3" aria-hidden="true">
          <span className="relative block h-10 w-px overflow-hidden bg-wire">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-cyan" />
          </span>
          <span className="label">Scroll</span>
        </div>
      </div>
    </section>
  )
}
