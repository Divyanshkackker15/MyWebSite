import type { ReactNode } from 'react'
import { sectionNumber, homeSections, type SectionId } from '../../data/sections'
import { Reveal } from '../motion/Reveal'

/**
 * Honey-style section opener: mono counter on the left, section name on the
 * right, a hairline across, then the heading.
 */
export function SectionHeader({
  id,
  title,
  intro,
  align = 'left',
}: {
  id: SectionId
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
}) {
  const label = homeSections.find((s) => s.id === id)?.label
  return (
    <header className={`grid gap-6 ${align === 'center' ? 'justify-items-center text-center' : ''}`}>
      <div className="flex w-full items-center gap-4 border-t border-wire pt-4">
        <span className="label text-cyan">{sectionNumber(id)}</span>
        <span className="label">{label}</span>
      </div>
      <Reveal className={`grid gap-4 ${align === 'center' ? 'justify-items-center' : ''}`}>
        <h2 className="font-display text-[clamp(2.2rem,5.4vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
          {title}
        </h2>
        {intro && <p className="max-w-[60ch] text-lg leading-relaxed text-dim">{intro}</p>}
      </Reveal>
    </header>
  )
}
