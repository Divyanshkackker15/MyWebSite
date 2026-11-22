# kackkerdivyansh.in

Portfolio and blog of **Divyansh Kackker**, Java Backend Developer · Spring Boot Microservices Enthusiast.

React · Vite · TypeScript · Tailwind CSS · Framer Motion · Lenis · GSAP ScrollTrigger · React Three Fiber · React Router · MDX.
Fully static: every page is pre-rendered to HTML at build time and hosted on Cloudflare Pages.

---

## 1. Run it

Requires **Node.js 20+** (22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173 with hot reload
npm run build      # production build + pre-render + OG images → dist/
npm run preview    # serve dist/ exactly like Cloudflare does → http://localhost:4173
npm run typecheck  # TypeScript check
```

## 2. Before going live: fill these in

Everything below is a placeholder on purpose. Nothing was invented, and empty links are hidden automatically.

| What | Where |
| --- | --- |
| LinkedIn, GitHub, LeetCode URLs | `src/data/profile.ts` → `links` |
| GoCruze and Votezy repo URLs (and live demos) | `src/data/projects.ts` → `github`, `live` |
| Infosys and AICTE certificate links | `src/data/experience.ts` → `certificate` |
| Contact form | Create a free form at formspree.io, put its id in `.env` as `VITE_FORMSPREE_ID=...` (and in Cloudflare → Settings → Environment variables) |
| Résumé | `public/resume.pdf` (currently the PDF you shared; it includes your phone number) |
| Blog post dates | `date:` in each `src/content/blog/*.mdx` (all set to the launch date) |
| Freelance services and the 4-phase process copy | `src/data/services.ts` (draft wording, edit freely) |

The phone number is deliberately **not** on the site.

## 3. Editing content

All text about you lives in `src/data/`. Components only read from there.

| File | Controls |
| --- | --- |
| `profile.ts` | name, title, summary, email, links, availability, the 4 stat counters |
| `journey.ts` | Java → Spring Boot → Microservices → System Design timeline |
| `skills.ts` | the six skill cards |
| `projects.ts` | GoCruze and Votezy case studies, including the request-flow diagram steps |
| `experience.ts` | Infosys Springboard and AICTE IDEA Lab |
| `education.ts` | B.Tech, Class XII, Class X |
| `services.ts` | "What I can help with" list + Discover / Design / Build / Launch phases |
| `sections.ts` | order and labels of home sections (drives the `[ 04 / 10 ]` counters and the data bus) |

Colours and fonts are design tokens at the top of `src/main.css` (`@theme { … }`).

## 4. Adding a blog post (one file)

Create `src/content/blog/my-new-post.mdx`. The file name becomes the URL (`/blog/my-new-post`).

~~~mdx
---
title: "My new post"
excerpt: "One or two sentences shown on cards, in search results and in the LinkedIn preview."
date: 2026-12-01
category: Spring Boot        # creates a new category tab automatically if it's new
tags: [spring-boot, testing]
cover: mesh                  # mesh | shield | locks | index | stream | containers | balancer | neural
featured: false              # true = big card at the top of /blog (only one post should be featured)
---

Intro paragraph…

## A heading (appears in the table of contents)

```java
// code blocks are highlighted at build time and get a copy button
```

<Callout type="tip">Also available: note, warn, learned</Callout>
<Flow steps={['Client', 'API', 'Database']} caption="A simple diagram" highlight={1} />
<Layers items={[{ name: 'Controller', note: 'HTTP' }, { name: 'Service', note: 'logic' }]} />
<Compare left={{ title: 'Before', points: ['…'] }} right={{ title: 'After', points: ['…'] }} />
~~~

That's all. On the next build the post gets: its page, a card on `/blog` and on the home page, search and filtering, reading time, table of contents, a generated cover, a sitemap entry and its own LinkedIn/OG preview image.

## 5. The photo

`scripts/photo/process_headshot.py` (`npm run photo`, needs `pip install numpy scipy pillow`) turns `assets-src/headshot-original.webp` into:

- `public/images/portrait-desktop|mobile.(webp|png)`: background removed, gentle grade, amber/cyan rim light
- `public/images/avatar-256|512.(webp|png)`: circular avatar with an amber ring
- `public/favicon*.png`, `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png`

Background removal uses a colour-unmixing key: on a white backdrop we can solve `observed = α·subject + (1−α)·white` per pixel, which keeps hair strands and removes the white halo. The face is never reshaped or smoothed.

---

## 6. Architecture (for interviews)

```
                 build time (npm run build)                               runtime (browser)
┌──────────────────────────────────────────────────────────┐     ┌──────────────────────────────┐
│ src/data/*.ts ─┐                                          │     │ static HTML (already full)   │
│ content/*.mdx ─┼─► Vite (client bundle, code-split)  ───► │ ──► │   → hydrateRoot() attaches   │
│ posts-index ───┘   Vite (SSR bundle) ─► prerender.mjs     │     │     React to it              │
│                       renders every route to .html        │     │   → Lenis, cursor, motion    │
│                    og-images.mjs ─► 1200×630 PNG per page │     │   → 3D mesh lazy (desktop)   │
└──────────────────────────────────────────────────────────┘     └──────────────────────────────┘
```

**Why pre-render a React app?** LinkedIn, WhatsApp and many crawlers don't run JavaScript. A normal single-page app sends them an empty `<div id="root">`, so shared links show no title or image. `scripts/prerender.mjs` renders each route with React's `prerenderToNodeStream` at build time and writes the HTML plus that page's `<title>`, description, canonical URL, Open Graph tags and JSON-LD. The browser then *hydrates* that HTML instead of building it from scratch, which also makes first paint faster.

**One source of truth for SEO.** `src/lib/seo.ts → getMeta(path)` is used by the pre-renderer (static tags) and by `useDocumentMeta()` in the browser (tags update on client-side navigation).

**Blog without a backend.** A tiny Vite plugin (`plugins/posts-index.ts`) reads every post's front-matter at build time, computes reading time and extracts headings for the table of contents, and exposes the list as `virtual:posts`. The list is small and loads with the app; each article body is its own lazily-loaded chunk. MDX compiles posts to React components; Shiki highlights code at build time, so there's no highlighting JavaScript in the browser.

**Code splitting with preloading.** Each page is a separate chunk (`src/routes.tsx`). `lazyPage()` lets `entry-client.tsx` *await the current page's chunk before hydrating*, so the pre-rendered HTML is never replaced by a loading state. Other pages are prefetched when the browser is idle.

**Motion system.**
- *Lenis* (`SmoothScroll.tsx`) smooths wheel scrolling; touch devices keep native scrolling; it's off for reduced motion.
- *Framer Motion* via `LazyMotion`: components use light `m.*` elements, and the animation engine loads in a separate chunk after first paint. `MotionConfig reducedMotion="user"` removes movement for people who ask for less motion.
- *GSAP ScrollTrigger* is used once, for the pinned, scroll-scrubbed Journey timeline, and is downloaded **only on desktop**.
- *React Three Fiber* draws the hero "service mesh" (nodes = services, packets = requests). It's lazy-loaded only on desktop with a mouse, after the browser is idle, and pauses rendering when off-screen. Phones and reduced-motion visitors get a static SVG of the same network (`meshData.ts` is shared).
- The *data bus* (`DataBus.tsx`) is the connector across sections: a rail with a packet driven by scroll progress, and one node per section placed at that section's real scroll position.
- Custom cursor and magnetic buttons only run on `(hover: hover) and (pointer: fine)` devices.

**Content as data → ready for a Spring Boot API.** Components never hard-code content. Replacing `src/data/projects.ts` with `fetch('/api/projects')` returning the same JSON shape is a one-file change.

**Contact form without a server.** `Contact.tsx` posts `FormData` to Formspree with client-side validation and a honeypot field for spam.

### Folder structure

```
├─ index.html                 shell; <!--app-head--> / <!--app-html--> are filled by the pre-renderer
├─ vite.config.ts             MDX + Shiki + Tailwind + posts-index plugin
├─ plugins/posts-index.ts     front-matter → virtual:posts
├─ scripts/
│  ├─ prerender.mjs           routes → static .html, sitemap.xml, robots.txt
│  ├─ og-images.mjs           OG preview PNGs (satori + resvg)
│  ├─ serve-dist.mjs          local production server (npm run preview)
│  └─ photo/process_headshot.py
├─ public/                    images, favicons, résumé, _headers (Cloudflare), site.webmanifest
└─ src/
   ├─ entry-client.tsx        browser: preload route → hydrate
   ├─ entry-server.tsx        build: render(url) for the pre-renderer
   ├─ App.tsx  routes.tsx     shell, page transitions, lazy pages
   ├─ data/                   ← all editable content
   ├─ content/blog/*.mdx      ← the 8 posts
   ├─ components/
   │  ├─ layout/              Nav, Footer, Preloader, Page (transition), SectionLink
   │  ├─ motion/              SmoothScroll, Cursor, Magnetic, Reveal, WordReveal, CountUp, DataBus
   │  ├─ three/               ServiceMesh (R3F), HeroMesh (lazy loader + SVG fallback), meshData
   │  ├─ sections/            Hero, About, Journey, Skills, Projects, Experience, Available, Process, Education, BlogPreview, Contact
   │  ├─ blog/                PostCard, PostCover, Toc, CodeBlock, Diagrams, AuthorBox, ShareBar
   │  └─ ui/                  Button, Portrait, Socials, CopyEmail, BrandIcon, SectionHeader
   ├─ hooks/                  useMedia (pointer / reduced motion), useDocumentMeta
   └─ lib/                    posts, seo, lazyPage, motionFeatures
```

### Questions you might get, and short answers

- **"Why not Next.js?"** The brief asked for React + Vite. Pre-rendering with ~50 lines (`prerender.mjs`) gives the SEO benefit of static generation while staying a plain Vite app.
- **"How do you keep animations at 60 fps?"** Only `transform` and `opacity` are animated; scroll effects read motion values instead of React state, so nothing re-renders per frame; the 3D scene uses instanced meshes (2 draw calls for all packets) and stops rendering off-screen.
- **"How is accessibility handled?"** Semantic landmarks and headings, skip link, visible focus styles, alt text, `prefers-reduced-motion` support, no custom cursor on touch devices, and dimmed "scroll-lit" text that still meets WCAG AA contrast before it lights up.
- **"What happens without JavaScript?"** The full content is in the HTML. Only the animations are missing.

## 7. Quality checks (local Lighthouse 12, production build with compression)

| Page | Mobile perf / a11y / best practices / SEO | Desktop perf / a11y / best practices / SEO |
| --- | --- | --- |
| `/` | 80 / 100 / 100 / 100 | 98 / 100 / 100 / 100 |
| `/blog` | 91 / 100 / 100 / 100 | 98 / 100 / 100 / 100 |
| `/blog/<post>` | 87–91 / 100 / 100 / 100 | 98 / 100 / 100 / 100 |

The home page on simulated slow 4G stays around 80 because it hydrates a long, animation-heavy page (React + Router + Framer Motion ≈ 130 KB gzip). Unthrottled, it paints in about 0.3 s. Ways to push it past 90 are listed in Future upgrades.

---

## 8. Future upgrades

1. **Spring Boot content API**: move `src/data` and the blog into a Spring Boot + MySQL service with an admin panel (Spring Security, JWT). The site fetches at build time (still static) or at runtime.
2. **"Ask about me" chatbot**: a Spring AI endpoint with RAG over the résumé, project write-ups and blog posts (see the Spring AI post).
3. **Analytics**: Cloudflare Web Analytics (free, cookie-less); one script tag.
4. **Newsletter / RSS**: generate `rss.xml` in `prerender.mjs`.
5. **Mobile performance 90+ on home**: hydrate below-the-fold sections lazily ("islands"), or replace Framer Motion on phones with CSS-only reveals.
6. **Project screenshots or short videos** in the case studies when available.
7. **Dark/light theme toggle** (all colours are already tokens).
8. **Comments on posts** via giscus (GitHub Discussions).
