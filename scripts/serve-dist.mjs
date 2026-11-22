/**
 * `npm run preview`: serves dist/ the same way Cloudflare Pages does:
 *   /blog/foo  → dist/blog/foo.html
 *   /          → dist/index.html
 *   unknown    → dist/404.html with status 404
 * Text files are gzip-compressed like Cloudflare does (brotli there), so
 * Lighthouse numbers measured locally are realistic.
 * Zero dependencies.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const dist = path.resolve('dist')
const port = Number(process.env.PORT ?? 4173)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json',
}

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/'
  const candidates = clean === '/' ? ['index.html'] : [clean.slice(1), clean.slice(1) + '.html', path.join(clean.slice(1), 'index.html')]
  for (const c of candidates) {
    const file = path.join(dist, c)
    if (file.startsWith(dist) && fs.existsSync(file) && fs.statSync(file).isFile()) return file
  }
  return null
}

http
  .createServer((req, res) => {
    const file = resolve(req.url ?? '/')
    const status = file ? 200 : 404
    const target = file ?? path.join(dist, '404.html')
    const type = types[path.extname(target)] ?? 'application/octet-stream'
    const compressible = /text|javascript|json|xml|svg|manifest/.test(type)
    const gzip = compressible && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')
    res.writeHead(status, {
      'Content-Type': type,
      ...(gzip ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}),
      ...(target.includes(`${path.sep}assets${path.sep}`) ? { 'Cache-Control': 'public, max-age=31536000, immutable' } : {}),
    })
    const stream = fs.createReadStream(target)
    if (gzip) stream.pipe(zlib.createGzip()).pipe(res)
    else stream.pipe(res)
  })
  .listen(port, () => console.log(`Serving dist/ on http://localhost:${port}`))
