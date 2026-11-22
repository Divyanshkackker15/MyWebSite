import { lazyPage } from './lib/lazyPage'
import { postBody } from './lib/posts'

/**
 * Every page is its own code-split chunk. `preloadRoute()` loads the chunk(s)
 * a URL needs; it is awaited before hydration (entry-client) and before
 * server rendering (entry-server), so the first render is never empty.
 */
export const pages = {
  home: lazyPage(() => import('./pages/Home')),
  blog: lazyPage(() => import('./pages/Blog')),
  post: lazyPage(() => import('./pages/Post')),
  notFound: lazyPage(() => import('./pages/NotFound')),
}

export async function preloadRoute(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return pages.home.preload()
  if (path === '/blog') return pages.blog.preload()
  const m = /^\/blog\/([^/]+)$/.exec(path)
  if (m) {
    const body = postBody(m[1])
    if (body) return Promise.all([pages.post.preload(), body.preload()])
  }
  return pages.notFound.preload()
}

/** After the first page is interactive, quietly fetch the others. */
export function prefetchOtherPages() {
  const run = () => Object.values(pages).forEach((p) => p.preload())
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2500)
}
