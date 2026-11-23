import { useEffect, useRef } from 'react'
import { siApachekafka, siDocker, siMysql, siOpenjdk, siSpringboot } from 'simple-icons'

/**
 * A paragraph whose words light up one after another as it scrolls through
 * the screen, with small round tech chips that pop in between words.
 * Write a chip as {java}, {spring}, {mysql}, {kafka} or {docker} in the text.
 *
 * Opacity and scale are written straight to the DOM in a requestAnimationFrame,
 * so React never re-renders while scrolling. Unlit words stay at 38% so they
 * still pass contrast for large text. Without JavaScript, or with reduced
 * motion, everything is simply shown.
 */
const CHIPS = {
  java: siOpenjdk,
  spring: siSpringboot,
  mysql: siMysql,
  kafka: siApachekafka,
  docker: siDocker,
} as const

/** brand colour, or white when the brand colour is too dark to see on black */
function glyphColour(hex: string) {
  const n = parseInt(hex, 16)
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
  return lum < 0.3 ? 'currentColor' : `#${hex}`
}

export function ScrollWords({ text, className = '', as: Tag = 'p' }: { text: string; className?: string; as?: 'p' | 'h2' }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = Array.from(el.querySelectorAll<HTMLElement>('.scroll-word'))
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the top of the paragraph is at 85% of the screen, 1 when its bottom reaches 45%
      const start = vh * 0.85
      const end = vh * 0.45
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)))
      const lit = p * items.length
      items.forEach((w, i) => {
        const k = Math.min(1, Math.max(0, lit - i))
        if (w.dataset.chip) {
          w.style.opacity = String(k)
          w.style.transform = `scale(${0.3 + 0.7 * k}) rotate(${(1 - k) * -40}deg)`
        } else w.style.opacity = String(0.38 + 0.62 * k)
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
      {text.split(' ').map((w, i) => {
        const m = /^\{(\w+)\}(\W*)$/.exec(w)
        const chip = m?.[1] as keyof typeof CHIPS | undefined
        if (chip && CHIPS[chip]) {
          const icon = CHIPS[chip]
          return (
            <span key={i}>
              <span className="scroll-word word-chip" data-chip={chip} title={icon.title}>
                <svg viewBox="0 0 24 24" aria-hidden="true" fill={glyphColour(icon.hex)}>
                  <path d={icon.path} />
                </svg>
              </span>
              {m?.[2]}{' '}
            </span>
          )
        }
        return (
          <span key={i} className="scroll-word">
            {w}{' '}
          </span>
        )
      })}
    </Tag>
  )
}
