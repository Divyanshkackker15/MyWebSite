import { useEffect, useState } from 'react'
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { homeSections, sectionNumber } from '../../data/sections'

/**
 * The "data bus": the connector that links every home section.
 *
 * A thin rail on the left edge carries a glowing packet. The packet's
 * position is the page's scroll progress (0 → 1). Each section has a node
 * on the rail placed where that section starts, so the packet reaches a
 * node exactly when its section reaches the top of the screen, and the
 * node lights up. The label shows where you are: "[ 04 / 10 ] PROJECTS".
 *
 * Desktop: full rail with nodes. Phone/tablet: a 2px progress line only.
 */
export function DataBus() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const packetTop = useTransform(smooth, (v) => `${v * 100}%`)
  const [nodes, setNodes] = useState<number[]>([])
  const [active, setActive] = useState(-1)

  // measure where each section starts, as a fraction of total scroll
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      setNodes(
        homeSections.map((s) => {
          const el = document.getElementById(s.id)
          if (!el) return 1
          const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35
          return Math.min(1, Math.max(0, top / max))
        }),
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    let idx = -1
    nodes.forEach((n, i) => {
      if (p >= n - 0.002) idx = i
    })
    if (idx !== active) setActive(idx)
  })

  const current = active >= 0 ? homeSections[active] : null

  return (
    <>
      {/* phone / tablet: simple progress line */}
      <m.div
        aria-hidden="true"
        className="fixed left-0 top-0 z-40 h-full w-[2px] origin-top bg-cyan/80 lg:hidden"
        style={{ scaleY: smooth }}
      />

      {/* desktop rail */}
      <div aria-hidden="true" className="pointer-events-none fixed bottom-[260px] left-3 top-28 z-40 hidden w-3 lg:block">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-cyan/50 via-wire to-amber/40" />
        {nodes.map((n, i) => (
          <span
            key={homeSections[i].id}
            className={`absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 border transition-colors duration-500 ${
              i <= active ? 'border-cyan bg-cyan shadow-[0_0_10px_var(--color-cyan)]' : 'border-wire bg-void'
            }`}
            style={{ top: `${n * 100}%` }}
          />
        ))}
        <m.span
          className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_12px_var(--color-cyan),0_0_28px_rgba(79,209,255,0.5)]"
          style={{ top: packetTop }}
        />
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed bottom-24 left-[26px] z-40 hidden origin-bottom-left -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-dim transition-opacity duration-500 lg:block ${
          current ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {current && (
          <span>
            <span className="text-cyan">{sectionNumber(current.id)}</span> {current.label}
          </span>
        )}
      </div>
    </>
  )
}
