import { useRef, type ReactNode } from 'react'
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

/**
 * Scroll-linked text: every word starts dim and lights up as the paragraph
 * moves through the viewport (scroll progress is split evenly across words).
 *
 * `chips` lets you drop small inline badges into the sentence: write
 * "{java}" in the text and pass chips={{ java: <JavaIcon/> }}.
 */
export function WordReveal({
  text,
  className = '',
  as: Tag = 'p',
  chips = {},
  accent = [],
  offset = ['start 0.88', 'start 0.3'],
}: {
  text: string
  className?: string
  as?: 'p' | 'h2' | 'h3'
  chips?: Record<string, ReactNode>
  accent?: string[]
  offset?: [string, string]
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as any })
  const tokens = text.split(/\s+/)
  const MotionTag = m[Tag]

  return (
    <MotionTag ref={ref as never} className={className}>
      {tokens.map((token, i) => {
        const chip = /^\{(\w+)\}$/.exec(token)
        const content = chip ? chips[chip[1]] : token
        const isAccent = accent.includes(token.replace(/[.,!?]/g, ''))
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / tokens.length, (i + 1) / tokens.length]}
            still={!!reduced}
            accent={isAccent}
          >
            {content}
          </Word>
        )
      })}
    </MotionTag>
  )
}

function Word({
  children,
  progress,
  range,
  still,
  accent,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
  still: boolean
  accent: boolean
}) {
  // 0.5 keeps dim words readable: ≥ 4.5:1 for ink and ≥ 3:1 for amber (WCAG AA, large text)
  const opacity = useTransform(progress, range, [0.5, 1])
  return (
    <>
      <m.span
        className={`inline-block align-baseline ${accent ? 'font-serif italic text-amber' : ''}`}
        style={{ opacity: still ? 1 : opacity }}
      >
        {children}
      </m.span>{' '}
    </>
  )
}
