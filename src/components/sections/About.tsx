import { profile } from '../../data/profile'
import { SectionHeader } from '../ui/SectionHeader'
import { WordReveal } from '../motion/WordReveal'
import { CountUp } from '../motion/CountUp'
import { Reveal } from '../motion/Reveal'
import { Portrait } from '../ui/Portrait'
import { BrandIcon, type BrandName } from '../ui/BrandIcon'

const chip = (name: BrandName, color: string) => (
  <span
    className="mx-[0.08em] inline-grid h-[0.92em] w-[1.5em] translate-y-[0.1em] place-items-center rounded-full border border-wire bg-hull-2"
    style={{ color }}
  >
    <BrandIcon name={name} className="h-[0.52em] w-[0.52em]" />
  </span>
)

/** About: summary as a scroll-lit sentence (with inline tech chips), photo and stat counters. */
export function About() {
  return (
    <section id="about" className="container-x scroll-mt-20 py-24 md:py-36">
      <SectionHeader id="about" title={<>Hands-on with <span className="font-serif font-normal italic text-amber">distributed</span> systems.</>} />

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <figure className="relative overflow-hidden rounded-[28px] border border-wire bg-[radial-gradient(80%_60%_at_50%_30%,#18203a,#0b0f1b_70%)]">
            <Portrait
              sizes="(min-width: 1024px) 34vw, 90vw"
              className="mx-auto w-[92%] translate-y-[4%] object-contain grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-void/95 to-transparent px-5 pb-4 pt-12">
              <span className="label text-ink">{profile.name}</span>
              <span className="label">23.26° N · 77.41° E</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="grid content-start gap-12 lg:col-span-7">
          <WordReveal
            className="font-display text-[clamp(1.55rem,2.9vw,2.5rem)] font-medium leading-[1.22] tracking-[-0.02em] text-ink"
            text="Practical, hands-on software engineer focused on distributed systems: building software that performs reliably at scale and solves real engineering challenges. Skilled in {java} Java, {spring} Spring Boot, {kafka} Apache Kafka, {redis} Redis and RESTful API design, with a strong grounding in Agile development."
            accent={['reliably']}
            chips={{
              java: chip('java', '#FFB547'),
              spring: chip('spring', '#6DB33F'),
              kafka: chip('kafka', '#E9EDF5'),
              redis: chip('redis', '#FF4438'),
            }}
          />

          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {profile.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.08}
                className="group rounded-2xl border border-wire bg-hull p-5 transition-colors hover:border-amber/50"
              >
                <dt className="label order-2">{s.label}</dt>
                <dd className="mt-3 font-display text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-none tracking-[-0.04em] text-ink transition-colors group-hover:text-amber">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
