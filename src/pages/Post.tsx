import { Suspense, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { TLink } from '../components/layout/TLink'
import { PostPanel } from '../components/blog/PostPanel'
import { Toc } from '../components/blog/Toc'
import { mdxComponents } from '../components/blog/mdxComponents'
import { Img } from '../components/ui/Img'
import { coverFor, formatDate, getNeighbours, getPost, postBody, relatedPosts } from '../lib/posts'
import { profile } from '../data/profile'
import NotFound from './NotFound'
import { asset } from '../lib/asset'

/** /blog/:slug: one article, set like a printed essay. */
export default function Post() {
  const { slug = '' } = useParams()
  const meta = getPost(slug)
  const body = postBody(slug)
  const [copied, setCopied] = useState(false)

  if (!meta || !body) return <NotFound />
  const Body = body.Component
  const { previous, next } = getNeighbours(slug)
  const related = relatedPosts(meta)
  const cover = coverFor(meta)
  const url = `${profile.site}/blog/${meta.slug}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <>
      <div aria-hidden="true" className="read-progress fixed inset-x-0 top-0 z-[60] h-px origin-left bg-white" />

      <article className="pb-24">
        <header className="wrap pt-36 md:pt-44">
          <nav aria-label="Breadcrumb" className="mono fade-now flex flex-wrap gap-2 text-grey">
            <TLink to="/blog" className="link hover:text-white">Blog</TLink>
            <span aria-hidden="true">/</span>
            <a href={`/blog?category=${encodeURIComponent(meta.category)}`} className="link text-white">{meta.category}</a>
          </nav>
          <h1 className="rise-now mt-8 max-w-[20ch] text-[clamp(2.5rem,6.6vw,6.25rem)] leading-[0.96] tracking-[-0.05em]">
            <span className="line-mask"><span className="ink-fade">{meta.title}</span></span>
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="fade-now text-xl leading-relaxed text-grey md:col-span-7" style={{ '--i': 2 } as React.CSSProperties}>{meta.excerpt}</p>
            <dl className="mono fade-now grid grid-cols-3 gap-4 text-grey md:col-span-4 md:col-start-9 md:grid-cols-1 md:gap-3" style={{ '--i': 3 } as React.CSSProperties}>
              <div><dt className="text-mute">Published</dt><dd className="mt-1 text-white"><time dateTime={meta.date}>{formatDate(meta.date)}</time></dd></div>
              <div><dt className="text-mute">Reading time</dt><dd className="mt-1 text-white">{meta.readingTime} min</dd></div>
              <div><dt className="text-mute">By</dt><dd className="mt-1 text-white">{profile.name}</dd></div>
            </dl>
          </div>
        </header>

        <figure className="wrap mt-14 md:mt-20">
          <div className="overflow-hidden border border-line" data-reveal="clip">
            {cover.custom ? (
              <img src={cover.src} alt="" className="aspect-[16/8] w-full object-cover" />
            ) : (
              <Img src={cover.src} alt="" eager sizes="100vw" className="aspect-[16/8] w-full object-cover" />
            )}
          </div>
        </figure>

        <div className="wrap mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <Toc headings={meta.headings} />
            </div>
          </aside>
          <div className="min-w-0 lg:col-span-7 lg:col-start-5">
            <Toc headings={meta.headings} variant="inline" />
            <div className="prose-dk mt-10 max-w-[680px] lg:mt-0">
              <MDXProvider components={mdxComponents}>
                <Suspense fallback={<p className="text-grey">Loading the article…</p>}>
                  <Body />
                </Suspense>
              </MDXProvider>
            </div>

            <footer className="mt-20 grid max-w-[680px] gap-8 border-t border-line pt-8">
              <ul className="mono flex flex-wrap gap-x-4 gap-y-2 text-grey" aria-label="Tags">
                {meta.tags.map((t) => <li key={t}>#{t}</li>)}
              </ul>
              <div className="mono flex flex-wrap gap-6">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link text-white"
                >
                  Share on LinkedIn ↗
                </a>
                <button type="button" onClick={copy} className="link text-white">
                  <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
                </button>
              </div>
              <p className="flex items-center gap-4 text-grey">
                <img src={asset('images/me/avatar-256.webp')} alt="" width={48} height={48} loading="lazy" className="h-12 w-12 shrink-0 rounded-full" />
                <span>
                Written by <span className="text-white">{profile.name}</span>, a Java backend developer in {profile.location.split(',')[0]}.{' '}
                <TLink to="/#contact" className="link text-white">Say hello →</TLink>
                </span>
              </p>
            </footer>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="wrap border-t border-line py-20 md:py-28">
          <h2 id="related-title" className="title">Keep reading</h2>
          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
            {related.map((p, i) => (
              <div key={p.slug} data-reveal style={{ '--d': i * 100 } as React.CSSProperties}>
                <PostPanel post={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="Previous and next article" className="wrap grid border-t border-line md:grid-cols-2">
        {previous ? (
          <TLink to={`/blog/${previous.slug}`} className="group grid gap-3 py-12 md:pr-8">
            <span className="mono text-grey">← Older</span>
            <span className="title text-white transition-transform duration-500 group-hover:-translate-x-1">{previous.title}</span>
          </TLink>
        ) : <span />}
        {next && (
          <TLink to={`/blog/${next.slug}`} className="group grid gap-3 border-t border-line py-12 text-right md:border-l md:border-t-0 md:pl-8">
            <span className="mono text-grey">Newer →</span>
            <span className="title text-white transition-transform duration-500 group-hover:translate-x-1">{next.title}</span>
          </TLink>
        )}
      </nav>
    </>
  )
}
