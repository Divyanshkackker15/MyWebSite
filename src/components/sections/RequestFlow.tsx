import { useRef } from 'react'
import { useInView } from 'framer-motion'
import type { Project } from '../../data/projects'

/**
 * Animated architecture diagram used as the project "preview".
 * Boxes are the layers a request passes through; dots (packets) travel along
 * the line. Packets run while the diagram is on screen and speed up on hover.
 * Pure CSS animation (see .flow-packet in main.css) — no JS per frame.
 */
export function RequestFlow({ flow, accent = 'cyan' }: { flow: Project['flow']; accent?: 'cyan' | 'amber' }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })
  const color = accent === 'amber' ? 'var(--color-amber)' : 'var(--color-cyan)'

  return (
    <div
      ref={ref}
      className={`flow group/flow relative h-full min-h-[320px] overflow-hidden rounded-3xl border border-wire bg-[radial-gradient(70%_80%_at_50%_0%,#141c30,#090c15_75%)] p-6 md:p-8 ${inView ? 'is-running' : ''}`}
      style={{ ['--flow-color' as string]: color }}
      data-cursor="view"
      data-cursor-label="Request"
    >
      <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-50" />
      <p className="label relative">Request path</p>

      <ol className="relative mt-8 flex h-[calc(100%-3rem)] flex-col justify-between gap-5 md:mt-0 md:flex-row md:items-center md:gap-3">
        {/* the wire + packets */}
        <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-px bg-wire md:inset-x-8 md:bottom-auto md:left-8 md:top-1/2 md:h-px md:w-auto" />
        <span aria-hidden="true" className="flow-track absolute bottom-6 left-[19px] top-6 w-px md:inset-x-8 md:bottom-auto md:left-8 md:top-1/2 md:h-px md:w-auto">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flow-packet" style={{ animationDelay: `${i * -1.2}s` }} />
          ))}
        </span>

        {flow.map((step, i) => (
          <li key={step.label} className="relative z-10 flex items-center gap-4 md:flex-1 md:flex-col md:gap-3 md:text-center">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-void font-mono text-[11px] text-ink transition-colors duration-500 group-hover/flow:border-[var(--flow-color)]"
              style={{ borderColor: i === 0 || i === flow.length - 1 ? color : undefined }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="grid md:justify-items-center">
              <span className="font-mono text-[13px] text-ink">{step.label}</span>
              <span className="text-xs text-dim">{step.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
