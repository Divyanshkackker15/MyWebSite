import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { allPosts } from '../../lib/posts'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../motion/Reveal'
import { PostCard } from '../blog/PostCard'

/** Latest three posts + a link to the full blog. */
export function BlogPreview() {
  const latest = allPosts.slice(0, 3)
  return (
    <section id="writing" className="container-x scroll-mt-20 py-24 md:py-32">
      <div className="grid gap-8">
        <SectionHeader
          id="writing"
          title={<>Notes from the <span className="font-serif font-normal italic text-amber">backend</span>.</>}
          intro="What I learn while building, written down so it sticks (and so it might help you)."
        />
        <Link to="/blog" className="group inline-flex items-center gap-2 justify-self-start text-ink hover:text-amber">
          Read all {allPosts.length} posts
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {latest.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 0.08} className="h-full">
              <PostCard post={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
