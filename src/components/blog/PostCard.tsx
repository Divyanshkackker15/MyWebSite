import { Link } from 'react-router-dom'
import type { PostMeta } from '../../lib/posts'
import { formatDate } from '../../lib/posts'
import { PostCover } from './PostCover'

/** GridPane-style card: cover, category, title, excerpt, date · reading time. */
export function PostCard({ post, headingLevel = 3 }: { post: PostMeta; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-wire bg-hull transition-colors duration-500 hover:border-amber/40">
      <div className="relative aspect-[16/10] overflow-hidden" data-cursor="view" data-cursor-label="Read">
        <PostCover motif={post.cover} className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
        <span className="absolute left-4 top-4 rounded-full border border-wire bg-void/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink backdrop-blur-md">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <H className="font-display text-xl font-semibold leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-amber">
          {/* the ::after stretches this link over the whole card */}
          <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </H>
        <p className="line-clamp-3 text-[15px] leading-relaxed text-dim">{post.excerpt}</p>
        <p className="label mt-auto pt-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min read
        </p>
      </div>
    </article>
  )
}
