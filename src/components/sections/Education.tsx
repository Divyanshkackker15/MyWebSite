import { GraduationCap } from 'lucide-react'
import { education } from '../../data/education'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../motion/Reveal'

export function Education() {
  return (
    <section id="education" className="container-x scroll-mt-20 py-24 md:py-32">
      <SectionHeader id="education" title={<>Where I <span className="font-serif font-normal italic text-amber">learned</span>.</>} />
      <ul className="mt-14 grid gap-4 md:grid-cols-4">
        {education.map((e, i) => (
          <li key={e.id} className={e.primary ? 'md:col-span-2' : ''}>
            <Reveal
              delay={i * 0.06}
              className={`group flex h-full flex-col justify-between gap-10 rounded-3xl border p-6 transition-transform duration-500 hover:-translate-y-1 ${
                e.primary ? 'border-amber/40 bg-[linear-gradient(150deg,rgba(255,181,71,0.12),#0e1320_55%)]' : 'border-wire bg-hull'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`grid h-10 w-10 place-items-center rounded-xl border ${e.primary ? 'border-amber/50 text-amber' : 'border-wire text-dim'}`}>
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="label">{e.period}</span>
              </div>
              <div>
                <h3 className={`font-display font-semibold tracking-[-0.02em] text-ink ${e.primary ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                  {e.course}
                </h3>
                <p className="mt-2 text-dim">
                  {e.school}, {e.place}
                </p>
                <p className={`mt-5 font-display text-3xl font-bold tracking-[-0.03em] ${e.primary ? 'text-amber' : 'text-ink'}`}>
                  {e.score}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
