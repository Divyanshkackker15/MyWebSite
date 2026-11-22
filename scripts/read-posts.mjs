/** Minimal front-matter reader for build scripts (the full version is plugins/posts-index.ts). */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export function readPosts() {
  const dir = path.join(process.cwd(), 'src', 'content', 'blog')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'))
      return { slug: f.replace(/\.mdx$/, ''), title: String(data.title), category: String(data.category) }
    })
}
