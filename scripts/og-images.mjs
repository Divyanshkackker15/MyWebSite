/**
 * Generates Open Graph images (1200 × 630 PNG): the preview card LinkedIn,
 * WhatsApp, X etc. show when someone shares a link.
 *
 *   dist/og/default.png   home page (photo + name)
 *   dist/og/blog.png      blog index
 *   dist/og/<slug>.png    one per post (title + category + avatar)
 *
 * How: satori turns a small HTML-like tree into SVG, resvg turns the SVG
 * into PNG. Runs at build time only; nothing ships to the browser.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readPosts } from './read-posts.mjs'

const root = process.cwd()
const out = path.join(root, 'dist', 'og')
await fs.mkdir(out, { recursive: true })

const font = (pkg, file) => fs.readFile(path.join(root, 'node_modules', pkg, 'files', file))
const fonts = [
  { name: 'Bricolage', weight: 700, style: 'normal', data: await font('@fontsource/bricolage-grotesque', 'bricolage-grotesque-latin-700-normal.woff') },
  { name: 'Bricolage', weight: 800, style: 'normal', data: await font('@fontsource/bricolage-grotesque', 'bricolage-grotesque-latin-800-normal.woff') },
  { name: 'Geist', weight: 400, style: 'normal', data: await font('@fontsource/geist', 'geist-latin-400-normal.woff') },
  { name: 'Geist', weight: 500, style: 'normal', data: await font('@fontsource/geist', 'geist-latin-500-normal.woff') },
  { name: 'Serif', weight: 400, style: 'italic', data: await font('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff') },
]

const dataUri = async (file) => `data:image/png;base64,${(await fs.readFile(path.join(root, 'public', file))).toString('base64')}`
const portrait = await dataUri('images/portrait-desktop.png')
const avatar = await dataUri('images/avatar-256.png')

// tiny element helper: h('div', { style }, ...children)
// (satori needs every <div> to be display:flex, so it is added by default)
const h = (type, props = {}, ...children) => {
  const kids = children.flat().filter((c) => c !== null && c !== false)
  const style = type === 'div' ? { display: 'flex', ...props.style } : props.style
  return { type, props: { ...props, style, children: kids.length === 1 ? kids[0] : kids } }
}

const C = { void: '#070A12', hull: '#0E1320', wire: '#1F2840', ink: '#E9EDF5', dim: '#8C95AB', amber: '#FFB547', cyan: '#4FD1FF' }

const frame = (...children) =>
  h(
    'div',
    {
      style: {
        width: 1200, height: 630, display: 'flex', position: 'relative', overflow: 'hidden',
        backgroundColor: C.void,
        backgroundImage: 'radial-gradient(circle at 78% 20%, rgba(255,181,71,0.22), transparent 45%), radial-gradient(circle at 8% 100%, rgba(79,209,255,0.14), transparent 40%)',
        fontFamily: 'Geist', color: C.ink,
      },
    },
    // hairline border
    h('div', { style: { position: 'absolute', top: 24, left: 24, right: 24, bottom: 24, border: `1px solid ${C.wire}`, borderRadius: 28, display: 'flex' } }),
    ...children,
  )

const label = (text, color = C.dim) =>
  h('div', { style: { fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color, display: 'flex' } }, text)

function homeCard() {
  return frame(
    h('img', { src: portrait, width: 520, height: 632, style: { position: 'absolute', right: 40, bottom: -2, objectFit: 'contain' } }),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '70px 80px', width: 760 } },
      label('kackkerdivyansh.in', C.cyan),
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column' } },
        h('div', { style: { fontFamily: 'Bricolage', fontWeight: 800, fontSize: 118, letterSpacing: -5, lineHeight: 0.95 } }, 'Divyansh'),
        h('div', { style: { fontFamily: 'Serif', fontStyle: 'italic', fontSize: 124, color: C.amber, lineHeight: 0.95, marginTop: 4 } }, 'Kackker'),
        h('div', { style: { fontSize: 34, marginTop: 28, color: C.ink, display: 'flex' } }, 'Java Backend Developer'),
        h('div', { style: { fontSize: 26, marginTop: 8, color: C.dim, display: 'flex' } }, 'Spring Boot · Microservices · Kafka · REST APIs'),
      ),
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 14 } },
        h('div', { style: { width: 14, height: 14, borderRadius: 7, background: '#5BE49B' } }),
        h('div', { style: { fontSize: 24, color: C.ink } }, 'Available for work & freelance'),
      ),
    ),
  )
}

function postCard({ title, category, eyebrow = 'Blog' }) {
  const size = title.length > 70 ? 58 : title.length > 48 ? 66 : 76
  return frame(
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '70px 80px', width: '100%' } },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 18 } },
        label(`kackkerdivyansh.in · ${eyebrow}`, C.cyan),
        category
          ? h('div', { style: { display: 'flex', fontSize: 20, letterSpacing: 2, textTransform: 'uppercase', color: C.void, background: C.amber, padding: '6px 14px', borderRadius: 8 } }, category)
          : null,
      ),
      h('div', { style: { display: 'flex', fontFamily: 'Bricolage', fontWeight: 700, fontSize: size, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 } }, title),
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 20 } },
        h('img', { src: avatar, width: 76, height: 76, style: { borderRadius: 38 } }),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column' } },
          h('div', { style: { fontSize: 28, fontWeight: 500 } }, 'Divyansh Kackker'),
          h('div', { style: { fontSize: 22, color: C.dim } }, 'Java Backend Developer'),
        ),
      ),
    ),
  )
}

async function write(name, tree) {
  const svg = await satori(tree, { width: 1200, height: 630, fonts })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  await fs.writeFile(path.join(out, `${name}.png`), png)
  console.log(`  og image  dist/og/${name}.png`)
}

await write('default', homeCard())
await write('blog', postCard({ title: 'Notes from the backend: Java, Spring Boot, microservices and system design', eyebrow: 'Blog' }))
for (const post of readPosts()) await write(post.slug, postCard(post))
