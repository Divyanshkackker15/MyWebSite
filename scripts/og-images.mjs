/**
 * Generates Open Graph images (1200 × 630 PNG): the preview card LinkedIn,
 * WhatsApp, X etc. show when someone shares a link.
 *
 *   dist/og/default.png   home page
 *   dist/og/blog.png      blog index
 *   dist/og/<slug>.png    one per post (title + category)
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
  { name: 'Inter', weight: 400, style: 'normal', data: await font('@fontsource/inter', 'inter-latin-400-normal.woff') },
  { name: 'Inter', weight: 500, style: 'normal', data: await font('@fontsource/inter', 'inter-latin-500-normal.woff') },
  { name: 'Mono', weight: 400, style: 'normal', data: await font('@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff') },
]

// tiny element helper: h('div', { style }, ...children)
// (satori needs every <div> to be display:flex, so it is added by default)
const h = (type, props = {}, ...children) => {
  const kids = children.flat().filter((c) => c !== null && c !== false)
  const style = type === 'div' ? { display: 'flex', ...props.style } : props.style
  return { type, props: { ...props, style, children: kids.length === 1 ? kids[0] : kids } }
}

const LIGHT = { volt: '#3d7bff', violet: '#8b5cf6', magenta: '#e0409a', emerald: '#1fbf8a' }
const CATEGORY_LIGHT = {
  Java: 'volt', 'Spring Boot': 'emerald', 'Backend Engineering': 'volt', 'System Design': 'violet',
  Databases: 'emerald', Development: 'violet', 'Personal Learnings': 'magenta', Experiments: 'magenta',
}

const frame = (light, ...children) =>
  h(
    'div',
    {
      style: {
        width: 1200, height: 630, position: 'relative', overflow: 'hidden', flexDirection: 'column',
        justifyContent: 'space-between', padding: '64px 72px',
        backgroundColor: '#000000',
        backgroundImage: `radial-gradient(circle at 88% 12%, ${light}38, transparent 42%)`,
        fontFamily: 'Inter', color: '#F5F5F5',
      },
    },
    ...children,
  )

const mono = (text, color = '#8A8A8A') =>
  h('div', { style: { fontFamily: 'Mono', fontSize: 20, letterSpacing: 2, textTransform: 'uppercase', color } }, text)

const foot = (left) =>
  h('div', { style: { justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #2A2A2A', paddingTop: 24 } }, mono(left), mono('kackkerdivyansh.in'))

const portrait = `data:image/jpeg;base64,${(await fs.readFile(path.join(root, 'public/images/me/og-portrait.jpg'))).toString('base64')}`

function homeCard() {
  return frame(
    LIGHT.violet,
    { type: 'img', props: { src: portrait, width: 400, height: 500, style: { position: 'absolute', right: 40, bottom: 0 } } },
    mono('Divyansh Kackker'),
    h('div', { style: { flexDirection: 'column', fontSize: 88, fontWeight: 500, letterSpacing: -4, lineHeight: 0.98, maxWidth: 720 } },
      h('div', {}, 'I build the parts'),
      h('div', { style: { color: '#8A8A8A' } }, 'of software nobody sees.'),
    ),
    foot('Java backend developer · Writing'),
  )
}

function postCard({ title, category }) {
  const size = title.length > 70 ? 62 : title.length > 48 ? 72 : 84
  const light = LIGHT[CATEGORY_LIGHT[category] ?? 'volt']
  return frame(
    light,
    h('div', { style: { gap: 18, alignItems: 'center' } }, mono('Writing'), mono('/'), mono(category ?? 'Notes', '#F5F5F5')),
    h('div', { style: { fontSize: size, fontWeight: 500, lineHeight: 1.02, letterSpacing: -2.6, maxWidth: 1040 } }, title),
    foot('Divyansh Kackker'),
  )
}

async function write(name, tree) {
  const svg = await satori(tree, { width: 1200, height: 630, fonts })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  await fs.writeFile(path.join(out, `${name}.png`), png)
  console.log(`  og image  dist/og/${name}.png`)
}

await write('default', homeCard())
await write('blog', postCard({ title: 'Writing. Notes on Java, Spring Boot, databases and system design.', category: 'Notes from the backend' }))
for (const post of readPosts()) await write(post.slug, postCard(post))
