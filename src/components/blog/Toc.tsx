import { useEffect, useState } from 'react'
import type { PostMeta } from '../../lib/posts'
import { scrollToTarget, useLenis } from '../motion/SmoothScroll'

/**
 * Table of contents from the headings the posts-index plugin extracted.
 * An IntersectionObserver marks the heading currently near the top as active.
 */
export function Toc({ headings, variant = 'aside' }: { headings: PostMeta['headings']; variant?: 'aside' | 'inline' }) {
  const [active, setActive] = useState<string>('')
  const lenis = useLenis()

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [headings])

  if (!headings.length) return null

  const list = (
    <ol className="grid gap-0.5 border-l border-line">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget(lenis, h.id)
              history.replaceState(null, '', `#${h.id}`)
            }}
            className={`-ml-px block border-l py-1.5 text-[0.85rem] leading-snug transition-colors ${h.depth === 3 ? 'pl-7' : 'pl-4'} ${
              active === h.id ? 'border-white text-white' : 'border-transparent text-grey hover:text-white'
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  )

  if (variant === 'inline') {
    return (
      <details className="frame p-4 lg:hidden">
        <summary className="mono cursor-pointer select-none text-white">On this page</summary>
        <nav aria-label="Table of contents" className="mt-4">
          {list}
        </nav>
      </details>
    )
  }
  return (
    <nav aria-label="Table of contents" className="grid gap-4">
      <p className="mono text-grey">On this page</p>
      {list}
    </nav>
  )
}
