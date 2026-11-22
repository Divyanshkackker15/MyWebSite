import { useEffect, useRef } from 'react'

/**
 * A paragraph whose words light up one after another as it scrolls
 * through the screen. Opacity is written straight to the DOM in a
 * requestAnimationFrame, so React never re-renders while scrolling.
 * Unlit words stay at 38% so they still pass contrast for large text.
 * Without JavaScript, or with reduced motion, the text is simply white.
 */
export function ScrollWords({ text, className = '', as: Tag = 'p' }: { text: string; className?: string; as?: 'p' | 'h2' }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const words = Array.from(el.querySelectorAll<HTMLElement>('.scroll-word'))
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the top of the paragraph is at 85% of the screen, 1 when its bottom reaches 45%
      const start = vh * 0.85
      const end = vh * 0.45
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)))
      const lit = p * words.length
      words.forEach((w, i) => {
        w.style.opacity = String(0.38 + 0.62 * Math.min(1, Math.max(0, lit - i)))
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [text])

  return (
    <Tag ref={ref as never} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="scroll-word">
          {w}{' '}
        </span>
      ))}
    </Tag>
  )
}
