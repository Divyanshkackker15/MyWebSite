import { ArrowUpRight } from 'lucide-react'
import { experience } from '../../data/experience'
import { hasLink } from '../../data/profile'
import { sectionNumber } from '../../data/sections'
import { Reveal } from '../motion/Reveal'

/** Sticky heading on the left, role cards scroll past on the right. */
export function Experience() {
  return (
    <section id="experience" className="container-x scroll-mt-20 py-24 md:py-32">
      <div className="flex items-center gap-4 border-t border-wire pt-4">
        <span className="label text-cyan">{sectionNumber('experience')}</span>
        <span className="label">Experience</span>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,5.4vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
                Where I've <span className="font-serif font-normal italic text-amber">shipped</span>.
              </h2>
              <p className="mt-4 max-w-[40ch] text-lg text-dim">
                An internship and a lead role, both delivered in short agile iterations.
              </p>
            </Reveal>
          </div>
        </div>
        <ol className="grid gap-5 lg:col-span-7">
          {experience.map((r, i) => (
            <li key={r.id}>
              <Reveal delay={i * 0.05} className="group relative overflow-hidden rounded-3xl border border-wire bg-hull p-6 transition-colors duration-500 hover:border-cyan/40 md:p-8">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-cyan via-cyan/40 to-transparent" />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{r.org}</h3>
                    <p className="mt-1 text-ink/80">{r.role}</p>
                  </div>
                  <p className="label rounded-full border border-wire px-3 py-1.5">{r.period}</p>
                </div>
                <ul className="mt-6 grid gap-3">
                  {r.points.map((pt) => (
                    <li key={pt} className="relative pl-5 leading-relaxed text-dim">
                      <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rotate-45 bg-amber" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <ul className="flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <li key={t} className="rounded-md border border-wire px-2 py-1 font-mono text-[11px] text-ink/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                  {hasLink(r.certificate) && (
                    <a
                      href={r.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-cyan hover:text-amber"
                    >
                      View certificate <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
