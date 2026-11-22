import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Number that counts up from 0 the first time it scrolls into view.
 * The pre-rendered HTML contains the final number (good for SEO and no-JS);
 * the browser resets it to 0 only if it starts off-screen.
 */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(value)
  const armed = useRef(false)

  useEffect(() => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    if (r.top > window.innerHeight) {
      armed.current = true
      setShown(0)
    }
  }, [reduced])

  useEffect(() => {
    if (!inView || !armed.current) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix}
    </span>
  )
}
