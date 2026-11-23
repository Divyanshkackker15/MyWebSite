# kackkerdivyansh.in

Personal site and writing of **Divyansh Kackker**, Java backend developer.

React · Vite · TypeScript · Tailwind CSS · React Three Fiber · Lenis · MDX. Every page is pre-rendered to static HTML and served by Cloudflare Workers; a small Worker handles the contact form.

---

## Run it

Requires **Node.js 20+** (22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173 with hot reload
npm run build      # production build + pre-render + social preview images → dist/
npm run preview    # serve dist/ locally → http://localhost:4173
npm run typecheck
```

To try the contact form locally, copy `.dev.vars.example` to `.dev.vars`, add a Resend API key, then run `npm run build && npx wrangler dev`. `.dev.vars` is git-ignored.

## Write a new article

Create one file: `src/content/blog/my-new-post.mdx`. The file name becomes the URL (`/blog/my-new-post`).

~~~mdx
---
title: "My new post"
excerpt: "One or two sentences for cards, search results and the LinkedIn preview."
date: 2026-12-01
category: Spring Boot        # one of src/data/categories.ts
tags: [spring-boot, testing]
featured: false              # true = the big panel on /blog and the home page (only one post)
cover: /images/my-cover.webp # optional; without it a studio render in the category's light is used
---

Intro paragraph…

## A heading (shows in "On this page")

```java
// highlighted at build time, with a copy button
```

<Callout type="tip">Also: note, warn, learned</Callout>
<Flow steps={['Client', 'API', 'Database']} caption="A simple diagram" highlight={1} />
<Layers items={[{ name: 'Controller', note: 'HTTP' }, { name: 'Service', note: 'logic' }]} />
<Compare left={{ title: 'Before', points: ['…'] }} right={{ title: 'After', points: ['…'] }} />
~~~

Commit and push. The next build adds the page, its panel on `/blog` and the home page, the archive entry, related articles, reading time, the sitemap entry and its own preview image.

**Categories** live in `src/data/categories.ts`: rename, add or reorder them there. Each has a `light` (volt, violet, magenta or emerald) that colours its cover render.

## Edit content

| File | Controls |
| --- | --- |
| `src/data/profile.ts` | name, email, LinkedIn/GitHub links, "Previously", résumé link |
| `src/data/projects.ts` | the Work section (name, one line, stack, links) |
| `src/data/categories.ts` | writing categories and their light colours |
| `src/data/process.ts` | the Before/After cards and the four "How I Work" phases (text, painting, credit) |
| `public/resume.pdf` | the résumé linked from the site |

Empty links are hidden automatically. Colours and type sizes are tokens at the top of `src/main.css`.

## How it works

- **Pre-rendering.** `scripts/prerender.mjs` renders every route with React at build time and writes static HTML with its own title, description, Open Graph tags and JSON-LD, so LinkedIn and search engines see full pages. The browser then hydrates that HTML.
- **Opening sequence.** Pure CSS (`main.css` → "Opening sequence"), so it starts at first paint: a small black-and-white window on the portrait, the name sliding out, then the window grows into the hero while colour floods through it. It plays once per browser tab and never for visitors who prefer reduced motion.
- **Portrait.** `npm run photo` (`scripts/photo/portrait_vibrant.py`) makes the greyscale and colour cutouts, avatar, favicons and preview portrait from `assets-src/headshot-cutout-full.png`. Only colour and light are styled; the face is the original photo.
- **Before / After and How I Work.** Pinned sections driven by scroll position (`useScrollProgress`): a starfield that warps into streaks, cards that rise past the title, and four phases with public-domain paintings (Vermeer, Wright of Derby, from Wikimedia Commons).
- **The 3D object.** `src/components/three/Liquid.tsx`: a torus whose surface is moved by noise in the vertex shader, in almost-black clearcoated metal that reflects a small virtual studio. It runs live only on desktop with a mouse and WebGL2, loads after the page is idle, and stops rendering off-screen. Everyone else sees still renders of the same scene.
- **Still renders.** `npm run renders` (with `npm run dev` running) re-creates the article covers, project visuals and hero posters in `public/images/`. Run it only if you change the object.
- **Motion.** CSS transitions plus one IntersectionObserver (`useReveal`) for reveals; small scroll handlers for the word-by-word About text and the sideways Writing row; Lenis for smooth wheel scrolling; the View Transitions API between pages. No animation library.
- **Contact form.** `Contact.tsx` → `POST /api/contact` → `worker/index.ts` validates the message, drops spam (hidden field, too-fast submits, per-IP limit) and sends it through Resend with `Reply-To` set to the visitor. The email layout is `worker/email.ts`. The API key is a Cloudflare secret and never appears in the code.

```
├─ index.html              shell; the pre-renderer fills <!--app-head--> and <!--app-html-->
├─ wrangler.jsonc          Cloudflare Workers: static files in dist/ + the contact Worker
├─ worker/                 index.ts (POST /api/contact), email.ts (the email you receive)
├─ plugins/posts-index.ts  article front-matter → virtual:posts
├─ scripts/                prerender, og-images, renders/, favicons, photo/
├─ public/                 images, renders, favicons, résumé, _headers
└─ src/
   ├─ data/                profile, projects, categories
   ├─ content/blog/*.mdx   articles
   ├─ components/home/     Intro, Hero, PortraitStage, About, Writing, Work, BeforeAfter, HowIWork, Contact
   ├─ components/blog/     PostPanel, Toc, CodeBlock, Diagrams
   ├─ components/three/    Liquid (the object), RingCanvas
   ├─ components/motion/   SmoothScroll, ScrollWords, HorizontalTrack, Starfield, Particles
   ├─ components/layout/   Nav, Footer, TLink (page transitions)
   └─ pages/               Home, Blog, Post, NotFound
```
