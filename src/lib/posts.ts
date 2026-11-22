import rawPosts from 'virtual:posts'
import type { PostMeta } from '../../plugins/posts-index'
import { lazyPage } from './lazyPage'
import { asset } from './asset'
import { categories as categoryList, lightFor, type Light } from '../data/categories'

export type { PostMeta }

const posts = rawPosts as PostMeta[]

/** All posts, newest first (metadata only; article bodies load on demand). */
export const allPosts: PostMeta[] = posts

export const featuredPost: PostMeta | undefined = posts.find((p) => p.featured) ?? posts[0]

/** Categories that have at least one post, in the order of src/data/categories.ts. */
export const activeCategories: string[] = [
  ...categoryList.map((c) => c.name).filter((name) => posts.some((p) => p.category === name)),
  ...Array.from(new Set(posts.map((p) => p.category))).filter((c) => !categoryList.some((x) => x.name === c)),
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function getNeighbours(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug)
  return { previous: posts[i + 1], next: i > 0 ? posts[i - 1] : undefined }
}

/** Same category first, then shared tags, then newest. */
export function relatedPosts(post: PostMeta, count = 3) {
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: (p.category === post.category ? 10 : 0) + p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.p)
}

/** Posts grouped by year, newest year first. */
export function archive(list: PostMeta[] = posts) {
  const years = new Map<string, PostMeta[]>()
  for (const p of list) {
    const y = p.date.slice(0, 4)
    years.set(y, [...(years.get(y) ?? []), p])
  }
  return Array.from(years, ([year, items]) => ({ year, items }))
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const RENDERS_PER_LIGHT = 3

/** posts sharing a light take turns through its renders, oldest first, so neighbours differ */
function renderIndex(post: PostMeta, light: Light) {
  const same = posts.filter((p) => lightFor(p.category) === light).reverse()
  return Math.max(0, same.findIndex((p) => p.slug === post.slug)) % RENDERS_PER_LIGHT
}

/**
 * Cover image for a post, without extension: the post's own `cover:` image,
 * or one of the studio renders lit in the category's colour.
 */
export function coverFor(post: PostMeta): { src: string; light: Light; custom: boolean } {
  const light = lightFor(post.category)
  if (post.cover) return { src: post.cover.startsWith('http') ? post.cover : asset(post.cover.replace(/^\//, '')), light, custom: true }
  return { src: asset(`images/renders/${light}-${renderIndex(post, light) + 1}`), light, custom: false }
}

// ---- article bodies: one code-split chunk per MDX file ----
const modules = import.meta.glob<{ default: React.ComponentType<{ components?: Record<string, unknown> }> }>(
  '../content/blog/*.mdx',
)

const bodies = new Map<string, ReturnType<typeof lazyPage<{ components?: Record<string, unknown> }>>>()

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
