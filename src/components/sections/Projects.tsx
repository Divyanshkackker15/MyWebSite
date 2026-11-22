import { useId, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { projects } from '../../data/projects'
import { hasLink } from '../../data/profile'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal, EASE_OUT_EXPO } from '../motion/Reveal'
import { RequestFlow } from './RequestFlow'
import { BrandIcon } from '../ui/BrandIcon'
import { Magnetic } from '../motion/Magnetic'

/** Projects as ebuka-style case studies: headline result, live diagram, stat tiles, expandable details. */
export function Projects() {
  return (
    <section id="projects" className="container-x scroll-mt-20 py-24 md:py-32">
      <SectionHeader
        id="projects"
        title={<>Selected <span className="font-serif font-normal italic text-amber">work</span>.</>}
        intro="Two backends, each built around one hard problem: security for GoCruze, concurrency for Votezy."
      />
      <div className="mt-16 grid gap-24 md:gap-32">
        {projects.map((p, i) => (
          <ProjectCase key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}

function ProjectCase({ project: p, index }: { project: (typeof projects)[number]; index: number }) {
  const [open, setOpen] = useState(false)
  const detailsId = useId()

  return (
    <article aria-labelledby={`${p.id}-title`} className="grid gap-8">
      <Reveal className="grid gap-5 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label flex items-center gap-3">
            <span className="text-cyan">{String(index + 1).padStart(2, '0')}</span>
            <span className="h-px w-8 bg-wire" aria-hidden="true" />
            {p.subtitle}
          </p>
          <h3 id={`${p.id}-title`} className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-none tracking-[-0.045em] text-ink">
            {p.name}
          </h3>
        </div>
        <p className="text-lg leading-snug text-dim lg:col-span-5 lg:pb-2">{p.outcome}</p>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <RequestFlow flow={p.flow} accent={index % 2 ? 'amber' : 'cyan'} />
        </Reveal>

        <div className="grid gap-4 lg:col-span-4">
          <div className="grid grid-cols-2 gap-4">
            {p.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={0.08 * i}
                className={`rounded-3xl border p-5 ${i === 0 ? 'border-amber/40 bg-[linear-gradient(160deg,rgba(255,181,71,0.16),rgba(255,181,71,0.03))]' : 'border-wire bg-hull'}`}
              >
                <p className={`font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-none tracking-[-0.04em] ${i === 0 ? 'text-amber' : 'text-ink'}`}>
                  {s.value}
                </p>
                <p className="mt-3 text-sm text-dim">{s.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="flex flex-col justify-between gap-6 rounded-3xl border border-wire bg-hull p-5">
            <div>
              <p className="label">Stack</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <li key={t} className="rounded-md border border-wire bg-hull-2 px-2.5 py-1 font-mono text-xs text-ink/90">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasLink(p.github) && (
                <Magnetic>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-void transition-colors hover:bg-amber"
                  >
                    <BrandIcon name="github" className="h-4 w-4" />
                    Source code
                  </a>
                </Magnetic>
              )}
              {hasLink(p.live) && (
                <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-wire px-4 py-2.5 text-sm text-ink hover:border-cyan hover:text-cyan">
                  Live demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
              <button
                type="button"
                aria-expanded={open}
                aria-controls={detailsId}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-wire px-4 py-2.5 text-sm text-ink transition-colors hover:border-cyan hover:text-cyan"
              >
                <Plus className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} aria-hidden="true" />
                {open ? 'Hide details' : 'Read details'}
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={detailsId}
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="overflow-hidden"
          >
            <ul className="grid gap-4 border-l border-amber/50 pl-6 md:grid-cols-2 md:gap-10">
              {p.highlights.map((h) => (
                <li key={h} className="max-w-[62ch] leading-relaxed text-ink/90">
                  {h}
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </article>
  )
}
