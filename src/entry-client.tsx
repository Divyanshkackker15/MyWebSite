import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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


const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

preloadRoute(window.location.pathname).then(() => {
  ;(window as unknown as { __dkReady: boolean }).__dkReady = true
  if (container.firstElementChild) hydrateRoot(container, app)
  else createRoot(container).render(app)
  prefetchOtherPages()
})
