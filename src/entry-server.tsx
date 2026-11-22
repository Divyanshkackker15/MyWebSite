import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { preloadRoute } from './routes'
import { allPosts } from './lib/posts'
import { getMeta, metaToHtml } from './lib/seo'

/**
 * Build-time renderer, used only by scripts/prerender.mjs (never shipped to
 * the browser). For a URL it returns the page HTML and the <head> tags.
 * `prerenderToNodeStream` waits for every lazy chunk, so the output is the
 * complete page.
 */
export async function render(url: string) {
  await preloadRoute(url)
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  let html = ''
  for await (const chunk of prelude) html += chunk.toString()
  return { html, head: metaToHtml(getMeta(url)) }
}

/** Every URL that should become a static file. */
export function routes() {
  return ['/', '/blog', ...allPosts.map((p) => `/blog/${p.slug}`)]
}

export { allPosts }
