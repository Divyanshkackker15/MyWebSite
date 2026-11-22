import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { phases, type Phase } from '../../data/services'
import { sectionNumber } from '../../data/sections'
import { Reveal } from '../motion/Reveal'

/**
 * The 4-phase sprint (inspired by Honey's "How we work").
 * One big centred headline, then each phase as a huge title. A phase is
 * brightest when it crosses the middle of the screen and dims as it leaves,
 * so the eye moves down the story 01 → 04. A cyan connector grows between
 * phases with scroll.
 */
export function Process() {
  return (
    <section id="process" className="container-x scroll-mt-20 py-24 md:py-36">
      <div className="flex items-center justify-between gap-4 border-t border-wire pt-4">
        <span className="flex items-center gap-4">
          <span className="label text-cyan">{sectionNumber('process')}</span>
          <span className="label">How I work</span>
        </span>
        <span className="label hidden sm:block">(Four phases · one clear process)</span>
      </div>

      <Reveal className="mx-auto mt-16 grid justify-items-center text-center">
        <p className="mb-6 inline-flex rounded-md bg-amber px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-void">
          How I work
        </p>
        <h2 className="max-w-[13ch] font-display text-[clamp(2.4rem,6.6vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">
          From one problem to a <span className="font-serif font-normal italic text-amber">shipped</span> API.
        </h2>
      </Reveal>

      <ol className="mx-auto mt-20 grid max-w-[880px] md:mt-28">
        {phases.map((phase, i) => (
          <PhaseItem key={phase.id} phase={phase} index={i} last={i === phases.length - 1} />
        ))}
      </ol>
    </section>
  )
}

function PhaseItem({ phase, index, last }: { phase: Phase; index: number; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null)
  const reduced = useReducedMotion()
  // 0 = item entering at the bottom, 0.5 = centred, 1 = leaving at the top
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // floors chosen so even the dimmed state passes WCAG AA contrast
  const opacity = useTransform(scrollYProgress, [0.1, 0.45, 0.6, 0.95], [0.65, 1, 1, 0.65])
  const titleColor = useTransform(scrollYProgress, [0.25, 0.45], ['#8C95AB', '#E9EDF5'])
  const line = useTransform(scrollYProgress, [0.45, 0.85], [0, 1])

  return (
    <m.li ref={ref} style={{ opacity: reduced ? 1 : opacity }} className="relative pb-20 text-center md:pb-28">
      <div className="relative inline-flex items-start gap-2">
        <span className="mt-2 font-mono text-xs text-amber md:mt-4">{String(index + 1).padStart(2, '0')}</span>
        <m.h3
          style={{ color: reduced ? '#E9EDF5' : titleColor }}
          className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
        >
          {phase.title}
        </m.h3>
      </div>
      <p className="mt-4 font-serif text-2xl italic text-ink md:text-3xl">{phase.promise}</p>
      <div className="mx-auto mt-6 h-px w-full max-w-[560px] bg-wire" aria-hidden="true" />
      <p className="mx-auto mt-6 max-w-[56ch] font-mono text-[13px] uppercase leading-[1.8] tracking-[0.06em] text-ink/80">
        {phase.body}
      </p>
      {!last && (
        <span aria-hidden="true" className="absolute bottom-3 left-1/2 h-12 w-px -translate-x-1/2 bg-wire md:h-16">
          <m.span
            className="absolute inset-0 origin-top bg-cyan shadow-[0_0_10px_#4FD1FF]"
            style={{ scaleY: reduced ? 1 : line }}
          />
        </span>
      )}
    </m.li>
  )
}
