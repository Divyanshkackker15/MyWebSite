import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SmoothScroll, scrollToTarget, useLenis } from './components/motion/SmoothScroll'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { useReveal } from './hooks/useReveal'
import { pages } from './routes'

/**
 * App shell, shared by the browser (entry-client) and the build-time
 * renderer (entry-server). Only the router differs between the two.
 * Page transitions use the browser's View Transitions API (see TLink).
 */
function Shell() {
  const location = useLocation()
  const lenis = useLenis()
  useDocumentMeta()
  useReveal(location.pathname)

  // new page: go to the #section in the URL, or to the top
  useEffect(() => {
    const id = decodeURIComponent(location.hash.replace('#', ''))
    if (!id) return scrollToTarget(lenis, 0)
    const t = window.setTimeout(() => scrollToTarget(lenis, id), 80)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash])

  return (
    <>
      <a href="#main" className="mono sr-only z-[110] bg-white px-4 py-3 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes location={location}>
            <Route path="/" element={<pages.home.Component />} />
            <Route path="/blog" element={<pages.blog.Component />} />
            <Route path="/blog/:slug" element={<pages.post.Component />} />
            <Route path="*" element={<pages.notFound.Component />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <SmoothScroll>
      <Shell />
    </SmoothScroll>
  )
}
