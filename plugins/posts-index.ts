import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import type { Plugin } from 'vite'

/**
 * posts-index: a tiny Vite plugin that turns the blog folder into data.
 *
 * At build (and on every change in dev) it reads each MDX file's front-matter,
 * computes the reading time, and pulls out the h2/h3 headings for the table of
 * contents. The result is exposed as a virtual module:
 *
 *     import posts from 'virtual:posts'
 *
 * so the blog list never has to download the full articles.
 * Adding a post = dropping one new .mdx file into src/content/blog/.
 */
const VIRTUAL_ID = 'virtual:posts'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog')
const WORDS_PER_MINUTE = 220

export interface PostMeta {
  slug: string
  title: string
  excerpt: string
  date: string
  updated?: string
  category: string
  tags: string[]
  featured: boolean
  /** cover artwork motif, see src/components/blog/PostCover.tsx */
  cover: string
  order: number
  readingTime: number
  headings: { depth: 2 | 3; text: string; id: string }[]
}

/** Strip inline markdown so heading text matches what rehype-slug sees. */
function plainText(md: string) {
  return md
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~]/g, '')
    .trim()
}

export function readPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
    const { data, content } = matter(raw)
    const slug = file.replace(/\.mdx$/, '')

    // headings outside fenced code blocks
    const slugger = new GithubSlugger()
    const headings: PostMeta['headings'] = []
    let inFence = false
    for (const line of content.split('\n')) {
      if (/^\s*```/.test(line)) inFence = !inFence
      if (inFence) continue
      const m = /^(##|###)\s+(.+?)\s*$/.exec(line)
      if (m) {
        const text = plainText(m[2])
        headings.push({ depth: m[1].length as 2 | 3, text, id: slugger.slug(text) })
      }
    }

    const words = content
      .replace(/<[^>]+>/g, ' ') // JSX components
      .split(/\s+/)
      .filter(Boolean).length

    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date)
    if (!data.title || !data.excerpt || !date || !data.category) {
      throw new Error(`[posts-index] ${file} is missing title, excerpt, date or category in its front-matter`)
    }
    return {
      slug,
      title: String(data.title),
      excerpt: String(data.excerpt),
      date,
      updated: data.updated ? String(data.updated) : undefined,
      category: String(data.category),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      featured: Boolean(data.featured),
      cover: String(data.cover ?? 'mesh'),
      order: Number(data.order ?? 99),
      readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      headings,
    } satisfies PostMeta
  })

  // newest first; when dates tie, the optional `order` front-matter field decides (1 = first)
  return posts.sort((a, b) =>
    a.date !== b.date ? (a.date < b.date ? 1 : -1) : a.order - b.order || a.slug.localeCompare(b.slug),
  )
}

export function postsIndex(): Plugin {
  return {
    name: 'posts-index',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id === RESOLVED_ID) return `export default ${JSON.stringify(readPosts())}`
    },
    configureServer(server) {
      // regenerate the list when a post is added, edited or removed in dev
      server.watcher.add(BLOG_DIR)
      const refresh = (file: string) => {
        if (!file.startsWith(BLOG_DIR)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh)
      server.watcher.on('change', refresh)
      server.watcher.on('unlink', refresh)
    },
  }
}
