import { m, type HTMLMotionProps } from 'framer-motion'

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/**
 * Fade + rise when the element scrolls into view (once).
 * With prefers-reduced-motion, <MotionConfig reducedMotion="user"> in
 * Layout strips the movement and keeps only the fade.
 */
export function Reveal({
  delay = 0,
  y = 28,
  children,
  ...rest
}: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
      {...rest}
    >
      {children}
    </m.div>
  )
}
