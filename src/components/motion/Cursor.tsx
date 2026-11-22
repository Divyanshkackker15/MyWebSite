import { useEffect, useState } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer, usePrefersReducedMotion } from '../../hooks/useMedia'

type CursorState = 'default' | 'link' | 'view' | 'text' | 'hidden'

/**
 * Custom cursor: a small dot that follows the pointer exactly, plus a ring
 * that follows with spring physics (the "trailing" feel).
 *
 * Hover states come from event delegation, so components don't need to
 * register anything:
 *   - any <a>, <button>                → ring grows   ("link")
 *   - element with data-cursor="view"  → big ring with a label ("view")
 *     (label text from data-cursor-label)
 *   - inputs / textareas               → ring hides   ("text")
 *
 * Only rendered on mouse/trackpad devices and when motion is allowed.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 })

  const [state, setState] = useState<CursorState>('hidden')
  const [label, setLabel] = useState('')
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as Element | null
      const view = t?.closest<HTMLElement>('[data-cursor="view"]')
      if (view) {
        setState('view')
        setLabel(view.dataset.cursorLabel ?? 'View')
      } else if (t?.closest('input, textarea, select, [contenteditable="true"]')) {
        setState('text')
      } else if (t?.closest('a, button, [role="button"], label, summary')) {
        setState('link')
      } else {
        setState('default')
      }
    }
    const onLeave = () => setState('hidden')
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const ringScale = { hidden: 0, default: 1, link: 1.9, view: 3.4, text: 0 }[state] * (pressed ? 0.85 : 1)

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <m.div
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-amber"
        style={{ x, y }}
        animate={{ opacity: state === 'hidden' || state === 'view' ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <m.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <m.div
          className="-ml-4 -mt-4 grid h-8 w-8 place-items-center rounded-full border border-amber/70"
          animate={{
            scale: ringScale,
            backgroundColor: state === 'view' ? 'rgba(255,181,71,0.95)' : 'rgba(255,181,71,0)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          {state === 'view' && (
            <span className="font-mono text-[3.4px] font-medium uppercase tracking-[0.12em] text-void">{label}</span>
          )}
        </m.div>
      </m.div>
    </div>
  )
}
