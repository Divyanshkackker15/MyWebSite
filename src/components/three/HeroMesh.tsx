import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { buildMesh } from './meshData'

/**
 * Decides whether to load the 3D mesh, and shows a static SVG of the same
 * network until (or instead of) it.
 *
 * three.js (~150 KB gzip) is downloaded only when ALL are true:
 *   - screen ≥ 1024px wide with a mouse/trackpad
 *   - visitor hasn't asked for reduced motion
 *   - the browser is idle after the page loaded
 * Rendering pauses whenever the hero is off-screen.
 */
const ServiceMesh = lazy(() => import('./ServiceMesh'))

export function HeroMesh({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)
  const [ready, setReady] = useState(false)
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const ok =
      window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!ok) return
    const start = () => setLoad(true)
    // wait until the browser is idle so 3D never competes with the first paint
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(start, 1200)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`pointer-events-none ${className}`} aria-hidden="true">
      <StaticMesh className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`} />
      {load && (
        <Suspense fallback={null}>
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <ServiceMesh active={onScreen} onReady={() => setReady(true)} />
          </div>
        </Suspense>
      )}
    </div>
  )
}

/** Flat projection of the same nodes and edges, for phones and reduced motion. */
function StaticMesh({ className }: { className?: string }) {
  const { nodes, edges } = useMemo(() => buildMesh(), [])
  // simple perspective projection (camera at z = 6.4, same as the 3D scene)
  const project = ([x, y, z]: [number, number, number]) => {
    const s = 6.4 / (6.4 - z)
    return [50 + x * s * 11, 50 - y * s * 11, s] as const
  }
  const pts = nodes.map(project)
  return (
    <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="xMidYMid meet">
      <g stroke="#4FD1FF" strokeOpacity="0.18" strokeWidth="0.18">
        {edges.map(([a, b], i) => (
          <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />
        ))}
      </g>
      {pts.map(([x, y, s], i) => (
        <circle key={i} cx={x} cy={y} r={(i % 5 === 0 ? 0.75 : 0.45) * s} fill={i % 5 === 0 ? '#FFB547' : '#4FD1FF'} fillOpacity={0.4 + 0.4 * (s - 0.7)} />
      ))}
    </svg>
  )
}
