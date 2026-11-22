import { Suspense, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { m, useScroll } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Page } from '../components/layout/Page'
import { PostCover } from '../components/blog/PostCover'
import { Toc } from '../components/blog/Toc'
import { AuthorBox } from '../components/blog/AuthorBox'
import { ShareBar } from '../components/blog/ShareBar'
import { mdxComponents } from '../components/blog/mdxComponents'
import { formatDate, getNeighbours, getPost, postBody } from '../lib/posts'
import { profile } from '../data/profile'
import NotFound from './NotFound'
import { asset } from '../lib/asset'

/** /blog/:slug — one article. */
export default function Post() {
  const { slug = '' } = useParams()
  const meta = getPost(slug)
  const body = postBody(slug)
  const article = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: article, offset: ['start 80px', 'end end'] })

  if (!meta || !body) return <NotFound />
  const Body = body.Component
  const { previous, next } = getNeighbours(slug)
  const url = `${profile.site}/blog/${meta.slug}`

  return (
    <Page>
      {/* reading progress */}
      <m.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-amber" style={{ scaleX: scrollYProgress }} />

      <article ref={article} className="pb-24 pt-28 md:pt-36">
        <header className="container-x">
          <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-2">
            <Link to="/blog" className="hover:text-ink">Blog</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/blog?category=${encodeURIComponent(meta.category)}`} className="text-cyan hover:text-amber">
              {meta.category}
            </Link>
          </nav>
          <h1 className="mt-6 max-w-[22ch] font-display text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1] tracking-[-0.045em] text-ink">
            {meta.title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-xl leading-relaxed text-dim">{meta.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-3">
              <picture>
                <source type="image/webp" srcSet={asset('images/avatar-256.webp')} />
                <img src={asset('images/avatar-256.png')} alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
              </picture>
              <span className="text-sm">
                <span className="block text-ink">{profile.name}</span>
                <span className="text-dim">{profile.title}</span>
              </span>
            </span>
            <span className="label">
              <time dateTime={meta.date}>{formatDate(meta.date)}</time> · {meta.readingTime} min read
            </span>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
            {meta.tags.map((t) => (
              <li key={t}>
                <Link to={`/blog?tag=${encodeURIComponent(t)}`} className="rounded-full border border-wire px-3 py-1 font-mono text-xs text-dim hover:border-cyan hover:text-cyan">
                  #{t}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 overflow-hidden rounded-[28px] border border-wire">
            <PostCover motif={meta.cover} label={meta.category} className="aspect-[16/7] w-full" />
          </div>
        </header>

        <div className="container-x mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
          <div className="min-w-0">
            <Toc headings={meta.headings} variant="inline" />
            <div className="prose-dk mt-8 lg:mt-0">
              <MDXProvider components={mdxComponents}>
                <Suspense fallback={<p className="text-dim">Loading article…</p>}>
                  <Body />
                </Suspense>
              </MDXProvider>
            </div>

            <div className="mt-16 grid max-w-[70ch] gap-8 border-t border-wire pt-10">
              <ShareBar url={url} title={meta.title} />
              <AuthorBox />
            </div>

            <nav aria-label="More posts" className="mt-12 grid max-w-[70ch] gap-4 sm:grid-cols-2">
              {previous ? (
                <Link to={`/blog/${previous.slug}`} className="group rounded-2xl border border-wire bg-hull p-5 transition-colors hover:border-cyan/50">
                  <span className="label flex items-center gap-2"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous</span>
                  <span className="mt-2 block font-display text-lg font-semibold leading-snug text-ink group-hover:text-cyan">{previous.title}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link to={`/blog/${next.slug}`} className="group rounded-2xl border border-wire bg-hull p-5 text-right transition-colors hover:border-cyan/50">
                  <span className="label flex items-center justify-end gap-2">Next <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  <span className="mt-2 block font-display text-lg font-semibold leading-snug text-ink group-hover:text-cyan">{next.title}</span>
                </Link>
              )}
            </nav>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Toc headings={meta.headings} />
            </div>
          </aside>
        </div>
      </article>
    </Page>
  )
}
