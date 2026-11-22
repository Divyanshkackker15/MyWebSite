import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { EASE_OUT_EXPO } from '../motion/Reveal'

/**
 * Intro screen styled as a Spring Boot startup log.
 *
 * - Runs once per browser tab (sessionStorage flag "dk-booted").
 * - Total time ≈ 1.6 s; click, tap or any key skips it.
 * - The inline script in index.html hides it before first paint on repeat
 *   visits and for prefers-reduced-motion, so there is never a flash.
 */
const LOG: { text: string; tone?: 'amber' | 'ok' }[] = [
  { text: ':: Kackker ::                 (v1.0.0)' },
  { text: 'Starting DivyanshKackker on kackkerdivyansh.in' },
  { text: 'Loading profile, journey, projects …' },
  { text: 'Tomcat started on port 443 (https)', tone: 'amber' },
  { text: 'Started DivyanshKackker in 1.4 seconds', tone: 'ok' },
]
const DURATION = 1500

export function Preloader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true)
  const [lines, setLines] = useState(0)
  const [count, setCount] = useState(0)
  const finished = useRef(false)

  useEffect(() => {
    const root = document.documentElement
    if (root.classList.contains('booted')) {
      setVisible(false)
      onDone()
      return
    }

    const finish = () => {
      if (finished.current) return
      finished.current = true
      try {
        sessionStorage.setItem('dk-booted', '1')
      } catch {
        /* private mode: fine, it just plays again next time */
      }
      setVisible(false)
      onDone()
    }

    // type the log lines
    const timers = LOG.map((_, i) => window.setTimeout(() => setLines(i + 1), 120 + i * 260))
    // counter 000 → 100 with an ease-out curve
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION)
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const done = window.setTimeout(finish, DURATION + 150)

    window.addEventListener('keydown', finish)
    window.addEventListener('pointerdown', finish)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="preloader fixed inset-0 z-[95] flex flex-col justify-between bg-[#04060b] p-6 md:p-10"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          role="status"
          aria-label="Loading"
        >
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
            <span>kackkerdivyansh.in</span>
            <span>Click or press any key to skip</span>
          </div>
          <div className="grid gap-1.5 font-mono text-[13px] leading-relaxed text-dim md:text-sm">
            {LOG.slice(0, lines).map((l) => (
              <m.p
                key={l.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={l.tone === 'ok' ? 'text-ok' : l.tone === 'amber' ? 'text-amber' : ''}
              >
                <span className="mr-3 text-ghost">{'>'}</span>
                {l.text}
              </m.p>
            ))}
          </div>
          <div className="flex items-end justify-between gap-6">
            <p className="font-display text-[clamp(1.6rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-ink">
              Divyansh <span className="font-serif font-normal italic text-amber">Kackker</span>
            </p>
            <p className="font-display text-[clamp(4rem,14vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-ink tabular-nums">
              {String(count).padStart(3, '0')}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-wire">
            <div className="h-full bg-amber" style={{ width: `${count}%` }} />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
