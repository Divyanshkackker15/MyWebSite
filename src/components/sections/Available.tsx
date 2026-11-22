import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Download } from 'lucide-react'
import { profile } from '../../data/profile'
import { services } from '../../data/services'
import { sectionNumber } from '../../data/sections'
import { WordReveal } from '../motion/WordReveal'
import { Reveal } from '../motion/Reveal'
import { Portrait } from '../ui/Portrait'
import { Magnetic } from '../motion/Magnetic'
import { SectionLink } from '../layout/SectionLink'

/**
 * "Available for work" (inspired by the section after Honey's hero).
 * A rounded panel rises over an amber glow as you scroll in, the headline
 * lights up word by word, and a magnetic CTA leads to Contact.
 */
export function Available() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const y = useTransform(scrollYProgress, [0, 1], [140, 0])
  const radius = useTransform(scrollYProgress, [0, 1], [56, 32])
  const glow = useTransform(scrollYProgress, [0, 1], [0.35, 1])

  return (
    <section ref={ref} id="available" className="relative scroll-mt-20 pt-16">
      <m.div
        aria-hidden="true"
        style={{ opacity: glow }}
        className="pointer-events-none absolute inset-x-0 -top-32 h-[70%] bg-[radial-gradient(50%_45%_at_50%_30%,rgba(255,181,71,0.22),transparent_100%)]"
      />
      <div className="container-x relative">
        <m.div
          style={{ y, borderRadius: radius }}
          className="relative overflow-hidden border border-wire bg-hull px-5 py-10 md:px-12 md:py-16"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-wire pb-5">
            <span className="flex items-center gap-4">
              <span className="label text-cyan">{sectionNumber('available')}</span>
              <span className="label">Availability</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ok">
              <span className="h-1.5 w-1.5 rounded-full bg-ok text-ok animate-ping-soft" aria-hidden="true" />
              {profile.availability.label}
            </span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-8 lg:col-span-8">
              <WordReveal
                as="h2"
                className="font-display text-[clamp(2.4rem,6.2vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink"
                text="I'm available for work and freelance projects."
                accent={['freelance']}
                offset={['start 0.85', 'start 0.35']}
              />
              <Reveal>
                <p className="max-w-[52ch] text-lg leading-relaxed text-dim">
                  Need a reliable backend for your product? I design and build secure, well-tested Spring Boot APIs, from
                  the first database table to a Dockerised deployment. Open to work and freelance projects.
                </p>
              </Reveal>
              <Reveal className="flex flex-wrap items-center gap-3">
                <Magnetic strength={0.4}>
                  <SectionLink
                    id="contact"
                    className="group inline-flex items-center gap-3 rounded-full bg-amber py-4 pl-7 pr-4 text-base font-medium text-void transition-shadow hover:shadow-[0_16px_50px_-12px_rgba(255,181,71,0.85)]"
                  >
                    Start a project
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-void text-amber transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </SectionLink>
                </Magnetic>
                <a
                  href={profile.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-wire px-5 py-3.5 text-sm text-ink transition-colors hover:border-cyan hover:text-cyan"
                >
                  <Download className="h-4 w-4" aria-hidden="true" /> Download résumé
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="lg:col-span-4">
              <figure className="relative mx-auto aspect-[3/4] max-w-[340px] overflow-hidden rounded-[999px_999px_28px_28px] border border-wire bg-[radial-gradient(90%_70%_at_50%_25%,#1d2742,#0a0e18_75%)]">
                <Portrait
                  sizes="(min-width: 1024px) 26vw, 80vw"
                  className="absolute bottom-0 left-1/2 w-[118%] max-w-none -translate-x-1/2 object-contain"
                />
                <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl border border-wire bg-void/80 px-4 py-3 backdrop-blur-md">
                  <p className="label">Based in</p>
                  <p className="text-sm text-ink">Bhopal, India</p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* services row (Honey's list of disciplines) */}
          <div className="mt-14 border-t border-wire pt-8">
            <p className="label">What I can help with</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {services.map((s, i) => (
                <m.li
                  key={s}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="rounded-full border border-wire px-4 py-2.5 text-[15px] text-ink transition-colors duration-300 hover:border-amber hover:bg-amber hover:text-void"
                >
                  {s}
                </m.li>
              ))}
            </ul>
          </div>
        </m.div>
      </div>
    </section>
  )
}
