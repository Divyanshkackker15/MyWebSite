import { useCallback, useEffect, useRef, useState } from 'react'
import { allPosts, coverFor, formatDate, type PostMeta } from '../../lib/posts'
import { TLink } from '../layout/TLink'
import { Img } from '../ui/Img'

/*
 * Home: the blog as a deck of cards (the "card shuffle" riff from Figma).
 * The top card is the article in focus; the ones behind step back in scale,
 * blur and tint. Next swipes the top card off and the rest step forward;
 * the dots jump by shuffling through. Drag, arrow keys, the buttons or the
 * dots all drive it. Reduced motion: plain cross-fades.
 */

/** the five card gradients of the riff, 144deg, 2% → 98%; `dark` = dark text */
const DECK = [
  { name: 'focus', from: '#8B6CF0', to: '#5B3FD0', dark: false },
  { name: 'create', from: '#FFCE1F', to: '#F5A524', dark: true },
  { name: 'explore', from: '#3DDC84', to: '#9CC2FF', dark: true },
  { name: 'build', from: '#B9A6FF', to: '#8B6CF0', dark: true },
  { name: 'ship', from: '#FFE27A', to: '#B9A6FF', dark: true },
] as const

/** depth in the stack → scale, rise (% of card height), tilt, blur, tint */
const DEPTH = [
  { s: 1, y: 0, r: 0, b: 0, t: 0.01 },
  { s: 0.93, y: -6.4, r: -1.6, b: 1.5, t: 0.12 },
  { s: 0.86, y: -12.8, r: 2.2, b: 3, t: 0.24 },
  { s: 0.79, y: -19.2, r: -2.4, b: 5, t: 0.36 },
  { s: 0.72, y: -25.6, r: 2.8, b: 8, t: 0.5 },
  { s: 0.65, y: -32, r: 0, b: 8, t: 0.6 },
]
const VISIBLE = 5

const EASE_LIFT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_FLY = 'cubic-bezier(0.5, 0, 1, 0.6)'

const pad = (n: number) => String(n).padStart(2, '0')
const styleFor = (i: number) => DECK[i % DECK.length]

/** `page`: rendered as the /blog page itself (h1, room for the nav) rather than a home section. */
export function Blog({ page = false }: { page?: boolean }) {
  const Heading = page ? 'h1' : 'h2'
  const posts = allPosts
  const n = posts.length
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const cards = useRef<(HTMLElement | null)[]>([])
  const deck = useRef<HTMLDivElement>(null)
  const drag = useRef({ id: -1, x0: 0, y0: 0, dx: 0, moved: false, horizontal: false })

  const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const go = useCallback(
    (step: 1 | -1, dir: 1 | -1 = 1, speed = 1) => {
      const from = activeRef.current
      const to = (from + step + n) % n
      activeRef.current = to
      setActive(to)
      if (reduced()) return
      // forward: the old top card flies off; back: the new top card flies in
      const el = cards.current[step === 1 ? from : to]
      if (!el) return
      const dx = getComputedStyle(el).getPropertyValue('--dx') || '0px'
      const lift = `translate3d(${-34 * dir * 0.6}px, -2.8%, 0) rotate(${-3 * dir}deg) scale(1.05)`
      const away = `translate3d(${150 * dir}%, 6%, 0) rotate(${-20 * dir}deg) scale(1.02)`
      const rest = 'translate3d(0, 0, 0) rotate(0deg) scale(1)'
      const frames =
        step === 1
          ? [
              { transform: `translate3d(${dx}, 0, 0) rotate(0deg) scale(1)`, opacity: 1, filter: 'blur(0px)', easing: EASE_LIFT },
              { transform: lift, opacity: 1, offset: 0.36, easing: EASE_FLY },
              { transform: away, opacity: 0, filter: 'blur(2px)' },
            ]
          : [
              { transform: away, opacity: 0, filter: 'blur(2px)', easing: EASE_LIFT },
              { transform: lift, opacity: 1, offset: 0.6, easing: EASE_LIFT },
              { transform: rest, opacity: 1, filter: 'blur(0px)' },
            ]
      el.dataset.flying = 'true'
      el.getAnimations().forEach((a) => a.cancel())
      const anim = el.animate(frames, { duration: (step === 1 ? 760 : 820) / speed })
      anim.onfinish = anim.oncancel = () => {
        delete el.dataset.flying
      }
    },
    [n],
  )

  /** shuffle through to a given article, the short way round */
  const jump = useCallback(
    (target: number) => {
      const fwd = (target - activeRef.current + n) % n
      if (!fwd) return
      const back = n - fwd
      const steps = Math.min(fwd, back)
      const step: 1 | -1 = fwd <= back ? 1 : -1
      if (reduced() || steps > 4) {
        activeRef.current = target
        setActive(target)
        return
      }
      for (let k = 0; k < steps; k++) setTimeout(() => go(step, 1, 1.6), k * 130)
    },
    [go, n],
  )

  // ---- dragging the top card ----
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, moved: false, horizontal: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (d.id !== e.pointerId) return
    const dx = e.clientX - d.x0
    const dy = e.clientY - d.y0
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 6) return
      d.moved = true
      d.horizontal = Math.abs(dx) > Math.abs(dy)
      if (d.horizontal) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    if (!d.horizontal) return
    d.dx = dx
    const el = cards.current[activeRef.current]
    if (el) {
      el.dataset.dragging = 'true'
      el.style.setProperty('--dx', `${dx}px`)
      el.style.setProperty('--dr', `${dx * 0.025}deg`)
    }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current
    if (d.id !== e.pointerId) return
    d.id = -1
    const el = cards.current[activeRef.current]
    if (!el || !d.horizontal) return
    delete el.dataset.dragging
    const width = el.offsetWidth
    if (Math.abs(d.dx) > Math.min(110, width * 0.25)) go(1, d.dx > 0 ? 1 : -1)
    el.style.setProperty('--dx', '0px')
    el.style.setProperty('--dr', '0deg')
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1, -1) }
  }

  const [deal, setDeal] = useState<'idle' | 'dealing' | 'done'>('idle')
  useEffect(() => {
    const el = deck.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      setDeal('dealing')
      setTimeout(() => setDeal('done'), 1600)
    }, { rootMargin: '0px 0px -20% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // keep the ref in step if React state is changed elsewhere
  useEffect(() => { activeRef.current = active }, [active])

  const current = posts[active]

  return (
    <section id="blog" aria-labelledby="blog-title" className={`blog relative overflow-hidden ${page ? '' : 'border-t border-line'}`}>
      <div aria-hidden="true" className="blog__glow blog__glow--a" />
      <div aria-hidden="true" className="blog__glow blog__glow--b" />

      <div className={`wrap relative ${page ? 'pb-[16vh] pt-32 md:pt-40' : 'py-[16vh] md:py-[20vh]'}`}>
        <header className="text-center">
          <p className="blog__eyebrow" data-reveal>{page ? `The blog · ${n} articles` : '(02) The blog'}</p>
          <Heading id="blog-title" className="blog__title rise mt-5">
            <span className="line-mask"><span>Blogging.</span></span>
          </Heading>
        </header>

        <div className="mt-12 md:mt-16">
        <div
          ref={deck}
          className="deck"
          data-deal={deal}
          data-reveal
          role="group"
          aria-roledescription="carousel"
          aria-label="Articles. Use the arrow keys to shuffle."
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <div className="deck__stage">
            {posts.map((p, i) => {
              const depth = (i - active + n) % n
              const d = DEPTH[Math.min(depth, DEPTH.length - 1)]
              const top = depth === 0
              return (
                <DeckCard
                  key={p.slug}
                  post={p}
                  index={i}
                  top={top}
                  ref={(el) => { cards.current[i] = el }}
                  style={{
                    '--s': d.s,
                    '--y': `${d.y}%`,
                    '--r': `${d.r}deg`,
                    '--b': `${d.b}px`,
                    '--t': d.t,
                    '--o': depth < VISIBLE ? 1 : 0,
                    '--depth': depth,
                    zIndex: n - depth,
                  } as React.CSSProperties}
                  onPointerDown={top ? onPointerDown : undefined}
                  onPointerMove={top ? onPointerMove : undefined}
                  onPointerUp={top ? onPointerUp : undefined}
                  onPointerCancel={top ? onPointerUp : undefined}
                  dragged={() => drag.current.moved && drag.current.horizontal}
                />
              )
            })}
          </div>

          <div className="deck__controls">
            <button type="button" className="deck__btn" onClick={() => go(-1, -1)} aria-label="Previous article">
              <Arrow flip />
            </button>
            <ol className="deck__dots" aria-label="Choose an article">
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    className="deck__dot"
                    aria-label={`Article ${i + 1}: ${p.title}`}
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => jump(i)}
                  />
                </li>
              ))}
            </ol>
            <button type="button" className="deck__btn" onClick={() => go(1)} aria-label="Next article">
              <Arrow />
            </button>
          </div>
          <p className="mono mt-5 text-center text-mute" aria-hidden="true">Drag the card · ← → keys · tap to read</p>
          <p className="sr-only" aria-live="polite">
            Article {active + 1} of {n}: {current?.title}
          </p>
        </div>
        </div>
      </div>
    </section>
  )
}

function DeckCard({
  post,
  index,
  top,
  style,
  ref,
  dragged,
  ...pointer
}: {
  post: PostMeta
  index: number
  top: boolean
  style: React.CSSProperties
  ref: (el: HTMLElement | null) => void
  dragged: () => boolean
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerMove?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
  onPointerCancel?: (e: React.PointerEvent) => void
}) {
  const g = styleFor(index)
  const cover = coverFor(post)
  const img = cover.src.replace(/\.webp$/, '')
  return (
    <article
      ref={ref}
      className={`deck__card ${g.dark ? 'is-dark' : 'is-light'} ${top ? 'is-top' : ''}`}
      style={{ ...style, '--from': g.from, '--to': g.to } as React.CSSProperties}
      aria-hidden={!top}
      inert={!top}
      {...pointer}
      onClickCapture={(e) => {
        if (dragged()) { e.preventDefault(); e.stopPropagation() }
      }}
    >
      <TLink to={`/blog/${post.slug}`} className="deck__link" draggable={false} tabIndex={top ? 0 : -1}>
        <span aria-hidden="true" className="deck__rings" />
        <span className="deck__head">
          <span className="deck__num" aria-hidden="true">{pad(index + 1)}</span>
          <span className="deck__chip">{post.category}</span>
        </span>
        <span className="deck__image">
          <Img src={img} alt="" width={1600} height={1000} sizes="(min-width: 1024px) 30rem, 86vw" className="h-full w-full object-cover" />
        </span>
        <span className="deck__foot">
          <span className="min-w-0">
            <span className="deck__meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min read
            </span>
            <span className="deck__title">{post.title}</span>
            <span className="deck__sub">{post.excerpt}</span>
          </span>
          <span className="deck__go" aria-hidden="true"><Arrow /></span>
        </span>
      </TLink>
    </article>
  )
}

function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 20" width="18" height="15" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M1 10h21M13 1.5 22 10l-9 8.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
