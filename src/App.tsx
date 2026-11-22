import { Suspense, useCallback, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion'
import { SmoothScroll } from './components/motion/SmoothScroll'
import { Cursor } from './components/motion/Cursor'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Preloader } from './components/layout/Preloader'
import { BootContext } from './components/layout/Boot'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { pages } from './routes'

/**
 * App shell, shared by the browser (entry-client) and the build-time
 * renderer (entry-server). Only the router differs between the two.
 *
 *   LazyMotion                         → animation engine loads in a separate chunk (faster first paint)
 *   MotionConfig reducedMotion="user"  → honours prefers-reduced-motion everywhere
 *   SmoothScroll                       → Lenis
 *   AnimatePresence mode="wait"        → old page plays its exit, then the new one enters
 */
const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default)

export default function App() {
  const location = useLocation()
  const [booted, setBooted] = useState(false)
  const onBooted = useCallback(() => setBooted(true), [])
  useDocumentMeta()

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          <BootContext.Provider value={booted}>
            <Preloader onDone={onBooted} />
            <Cursor />
            <Nav />
            <AnimatePresence mode="wait" initial={false}>
              <Suspense key={location.pathname} fallback={<div className="min-h-screen" />}>
                <Routes location={location}>
                  <Route path="/" element={<pages.home.Component />} />
                  <Route path="/blog" element={<pages.blog.Component />} />
                  <Route path="/blog/:slug" element={<pages.post.Component />} />
                  <Route path="*" element={<pages.notFound.Component />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
            <Footer />
          </BootContext.Provider>
        </SmoothScroll>
      </MotionConfig>
    </LazyMotion>
  )
}
