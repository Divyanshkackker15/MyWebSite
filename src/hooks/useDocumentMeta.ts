import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getMeta } from '../lib/seo'
import { profile } from '../data/profile'

/**
 * Keeps <title>, description, canonical and OG tags in sync while the visitor
 * navigates client-side. (The first page load already has correct tags from
 * the pre-rendered HTML; crawlers never run this.)
 */
export function useDocumentMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const meta = getMeta(pathname)
    document.title = meta.title
    const set = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }
    const url = profile.site + (meta.path === '/' ? '/' : meta.path)
    set('meta[name="description"]', 'content', meta.description)
    set('link[rel="canonical"]', 'href', url)
    set('meta[property="og:title"]', 'content', meta.title)
    set('meta[property="og:description"]', 'content', meta.description)
    set('meta[property="og:url"]', 'content', url)
    set('meta[property="og:image"]', 'content', profile.site + meta.image)
  }, [pathname])
}
