/**
 * Blog cover illustrations (run once, results are committed):
 *   node scripts/blog-covers.mjs
 * Draws one SVG per article in the "card shuffle" palette (same gradients as the deck in src/components/home/Blog.tsx),
 * rasterises it with resvg and writes public/images/blog/<slug>.webp (+ -sm.webp).
 * Needs Python with Pillow for the WebP step (scripts/renders/to_webp.py).
 */
import { Resvg } from '@resvg/resvg-js'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const W = 1600
const H = 1000
const out = path.resolve('public/images/blog')
const tmp = path.resolve('node_modules/.blog-covers')
const src = path.resolve('assets-src/blog-covers')
for (const d of [out, tmp, src]) fs.mkdirSync(d, { recursive: true })

// the five card gradients from the Figma riff, 144deg, stops at 2% / 98%
const G = {
  focus: ['#8B6CF0', '#5B3FD0'],
  create: ['#FFCE1F', '#F5A524'],
  explore: ['#3DDC84', '#9CC2FF'],
  build: ['#B9A6FF', '#8B6CF0'],
  ship: ['#FFE27A', '#B9A6FF'],
}
const TX = '#EDEDED'
const line = (a = 0.14) => `rgba(237,237,237,${a})`

const rad = (144 * Math.PI) / 180
const dx = Math.sin(rad) / 2
const dy = -Math.cos(rad) / 2

function defs(main, accent) {
  const grad = (id, [a, b]) =>
    `<linearGradient id="${id}" x1="${0.5 - dx}" y1="${0.5 - dy}" x2="${0.5 + dx}" y2="${0.5 + dy}">
       <stop offset="0.02" stop-color="${a}"/><stop offset="0.98" stop-color="${b}"/></linearGradient>`
  return `<defs>
    ${Object.entries(G).map(([k, v]) => grad(`g-${k}`, v)).join('')}
    <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EDEDED" stop-opacity="0.30"/><stop offset="1" stop-color="#EDEDED" stop-opacity="0"/></linearGradient>
    <radialGradient id="glow-a"><stop offset="0" stop-color="${G[main][0]}" stop-opacity="0.55"/><stop offset="1" stop-color="${G[main][0]}" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow-b"><stop offset="0" stop-color="${G[accent][1]}" stop-opacity="0.40"/><stop offset="1" stop-color="${G[accent][1]}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="${line(0.045)}" stroke-width="1"/></pattern>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>`
}

/** shared frame: background, drifting glows, grid, the two rings */
function frame(main, accent, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(main, accent)}
  <rect width="${W}" height="${H}" fill="#0A0A0A"/>
  <ellipse cx="330" cy="240" rx="620" ry="520" fill="url(#glow-a)"/>
  <ellipse cx="1330" cy="820" rx="600" ry="480" fill="url(#glow-b)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle cx="1380" cy="860" r="230" fill="none" stroke="${line()}" stroke-width="2"/>
  <circle cx="1380" cy="860" r="345" fill="none" stroke="${line(0.09)}" stroke-width="2"/>
  ${body}
</svg>`
}

/** a gradient tile with the riff's border and top gloss */
function tile(x, y, w, h, g, r = 28, extra = '') {
  return `<g ${extra}>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#g-${g})"/>
    <rect x="${x}" y="${y}" width="${w}" height="${Math.min(h, h * 0.48)}" rx="${r}" fill="url(#gloss)" opacity="0.8"/>
    <rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="${r - 1}" fill="none" stroke="${line()}" stroke-width="2"/>
  </g>`
}
const ghost = (x, y, w, h, r = 24, a = 0.16) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="rgba(237,237,237,0.035)" stroke="${line(a)}" stroke-width="2"/>`
const link = (d, a = 0.28, dash = '') =>
  `<path d="${d}" fill="none" stroke="${line(a)}" stroke-width="2" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`
const dot = (x, y, r, fill = TX, a = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${a}"/>`
const shadow = (x, y, w, h, g, r = 28) =>
  `<rect x="${x}" y="${y + 24}" width="${w}" height="${h}" rx="${r}" fill="url(#g-${g})" opacity="0.35" filter="url(#soft)"/>`

// ---------- one motif per article ----------
const covers = {
  /* a monolith splitting into services */
  'monolith-to-microservices': () =>
    frame('focus', 'create', `
      ${shadow(230, 300, 360, 400, 'focus', 40)}
      ${tile(230, 300, 360, 400, 'focus', 40)}
      ${[0, 1, 2, 3].map((i) => `<rect x="270" y="${350 + i * 80}" width="${280 - i * 50}" height="22" rx="11" fill="rgba(237,237,237,0.28)"/>`).join('')}
      ${link('M630 500 C 720 500, 720 500, 790 500', 0.4)}
      <path d="M778 486 L796 500 L778 514" fill="none" stroke="${line(0.5)}" stroke-width="2"/>
      ${[[860, 230, 'build'], [1080, 230, 'create'], [860, 450, 'explore'], [1080, 450, 'ship'], [860, 670, 'create'], [1080, 670, 'focus']]
        .map(([x, y, g], i) => `${tile(x, y, 180, 130, g, 26)}${dot(x + 34, y + 34, 9, '#0A0A0A', 0.55)}<rect x="${x + 30}" y="${y + 78}" width="${70 + (i % 3) * 18}" height="14" rx="7" fill="rgba(10,10,10,0.22)"/>`).join('')}
      ${link('M1040 295 H1080 M1040 515 H1080 M1040 735 H1080 M950 360 V450 M1170 580 V670', 0.32)}
      ${link('M950 580 C 950 620, 1170 620, 1170 670', 0.22, '6 10')}
    `),

  /* header . payload . signature, guarded by roles */
  'secure-rest-apis-spring-security-jwt': () =>
    frame('create', 'focus', `
      ${shadow(200, 410, 1200, 150, 'create', 75)}
      ${tile(200, 410, 330, 150, 'focus', 75)}
      ${dot(568, 485, 12, TX, 0.8)}
      ${tile(606, 410, 420, 150, 'create', 75)}
      ${dot(1064, 485, 12, TX, 0.8)}
      ${tile(1102, 410, 298, 150, 'explore', 75)}
      ${[0, 1, 2].map((i) => `<rect x="${250 + i * 74}" y="476" width="54" height="18" rx="9" fill="rgba(237,237,237,0.45)"/>`).join('')}
      ${[0, 1, 2, 3].map((i) => `<rect x="${656 + i * 86}" y="476" width="64" height="18" rx="9" fill="rgba(10,10,10,0.28)"/>`).join('')}
      <path d="M1220 455 l26 26 l46 -52" fill="none" stroke="rgba(10,10,10,0.55)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      ${['PARENT', 'DRIVER', 'ADMIN'].map((_, i) => ghost(330 + i * 330, 690, 250, 64, 32, 0.4)).join('')}
      ${[0, 1, 2].map((i) => `${dot(372 + i * 330, 722, 10, G[['create', 'explore', 'focus'][i]][0])}<rect x="${398 + i * 330}" y="714" width="${120 - i * 14}" height="16" rx="8" fill="rgba(237,237,237,0.3)"/>`).join('')}
      ${link('M455 560 V690 M815 560 V690 M1245 560 C 1245 620, 1115 640, 1115 690', 0.26, '4 10')}
      <circle cx="800" cy="250" r="86" fill="none" stroke="${line(0.3)}" stroke-width="2"/>
      <rect x="752" y="238" width="96" height="76" rx="16" fill="url(#g-create)"/>
      <path d="M772 238 v-22 a28 28 0 0 1 56 0 v22" fill="none" stroke="${G.create[0]}" stroke-width="12"/>
      ${dot(800, 276, 9, '#0A0A0A', 0.6)}
    `),

  /* two requests racing for one row */
  'race-conditions-transactions-spring-boot': () =>
    frame('explore', 'build', `
      ${link('M120 300 C 520 300, 600 470, 880 490', 0.3)}
      ${link('M120 700 C 520 700, 600 530, 880 510', 0.3)}
      ${[200, 330, 460].map((x, i) => dot(x, i === 2 ? 318 : 300, 14, G.explore[0], 0.35 + i * 0.25)).join('')}
      ${[200, 330, 460].map((x, i) => dot(x, i === 2 ? 682 : 700, 14, G.build[0], 0.35 + i * 0.25)).join('')}
      ${shadow(880, 380, 300, 240, 'explore', 36)}
      ${tile(880, 380, 300, 240, 'explore', 36)}
      <rect x="920" y="430" width="160" height="18" rx="9" fill="rgba(10,10,10,0.3)"/>
      <rect x="920" y="470" width="220" height="18" rx="9" fill="rgba(10,10,10,0.18)"/>
      <rect x="920" y="540" width="110" height="40" rx="20" fill="rgba(10,10,10,0.16)" stroke="rgba(10,10,10,0.4)" stroke-width="2"/>
      ${dot(948, 560, 8, '#0A0A0A', 0.6)}
      <circle cx="1030" cy="500" r="200" fill="none" stroke="${line(0.2)}" stroke-width="2" stroke-dasharray="3 12"/>
      <g transform="translate(1290 250)">
        ${tile(0, 0, 170, 140, 'build', 30)}
        <path d="M45 0 v-30 a40 40 0 0 1 80 0 v30" fill="none" stroke="${G.build[0]}" stroke-width="14"/>
        ${dot(85, 66, 12, '#0A0A0A', 0.55)}<rect x="80" y="70" width="10" height="36" rx="5" fill="#0A0A0A" opacity="0.55"/>
      </g>
      ${link('M1180 470 C 1240 440, 1260 400, 1290 360', 0.3, '6 10')}
    `),

  /* a B-tree with one highlighted search path */
  'faster-queries-indexing-joins-jpa': () => {
    const leaves = Array.from({ length: 9 }, (_, i) => ({ x: 150 + i * 150, y: 720 }))
    const mids = [{ x: 300, y: 470 }, { x: 750, y: 470 }, { x: 1200, y: 470 }]
    const root = { x: 750, y: 220 }
    const hot = { mid: 1, leaf: 4 }
    return frame('build', 'explore', `
      ${mids.map((m, i) => link(`M${root.x + 60} ${root.y + 110} C ${root.x + 60} 360, ${m.x + 60} 360, ${m.x + 60} ${m.y}`, i === hot.mid ? 0.7 : 0.22)).join('')}
      ${leaves.map((l, i) => { const m = mids[Math.floor(i / 3)]; return link(`M${m.x + 60} ${m.y + 100} C ${m.x + 60} 620, ${l.x + 50} 620, ${l.x + 50} ${l.y}`, i === hot.leaf ? 0.7 : 0.18) }).join('')}
      ${shadow(root.x, root.y, 120, 110, 'build', 26)}
      ${tile(root.x, root.y, 120, 110, 'build', 26)}
      ${mids.map((m, i) => (i === hot.mid ? tile(m.x, m.y, 120, 100, 'focus', 24) : ghost(m.x, m.y, 120, 100))).join('')}
      ${leaves.map((l, i) => (i === hot.leaf ? tile(l.x, l.y, 100, 130, 'explore', 22) : ghost(l.x, l.y, 100, 130, 22, 0.13))).join('')}
      ${leaves.map((l, i) => [0, 1, 2].map((k) => `<rect x="${l.x + 20}" y="${l.y + 28 + k * 30}" width="${60 - k * 12}" height="12" rx="6" fill="${i === hot.leaf ? 'rgba(10,10,10,0.3)' : 'rgba(237,237,237,0.12)'}"/>`).join('')).join('')}
      ${dot(root.x + 60, root.y + 55, 12, '#0A0A0A', 0.5)}
    `)
  },

  /* partitioned logs, producer in, consumer group out */
  'kafka-event-driven-microservices': () => {
    const gs = ['ship', 'build', 'create', 'focus', 'explore']
    const rows = [0, 1, 2].map((r) => {
      const y = 300 + r * 160
      const n = 7 - r
      return Array.from({ length: 8 }, (_, i) =>
        i < n ? tile(420 + i * 106, y, 90, 110, gs[(i + r) % gs.length], 20) : ghost(420 + i * 106, y, 90, 110, 20, 0.14),
      ).join('') + link(`M300 ${y + 55} H400`, 0.3)
    })
    return frame('ship', 'focus', `
      ${tile(150, 400, 150, 200, 'focus', 34)}
      ${dot(225, 470, 18, TX, 0.75)}<rect x="185" y="520" width="80" height="16" rx="8" fill="rgba(237,237,237,0.35)"/>
      ${link('M300 500 C 340 500, 340 355, 300 355', 0)}
      ${rows.join('')}
      ${[0, 1, 2].map((r) => `<path d="M${420 + (7 - r) * 106 - 8} ${292 + r * 160} v126" stroke="${TX}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>`).join('')}
      <path d="M1300 300 h40 v430 h-40" fill="none" stroke="${line(0.4)}" stroke-width="2"/>
      ${[0, 1].map((i) => `${ghost(1370, 360 + i * 200, 110, 110, 55, 0.35)}${dot(1425, 415 + i * 200, 14, G[['ship', 'build'][i]][0])}`).join('')}
    `)
  },

  /* image layers become pods */
  'docker-kubernetes-for-java-developers': () => {
    const hex = (cx, cy, r, g, filled = true) => {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i + Math.PI / 6
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
      }).join(' ')
      return filled
        ? `<polygon points="${pts}" fill="url(#g-${g})" stroke="${line()}" stroke-width="2"/>`
        : `<polygon points="${pts}" fill="rgba(237,237,237,0.03)" stroke="${line(0.2)}" stroke-width="2"/>`
    }
    const layers = ['focus', 'build', 'ship', 'create']
    return frame('focus', 'explore', `
      ${layers.map((g, i) => tile(170 + i * 22, 640 - i * 92, 420 - i * 44, 120, g, 28)).join('')}
      ${layers.map((_, i) => `<rect x="${206 + i * 22}" y="${688 - i * 92}" width="${150 - i * 20}" height="16" rx="8" fill="rgba(10,10,10,0.25)"/>`).join('')}
      ${link('M650 520 C 760 520, 760 500, 860 500', 0.4)}
      <path d="M848 486 L866 500 L848 514" fill="none" stroke="${line(0.5)}" stroke-width="2"/>
      ${hex(1050, 360, 105, 'focus')}${hex(1235, 465, 105, 'build')}${hex(1050, 570, 105, 'ship')}
      ${hex(1235, 255, 105, '', false)}${hex(1420, 360, 105, '', false)}${hex(1235, 675, 105, '', false)}
      ${[[1050, 360], [1235, 465], [1050, 570]].map(([x, y]) => `${tile(x - 40, y - 30, 80, 60, 'create', 14)}`).join('')}
      ${dot(1235, 255, 10, TX, 0.35)}${dot(1420, 360, 10, TX, 0.35)}${dot(1235, 675, 10, TX, 0.35)}
    `)
  },

  /* load balancer fan-out, a cache in front of the database */
  'system-design-scalability-caching-redis': () =>
    frame('create', 'explore', `
      ${shadow(160, 420, 200, 160, 'create', 80)}
      ${tile(160, 420, 200, 160, 'create', 80)}
      ${[0, 1, 2].map((i) => `<path d="M${210 + i * 50} 500 h0" stroke="#0A0A0A" stroke-width="18" stroke-linecap="round" opacity="0.5"/>`).join('')}
      ${[250, 470, 690].map((y) => link(`M360 500 C 450 500, 460 ${y + 50}, 560 ${y + 50}`, 0.32)).join('')}
      ${[250, 470, 690].map((y, i) => `${tile(560, y, 220, 100, ['build', 'focus', 'build'][i], 26)}${dot(600, y + 50, 10, TX, 0.75)}<rect x="626" y="${y + 42}" width="110" height="16" rx="8" fill="rgba(237,237,237,0.32)"/>`).join('')}
      ${[250, 470, 690].map((y) => link(`M780 ${y + 50} C 860 ${y + 50}, 860 500, 920 500`, 0.3)).join('')}
      ${shadow(920, 300, 90, 400, 'explore', 45)}
      ${tile(920, 300, 90, 400, 'explore', 45)}
      ${[0, 1, 2, 3, 4].map((i) => dot(965, 350 + i * 75, 11, '#0A0A0A', 0.5)).join('')}
      ${link('M1010 500 H1150', 0.22, '6 10')}
      <g transform="translate(1160 360)">
        <path d="M0 40 v200 a130 40 0 0 0 260 0 v-200" fill="rgba(237,237,237,0.035)" stroke="${line(0.3)}" stroke-width="2"/>
        <ellipse cx="130" cy="40" rx="130" ry="40" fill="rgba(237,237,237,0.06)" stroke="${line(0.3)}" stroke-width="2"/>
        <path d="M0 110 a130 40 0 0 0 260 0 M0 180 a130 40 0 0 0 260 0" fill="none" stroke="${line(0.18)}" stroke-width="2"/>
      </g>
    `),

  /* embeddings: a query finds its nearest neighbours */
  'getting-started-with-spring-ai': () => {
    let s = 7
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    const pts = Array.from({ length: 70 }, () => ({ x: 120 + rnd() * 900, y: 150 + rnd() * 700, r: 4 + rnd() * 7 }))
    const q = { x: 600, y: 480 }
    const near = pts.map((p) => ({ ...p, d: Math.hypot(p.x - q.x, p.y - q.y) })).sort((a, b) => a.d - b.d).slice(0, 5)
    return frame('explore', 'focus', `
      ${pts.map((p) => dot(p.x, p.y, p.r, TX, 0.18)).join('')}
      <circle cx="${q.x}" cy="${q.y}" r="${Math.ceil(near[4].d) + 24}" fill="none" stroke="${line(0.3)}" stroke-width="2" stroke-dasharray="4 10"/>
      ${near.map((p) => link(`M${q.x} ${q.y} L${p.x} ${p.y}`, 0.5)).join('')}
      ${near.map((p, i) => dot(p.x, p.y, 13, G[['explore', 'build', 'ship', 'create', 'focus'][i]][0])).join('')}
      ${dot(q.x, q.y, 30, G.explore[0])}${dot(q.x, q.y, 12, '#0A0A0A', 0.6)}
      ${link(`M${q.x + 30} ${q.y} C 900 ${q.y}, 930 380, 1060 380`, 0.35, '6 10')}
      ${shadow(1060, 250, 400, 250, 'explore', 40)}
      ${tile(1060, 250, 400, 250, 'explore', 40)}
      <path d="M1110 500 l-20 60 l80 -60 z" fill="${G.explore[1]}"/>
      ${[0, 1, 2].map((i) => `<rect x="1105" y="${300 + i * 50}" width="${300 - i * 70}" height="20" rx="10" fill="rgba(10,10,10,0.25)"/>`).join('')}
      ${tile(1180, 600, 280, 110, 'focus', 55)}
      ${[0, 1, 2].map((i) => dot(1250 + i * 70, 655, 12, TX, 0.8 - i * 0.2)).join('')}
    `)
  },
}

for (const [slug, draw] of Object.entries(covers)) {
  const svg = draw()
  fs.writeFileSync(path.join(src, `${slug}.svg`), svg)
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng()
  const pngPath = path.join(tmp, `${slug}.png`)
  fs.writeFileSync(pngPath, png)
  execFileSync(process.platform === 'win32' ? 'python' : 'python3', ['scripts/renders/to_webp.py', pngPath, path.join(out, slug)], { stdio: 'inherit' })
}
