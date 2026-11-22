import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { Page } from '../components/layout/Page'
import { PostCard } from '../components/blog/PostCard'
import { PostCover } from '../components/blog/PostCover'
import { Reveal } from '../components/motion/Reveal'
import { allPosts, categories, featuredPost, formatDate, searchPosts } from '../lib/posts'

const PAGE_SIZE = 9

/**
 * /blog — GridPane-style index.
 * Filters live in the URL (?category=…&tag=…&q=…&page=…) so filtered views
 * can be shared and the back button works.
 */
export default function Blog() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const tag = params.get('tag') ?? ''
  const q = params.get('q') ?? ''
  const page = Math.max(1, Number(params.get('page') ?? 1))

  const filtered = useMemo(() => {
    let list = allPosts
    if (category) list = list.filter((p) => p.category === category)
    if (tag) list = list.filter((p) => p.tags.includes(tag))
    return searchPosts(list, q)
  }, [category, tag, q])

  const isFiltered = Boolean(category || tag || q)
  // the featured post gets its own big card on the unfiltered first page
  const showFeatured = !isFiltered && page === 1 && featuredPost
  const gridPosts = showFeatured ? filtered.filter((p) => p.slug !== featuredPost!.slug) : filtered
  const pages = Math.max(1, Math.ceil(gridPosts.length / PAGE_SIZE))
  const visible = gridPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    if (!('page' in patch)) next.delete('page')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <Page>
      <section className="container-x pb-24 pt-32 md:pt-40">
        <header className="grid gap-8 border-b border-wire pb-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="label text-cyan">Blog · {allPosts.length} posts</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-ink">
              Notes from the <span className="font-serif font-normal italic text-amber">backend</span>.
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg text-dim">
              What I learn building with Java, Spring Boot, microservices, Kafka, Docker and system design, written the way I
              wish someone had explained it to me.
            </p>
          </Reveal>
          <div className="lg:col-span-5">
            <label htmlFor="blog-search" className="label mb-2 block">
              Search posts
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" aria-hidden="true" />
              <input
                id="blog-search"
                type="search"
                value={q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Kafka, JWT, indexing…"
                className="w-full rounded-full border border-wire bg-hull py-3.5 pl-11 pr-4 text-ink placeholder:text-ghost focus:border-amber focus:outline-none"
              />
            </div>
          </div>
        </header>

        {/* category tabs */}
        <nav aria-label="Categories" className="-mx-5 mt-8 overflow-x-auto px-5">
          <ul className="flex w-max gap-2">
            {['', ...categories].map((c) => {
              const activeTab = c === category
              return (
                <li key={c || 'all'}>
                  <button
                    type="button"
                    aria-pressed={activeTab}
                    onClick={() => update({ category: c })}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      activeTab ? 'border-amber bg-amber text-void' : 'border-wire text-dim hover:border-ink/40 hover:text-ink'
                    }`}
                  >
                    {c || 'All'}
                    <span className="ml-2 font-mono text-[11px] opacity-70">
                      {c ? allPosts.filter((p) => p.category === c).length : allPosts.length}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {tag && (
          <p className="mt-5 flex items-center gap-2 text-sm text-dim">
            Tagged
            <button
              type="button"
              onClick={() => update({ tag: '' })}
              className="inline-flex items-center gap-1 rounded-full border border-cyan/40 px-3 py-1 font-mono text-xs text-cyan hover:border-cyan"
            >
              #{tag} <X className="h-3 w-3" aria-label="Remove tag filter" />
            </button>
          </p>
        )}

        {/* featured post */}
        {showFeatured && (
          <Reveal className="mt-10">
            <article className="group relative grid overflow-hidden rounded-[28px] border border-wire bg-hull transition-colors duration-500 hover:border-amber/40 lg:grid-cols-12">
              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[420px]" data-cursor="view" data-cursor-label="Read">
                <PostCover motif={featuredPost!.cover} className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 md:p-10 lg:col-span-5">
                <p className="flex items-center gap-2">
                  <span className="rounded-md bg-amber px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-void">Featured</span>
                  <span className="label">{featuredPost!.category}</span>
                </p>
                <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink transition-colors group-hover:text-amber">
                  <Link to={`/blog/${featuredPost!.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {featuredPost!.title}
                  </Link>
                </h2>
                <p className="text-lg leading-relaxed text-dim">{featuredPost!.excerpt}</p>
                <p className="label">
                  <time dateTime={featuredPost!.date}>{formatDate(featuredPost!.date)}</time> · {featuredPost!.readingTime} min read
                </p>
              </div>
            </article>
          </Reveal>
        )}

        {/* grid */}
        {visible.length ? (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <PostCard post={p} headingLevel={2} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-wire p-10 text-center">
            <p className="font-display text-2xl text-ink">No posts match that.</p>
            <p className="mt-2 text-dim">Try another word, or clear the filters.</p>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-5 text-cyan hover:text-amber">
              Clear filters
            </button>
          </div>
        )}

        {/* pagination (appears once there are more than 9 posts) */}
        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === page ? 'page' : undefined}
                onClick={() => update({ page: String(n) })}
                className={`h-10 w-10 rounded-full border font-mono text-sm ${n === page ? 'border-amber bg-amber text-void' : 'border-wire text-dim hover:text-ink'}`}
              >
                {n}
              </button>
            ))}
          </nav>
        )}
      </section>
    </Page>
  )
}
