import rawPosts from 'virtual:posts'
import type { PostMeta } from '../../plugins/posts-index'
import { lazyPage } from './lazyPage'

export type { PostMeta }

const posts = rawPosts as PostMeta[]

/** All posts, newest first (metadata only — articles load on demand). */
export const allPosts: PostMeta[] = posts

export const featuredPost: PostMeta | undefined = posts.find((p) => p.featured) ?? posts[0]

export const categories: string[] = Array.from(new Set(posts.map((p) => p.category)))

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function getNeighbours(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug)
  // list is newest first: "previous" = older post, "next" = newer post
  return { previous: posts[i + 1], next: i > 0 ? posts[i - 1] : undefined }
}

/** Case-insensitive search across title, excerpt, category and tags. */
export function searchPosts(list: PostMeta[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return list
  return list.filter((p) =>
    [p.title, p.excerpt, p.category, ...p.tags].some((field) => field.toLowerCase().includes(q)),
  )
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// ---- article bodies: one code-split chunk per MDX file ----
const modules = import.meta.glob<{ default: React.ComponentType<{ components?: Record<string, unknown> }> }>(
  '../content/blog/*.mdx',
)

const bodies = new Map<string, ReturnType<typeof lazyPage<{ components?: Record<string, unknown> }>>>()

/** Returns a lazily loaded component for the post body (cached per slug). */
export function postBody(slug: string) {
  let entry = bodies.get(slug)
  if (!entry) {
    const loader = modules[`../content/blog/${slug}.mdx`]
    if (!loader) return undefined
    entry = lazyPage(loader)
    bodies.set(slug, entry)
  }
  return entry
}
