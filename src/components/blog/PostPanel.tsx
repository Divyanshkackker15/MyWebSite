import { coverFor, formatDate, type PostMeta } from '../../lib/posts'
import { LIGHT_HEX } from '../../data/categories'
import { TLink } from '../layout/TLink'
import { Img } from '../ui/Img'

/**
 * One article as a bordered panel: text block on top, a lit render
 * below. On hover the corner ticks open out and the light behind the
 * image warms up in the category's colour.
 */
export function PostPanel({
  post,
  size = 'm',
  split = false,
  className = '',
  eager = false,
}: {
  post: PostMeta
  size?: 'm' | 'l'
  /** large screens: text and image side by side */
  split?: boolean
  className?: string
  eager?: boolean
}) {
  const cover = coverFor(post)
  const glow = LIGHT_HEX[cover.light]
  return (
    <article className={`group relative ${className}`} style={{ '--glow': glow } as React.CSSProperties}>
      <TLink to={`/blog/${post.slug}`} className={`outline-none ${split ? 'grid gap-4 lg:grid-cols-12 lg:gap-8' : 'block'}`}>
        <div className={`frame ticks p-6 md:p-8 ${split ? 'flex flex-col justify-between lg:col-span-5 lg:p-10' : ''}`}>
          <p className="mono flex flex-wrap gap-x-3 text-grey">
            <span className="text-white">{post.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min</span>
          </p>
          <div>
            <h3 className={`mt-5 text-white ${size === 'l' ? 'display-m max-w-[18ch]' : 'title max-w-[24ch]'}`}>{post.title}</h3>
            <p className={`mt-4 max-w-[52ch] text-grey ${split ? 'line-clamp-4' : 'line-clamp-2'} ${size === 'l' ? 'text-lg' : 'text-[0.95rem]'}`}>{post.excerpt}</p>
          </div>
        </div>
        <div className={`panel-image relative overflow-hidden border border-line bg-black ${split ? 'lg:col-span-7' : 'mt-4'}`}>
          {cover.custom ? (
            <img src={cover.src} alt="" loading={eager ? 'eager' : 'lazy'} className="aspect-[16/10] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.04]" />
          ) : (
            <Img
              src={cover.src}
              alt=""
              eager={eager}
              sizes={size === 'l' ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 34vw, 90vw'}
              className="aspect-[16/10] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
            />
          )}
        </div>
      </TLink>
    </article>
  )
}
