import { allPosts, featuredPost } from '../../lib/posts'
import { PostPanel } from '../blog/PostPanel'
import { HorizontalTrack } from '../motion/HorizontalTrack'
import { TLink } from '../layout/TLink'

/** Home: the featured article and the latest three, travelling sideways. */
export function Writing() {
  const featured = featuredPost
  const recent = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 3)

  return (
    <section id="writing" aria-labelledby="writing-title" className="border-t border-line">
      <HorizontalTrack
        header={
          <div className="wrap flex flex-wrap items-end justify-between gap-6 pb-10 pt-[14vh] lg:pb-12 lg:pt-28">
            <div>
              <p className="mono text-grey" data-reveal>(02) Notes from the backend</p>
              <h2 id="writing-title" className="display-l rise mt-6">
                <span className="line-mask"><span>Writing.</span></span>
              </h2>
            </div>
            <p className="max-w-[30ch] text-grey" data-reveal style={{ '--d': 120 } as React.CSSProperties}>
              What I build, break and figure out, written down properly.{' '}
              <TLink to="/blog" className="link whitespace-nowrap text-white">All {allPosts.length} articles →</TLink>
            </p>
          </div>
        }
      >
        {featured && <PostPanel post={featured} size="l" className="htrack__item htrack__item--l" />}
        {recent.map((p) => (
          <PostPanel key={p.slug} post={p} className="htrack__item" />
        ))}
        <TLink
          to="/blog"
          className="htrack__item htrack__item--end group frame ticks flex flex-col justify-between p-8"
        >
          <span className="mono text-grey">Archive</span>
          <span className="display-m text-white">
            Read
            <br />
            everything
            <span className="ml-3 inline-block transition-transform duration-500 group-hover:translate-x-2">→</span>
          </span>
        </TLink>
      </HorizontalTrack>
    </section>
  )
}
