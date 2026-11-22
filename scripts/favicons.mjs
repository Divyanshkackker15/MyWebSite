/** One-off: draws the "dk" mark and writes the favicons into public/ (results are committed). */
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const font = await fs.readFile(path.resolve('node_modules/@fontsource/inter/files/inter-latin-500-normal.woff'))
const svg = await satori(
  {
    type: 'div',
    props: {
      style: { width: 512, height: 512, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#f5f5f5', fontFamily: 'Inter', fontSize: 300, letterSpacing: -22, paddingBottom: 30 },
      children: 'dk',
    },
  },
  { width: 512, height: 512, fonts: [{ name: 'Inter', weight: 500, style: 'normal', data: font }] },
)
const tmp = path.resolve('node_modules/.renders/mark-512.png')
await fs.mkdir(path.dirname(tmp), { recursive: true })
await fs.writeFile(tmp, new Resvg(svg).render().asPng())
execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open('${tmp}').convert('RGB')
for name, size in [('favicon-32.png', 32), ('favicon-48.png', 48), ('apple-touch-icon.png', 180), ('icon-192.png', 192), ('icon-512.png', 512)]:
    im.resize((size, size), Image.LANCZOS).save('public/' + name)
im.save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
`])
console.log('favicons written')
