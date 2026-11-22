import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import App from './App'
import { preloadRoute, prefetchOtherPages } from './routes'
import './main.css'

/**
 * Browser entry.
 * In production every URL is already a pre-rendered HTML file, so we
 * *hydrate* it (attach React to the existing markup). In `npm run dev`
 * there is no pre-rendered markup, so we render from scratch.
 */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// The shareable preview build runs inside a sandboxed page that can't change
// its URL, so it keeps the route in memory instead (VITE_PREVIEW_EMBED=1).
const Router = import.meta.env.VITE_PREVIEW_EMBED ? MemoryRouter : BrowserRouter
const start = import.meta.env.VITE_PREVIEW_EMBED ? '/' : window.location.pathname

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
)

preloadRoute(start).then(() => {
  if (container.firstElementChild) hydrateRoot(container, app)
  else createRoot(container).render(app)
  prefetchOtherPages()
})
