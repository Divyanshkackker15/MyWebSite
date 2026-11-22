import { useEffect, useMemo, useState } from 'react'
import { activeCategories, allPosts, archive, featuredPost, formatDate } from '../lib/posts'
import { PostPanel } from '../components/blog/PostPanel'
import { TLink } from '../components/layout/TLink'

/** /blog: featured article, categories, recent panels, and the full archive by year. */
export default function Blog() {
  // the static HTML is rendered for "All"; a ?category= in the URL is applied after load
  const [category, setCategory] = useState('All')
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('category')
    if (c && activeCategories.includes(c)) setCategory(c)
  }, [])

  const choose = (c: string) => {
    setCategory(c)
    const url = c === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(c)}`
    history.replaceState(null, '', url)
  }

  const filtered = useMemo(() => (category === 'All' ? allPosts : allPosts.filter((p) => p.category === category)), [category])
  const showFeatured = category === 'All' && featuredPost
  const recent = filtered.filter((p) => !showFeatured || p.slug !== featuredPost?.slug).slice(0, 4)
  const years = archive(filtered)

  return (
    <>
      <header className="wrap pb-16 pt-36 md:pb-24 md:pt-48">
        <p className="mono text-grey fade-now">Notes from the backend · {allPosts.length} articles</p>
        <h1 className="display-xl rise-now mt-6">
          <span className="line-mask"><span className="ink-fade">Writing.</span></span>
        </h1>
        <p className="fade-now mt-10 max-w-[40ch] text-xl leading-relaxed text-grey" style={{ '--i': 2 } as React.CSSProperties}>
          What I build, break and learn: Java, Spring Boot, backend systems, databases, and the occasional experiment.
        </p>
      </header>

      {showFeatured && featuredPost && (
        <section aria-labelledby="featured-title" className="wrap pb-24 md:pb-32">
          <h2 id="featured-title" className="mono mb-6 text-grey" data-reveal>Featured</h2>
          <div data-reveal>
            <PostPanel post={featuredPost} size="l" split eager />
          </div>
        </section>
      )}

      <section aria-labelledby="recent-title" className="wrap border-t border-line pb-24 pt-12 md:pb-32">
        <div className="flex flex-wrap items-baseline justify-between gap-6">
          <h2 id="recent-title" className="title">{category === 'All' ? 'Recent' : category}</h2>
          <nav aria-label="Categories" className="-mx-1 flex flex-wrap gap-x-1 gap-y-2">
            {['All', ...activeCategories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => choose(c)}
                aria-pressed={category === c}
                className={`mono border px-3 py-1.5 transition-colors ${category === c ? 'border-white text-white' : 'border-transparent text-grey hover:text-white'}`}
              >
                {c}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {recent.map((p, i) => (
            <div key={p.slug} data-reveal style={{ '--d': (i % 2) * 120 } as React.CSSProperties}>
              <PostPanel post={p} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="archive-title" className="wrap border-t border-line pb-32 pt-12">
        <h2 id="archive-title" className="title">Archive</h2>
        {years.map(({ year, items }) => (
          <div key={year} className="mt-12 grid gap-6 md:grid-cols-12">
            <p className="display-m text-mute md:col-span-3">{year}</p>
            <ol className="md:col-span-9">
              {items.map((p) => (
                <li key={p.slug} className="border-t border-line last:border-b">
                  <TLink to={`/blog/${p.slug}`} className="group grid gap-2 py-5 transition-colors hover:bg-coal md:grid-cols-[7.5rem_1fr_10rem_4rem] md:items-baseline md:gap-6 md:px-3">
                    <time dateTime={p.date} className="mono text-grey">{formatDate(p.date)}</time>
                    <span className="text-lg text-white transition-transform duration-500 md:group-hover:translate-x-2">{p.title}</span>
                    <span className="mono text-grey">{p.category}</span>
                    <span className="mono text-grey md:text-right">{p.readingTime} min</span>
                  </TLink>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </>
  )
}
