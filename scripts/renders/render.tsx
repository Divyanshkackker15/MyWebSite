import { createRoot } from 'react-dom/client'
import { LiquidCanvas, PRESETS } from '../../src/components/three/Liquid'

// Dev-only page used by scripts/renders/render.mjs to make still images.
// /scripts/renders/render.html?preset=violet&t=4&ax=0.5&ay=-0.3&az=0.2&glow=0.35
const q = new URLSearchParams(location.search)
const preset = (q.get('preset') ?? 'hero') as keyof typeof PRESETS
const num = (k: string, d: number) => (q.has(k) ? Number(q.get(k)) : d)
const glow = num('glow', 0.3)
const p = PRESETS[preset]
document.getElementById('glow')!.style.background =
  `radial-gradient(45% 55% at 38% 58%, color-mix(in srgb, ${p.rimA} ${glow * 100}%, transparent), transparent 70%),` +
  `radial-gradient(40% 50% at 66% 44%, color-mix(in srgb, ${p.rimB} ${glow * 70}%, transparent), transparent 70%)`

createRoot(document.getElementById('root')!).render(
  <LiquidCanvas
    still
    dpr={1}
    preset={preset}
    time={num('t', 3)}
    angle={[num('ax', 0.55), num('ay', -0.35), num('az', 0.18)]}
    onReady={() => setTimeout(() => ((window as unknown as { __ready: boolean }).__ready = true), 300)}
  />,
)
