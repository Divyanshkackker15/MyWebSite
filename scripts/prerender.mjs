/**
 * Pre-render every route to static HTML (runs after both Vite builds).
 *
 *   dist/index.html              ← "/"
 *   dist/blog.html               ← "/blog"
 *   dist/blog/<slug>.html        ← "/blog/<slug>"
 *   dist/404.html                ← any unknown URL
 *   dist/sitemap.xml, robots.txt
 *
 * Why ".html" files instead of folders with index.html? Cloudflare Pages
 * serves /blog/foo.html at the clean URL /blog/foo, with no trailing-slash
 * redirect, so canonical URLs stay clean.
 *
 * Each file contains the full page markup plus its own <title>,
 * description and Open Graph tags — exactly what LinkedIn, Google and
 * WhatsApp read when someone shares a link (they don't run JavaScript).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')

const { render, routes, allPosts } = await import(pathToFileURL(ssrEntry).href)
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const SITE = 'https://kackkerdivyansh.in'

function fileFor(route) {
  if (route === '/') return 'index.html'
  if (route === '/404') return '404.html'
  return route.slice(1) + '.html'
}

const all = [...routes(), '/404']
for (const route of all) {
  const { html, head } = await render(route === '/404' ? '/this-page-does-not-exist' : route)
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)
  const out = path.join(dist, fileFor(route))
  await fs.mkdir(path.dirname(out), { recursive: true })
  await fs.writeFile(out, page)
  console.log(`  prerendered ${route.padEnd(48)} → dist/${fileFor(route)}`)
}

// ---- sitemap.xml ----
const today = new Date().toISOString().slice(0, 10)
const urls = [
  { loc: '/', lastmod: today, priority: '1.0' },
  { loc: '/blog', lastmod: allPosts[0]?.date ?? today, priority: '0.8' },
  ...allPosts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updated ?? p.date, priority: '0.7' })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${SITE}${u.loc === '/' ? '/' : u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
  .join('\n')}
</urlset>
`
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap)
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`  wrote sitemap.xml (${urls.length} URLs) and robots.txt`)

// the SSR bundle was only needed for this step
await fs.rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
