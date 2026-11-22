import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useInView } from 'framer-motion'
import { Boxes, Code2, Database, Server, Wrench, Cpu } from 'lucide-react'
import { skillGroups } from '../../data/skills'
import { SectionHeader } from '../ui/SectionHeader'
import { EASE_OUT_EXPO } from '../motion/Reveal'

const ICONS = { languages: Code2, frameworks: Boxes, database: Database, devops: Server, tools: Wrench, 'core-cs': Cpu } as const

/**
 * Skills as a fanned deck of cards (ebuka-style arc).
 * Each card sits on a big circle below the deck (x = R·sinθ, y = R·(1−cosθ))
 * and is tilted by θ, which lays the cards out on an arc. When the deck scrolls into view the cards fan out from a stack.
 * Hover / focus / click a card to lift it and show its skills below.
 * Phones get a swipeable row instead (the fan needs width).
 */
export function Skills() {
  const [active, setActive] = useState(1)
  const deck = useRef<HTMLDivElement>(null)
  const inView = useInView(deck, { once: true, margin: '0px 0px -20% 0px' })
  const n = skillGroups.length
  const group = skillGroups[active]

  // the arc radius follows the deck's width, so the cards never overlap
  const [deckWidth, setDeckWidth] = useState(1100)
  useEffect(() => {
    if (!deck.current) return
    const ro = new ResizeObserver(([e]) => setDeckWidth(e.contentRect.width))
    ro.observe(deck.current)
    return () => ro.disconnect()
  }, [])
  const R = Math.min(1000, deckWidth * 0.88)

  return (
    <section id="skills" className="container-x scroll-mt-20 py-24 md:py-32">
      <SectionHeader
        id="skills"
        title={<>The <span className="font-serif font-normal italic text-amber">toolkit</span>.</>}
        intro="Six groups, straight from my résumé. Pick a card to see what's inside."
      />

      {/* ---------- desktop / tablet: fan ---------- */}
      <div className="mt-10 hidden lg:block">
        <div ref={deck} className="relative mx-auto h-[460px] max-w-[1100px]" role="group" aria-label="Skill categories">
          {/* warm glow under the arc */}
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-[50%] bg-amber/20 blur-[60px]" />
          {skillGroups.map((g, i) => {
            const Icon = ICONS[g.id as keyof typeof ICONS]
            // place the card on a circle of radius R below the deck: x = R·sinθ, y = R·(1 − cosθ)
            const angle = (i - (n - 1) / 2) * 11
            const rad = (angle * Math.PI) / 180
            const arcX = R * Math.sin(rad)
            const arcY = R * (1 - Math.cos(rad))
            const isActive = i === active
            return (
              <m.button
                key={g.id}
                type="button"
                aria-pressed={isActive}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`absolute bottom-28 left-1/2 -ml-[78px] flex h-[240px] w-[156px] flex-col justify-between rounded-2xl border p-5 text-left transition-colors duration-300 ${
                  isActive
                    ? 'border-amber/70 bg-[linear-gradient(160deg,#1a2133,#0e1320)]'
                    : 'border-wire bg-[linear-gradient(160deg,#141a2b,#0b0f1a)]'
                }`}
                style={{ zIndex: isActive ? 20 : 10 - Math.abs(i - active) }}
                initial={{ rotate: 0, x: 0, y: 40, opacity: 0 }}
                animate={
                  inView
                    ? { rotate: angle, x: arcX, y: arcY + (isActive ? -36 : 0), opacity: 1, scale: isActive ? 1.06 : 1 }
                    : { rotate: 0, x: 0, y: 40, opacity: 0 }
                }
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: inView ? 0 : i * 0.04 }}
              >
                <span className="flex items-center justify-between">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl border ${isActive ? 'border-amber/50 text-amber' : 'border-wire text-dim'}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="label">{String(g.skills.length).padStart(2, '0')}</span>
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold tracking-[-0.02em] text-ink">{g.title}</span>
                  <span className="mt-1 block text-sm text-dim">{g.blurb}</span>
                </span>
              </m.button>
            )
          })}
        </div>

        {/* chips of the active group */}
        <div className="relative mx-auto mt-6 min-h-[120px] max-w-[820px] text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <m.div
              key={group.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <p className="label text-cyan">{group.title}</p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {group.skills.map((s, i) => (
                  <m.li
                    key={s}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE_OUT_EXPO }}
                    className="rounded-full border border-wire bg-hull px-4 py-2 text-[15px] text-ink transition-colors hover:border-cyan hover:text-cyan"
                  >
                    {s}
                  </m.li>
                ))}
              </ul>
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- phone: swipeable cards with their skills ---------- */}
      <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10 lg:hidden" aria-label="Skill categories">
        {skillGroups.map((g) => {
          const Icon = ICONS[g.id as keyof typeof ICONS]
          return (
            <li key={g.id} className="w-[78%] shrink-0 snap-center rounded-2xl border border-wire bg-hull p-5 md:w-[40%]">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber/40 text-amber">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="label">{String(g.skills.length).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">{g.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <li key={s} className="rounded-full border border-wire px-3 py-1.5 text-sm text-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
