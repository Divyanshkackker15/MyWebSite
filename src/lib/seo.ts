import { profile } from '../data/profile'
import { getPost } from './posts'

/**
 * One function decides the <title>, description and Open Graph tags for
 * every URL. It is used twice:
 *   1. at build time by scripts/prerender.mjs, which writes the tags into
 *      each static HTML file (this is what LinkedIn's crawler reads), and
 *   2. in the browser by useDocumentMeta() when you navigate between pages.
 */
export interface PageMeta {
  title: string
  description: string
  path: string
  image: string
  type: 'website' | 'article' | 'profile'
  publishedTime?: string
  tags?: string[]
  noindex?: boolean
}

const SITE = profile.site
const DEFAULT_DESC = `${profile.name} — ${profile.title} in ${profile.location}. Spring Boot, microservices, Kafka and REST API design. Available for work and freelance projects.`

export function getMeta(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') {
    return {
      title: `${profile.name} · ${profile.title}`,
      description: DEFAULT_DESC,
      path: '/',
      image: '/og/default.png',
      type: 'profile',
    }
  }
  if (path === '/blog') {
    return {
      title: `Blog · ${profile.name}`,
      description:
        'Notes from the backend: what I learn building with Java, Spring Boot, microservices, Kafka, Docker and system design.',
      path: '/blog',
      image: '/og/blog.png',
      type: 'website',
    }
  }
  const m = /^\/blog\/([^/]+)$/.exec(path)
  const post = m ? getPost(m[1]) : undefined
  if (post) {
    return {
      title: `${post.title} · ${profile.name}`,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      image: `/og/${post.slug}.png`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    }
  }
  return {
    title: `Page not found · ${profile.name}`,
    description: DEFAULT_DESC,
    path,
    image: '/og/default.png',
    type: 'website',
    noindex: true,
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** HTML string for <head>, used by the pre-renderer. */
export function metaToHtml(meta: PageMeta) {
  const url = SITE + (meta.path === '/' ? '/' : meta.path)
  const image = SITE + meta.image
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    meta.noindex ? `<meta name="robots" content="noindex" />` : '',
    `<meta property="og:site_name" content="${esc(profile.name)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="author" content="${esc(profile.name)}" />`,
    meta.publishedTime ? `<meta property="article:published_time" content="${meta.publishedTime}" />` : '',
    ...(meta.tags ?? []).map((t) => `<meta property="article:tag" content="${esc(t)}" />`),
    `<script type="application/ld+json">${JSON.stringify(jsonLd(meta, url, image)).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.filter(Boolean).join('\n    ')
}

/** Structured data so Google understands "this is a person / an article". */
function jsonLd(meta: PageMeta, url: string, image: string) {
  const person = {
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    url: SITE,
    image: SITE + '/images/avatar-512.png',
    address: { '@type': 'PostalAddress', addressLocality: 'Bhopal', addressRegion: 'Madhya Pradesh', addressCountry: 'IN' },
    sameAs: Object.values(profile.links).filter(Boolean),
  }
  if (meta.type === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title.split(' · ')[0],
      description: meta.description,
      image,
      url,
      datePublished: meta.publishedTime,
      author: person,
      keywords: meta.tags?.join(', '),
    }
  }
  return { '@context': 'https://schema.org', ...person }
}
