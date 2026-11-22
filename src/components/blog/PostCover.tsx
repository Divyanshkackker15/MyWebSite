import { useId } from 'react'

/**
 * Generated cover art for posts: no stock photos and nothing to licence.
 * Each motif is a tiny drawing of the post's idea, in the site palette.
 * Choose one with `cover:` in the post's front-matter.
 *
 *   mesh        services joined by calls        (microservices)
 *   shield      layered security rings          (auth, JWT)
 *   locks       parallel requests, one lock     (concurrency)
 *   index       a B-tree over table rows        (indexes, queries)
 *   stream      partitions with flowing events  (Kafka)
 *   containers  stacked containers in pods      (Docker / Kubernetes)
 *   balancer    one entry fanning out to many   (load balancing)
 *   neural      layers of connected nodes       (AI)
 */
const CY = '#4FD1FF'
const AM = '#FFB547'
const WI = '#1F2840'

function Motif({ name }: { name: string }) {
  switch (name) {
    case 'shield':
      return (
        <g fill="none">
          {[150, 115, 80, 45].map((r, i) => (
            <circle key={r} cx="400" cy="250" r={r} stroke={i === 3 ? AM : CY} strokeOpacity={0.25 + i * 0.2} strokeWidth={i === 3 ? 3 : 1.5} strokeDasharray={i % 2 ? '6 8' : undefined} />
          ))}
          <rect x="378" y="238" width="44" height="36" rx="6" fill={AM} />
          <path d="M386 238v-12a14 14 0 0 1 28 0v12" stroke={AM} strokeWidth="5" />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2
            return <circle key={i} cx={400 + Math.cos(a) * 190} cy={250 + Math.sin(a) * 190} r="4" fill={CY} fillOpacity="0.5" />
          })}
        </g>
      )
    case 'locks':
      return (
        <g fill="none" strokeWidth="2">
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M120 ${130 + i * 60} C 300 ${130 + i * 60}, 300 250, 400 250`} stroke={CY} strokeOpacity={0.3 + i * 0.1} />
          ))}
          <path d="M400 250 H 680" stroke={AM} strokeWidth="3" />
          <rect x="380" y="225" width="40" height="50" rx="8" fill="#0E1320" stroke={AM} strokeWidth="3" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={160 + i * 22} cy={130 + i * 60} r="6" fill={CY} />
          ))}
          <circle cx="560" cy="250" r="7" fill={AM} />
        </g>
      )
    case 'index':
      return (
        <g fill="none" strokeWidth="2">
          <rect x="370" y="90" width="60" height="30" rx="6" stroke={AM} />
          {[230, 400, 570].map((x) => (
            <g key={x}>
              <path d={`M400 120 L ${x} 190`} stroke={CY} strokeOpacity="0.5" />
              <rect x={x - 45} y="190" width="90" height="28" rx="6" stroke={CY} />
            </g>
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x="160" y={260 + i * 26} width="480" height="16" rx="4" fill={i === 3 ? AM : WI} fillOpacity={i === 3 ? 0.9 : 0.8} />
          ))}
          <path d="M400 218 L 400 330" stroke={AM} strokeDasharray="4 6" />
        </g>
      )
    case 'stream':
      return (
        <g>
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              <rect x="110" y={130 + row * 70} width="580" height="34" rx="8" fill="#0E1320" stroke={WI} strokeWidth="2" />
              {Array.from({ length: 11 }, (_, i) => (
                <rect key={i} x={124 + i * 50} y={138 + row * 70} width="36" height="18" rx="4" fill={(i + row) % 5 === 0 ? AM : CY} fillOpacity={0.15 + ((i + row * 3) % 7) / 10} />
              ))}
            </g>
          ))}
          <circle cx="80" cy="250" r="16" fill={AM} />
          <circle cx="720" cy="200" r="10" fill={CY} />
          <circle cx="720" cy="300" r="10" fill={CY} />
        </g>
      )
    case 'containers':
      return (
        <g fill="none" strokeWidth="2">
          {[0, 1, 2].map((col) => (
            <g key={col}>
              <rect x={150 + col * 180} y="110" width="140" height="280" rx="18" stroke={CY} strokeOpacity="0.4" strokeDasharray="6 8" />
              {[0, 1, 2].map((r) => (
                <rect key={r} x={170 + col * 180} y={140 + r * 80} width="100" height="58" rx="8" fill={col === 1 && r === 1 ? AM : '#0E1320'} stroke={col === 1 && r === 1 ? AM : CY} />
              ))}
            </g>
          ))}
        </g>
      )
    case 'balancer':
      return (
        <g fill="none" strokeWidth="2">
          <circle cx="160" cy="250" r="26" fill={AM} />
          <rect x="300" y="215" width="70" height="70" rx="14" stroke={AM} strokeWidth="3" />
          <path d="M186 250 H 300" stroke={AM} />
          {[110, 180, 250, 320, 390].map((y, i) => (
            <g key={y}>
              <path d={`M370 250 C 470 250, 470 ${y}, 560 ${y}`} stroke={CY} strokeOpacity="0.55" />
              <rect x="560" y={y - 18} width="80" height="36" rx="8" stroke={CY} fill="#0E1320" />
              <circle cx="660" cy={y} r="5" fill={i === 2 ? AM : CY} />
            </g>
          ))}
        </g>
      )
    case 'neural': {
      const layers = [3, 5, 5, 2]
      const pts = layers.map((n, li) => Array.from({ length: n }, (_, i) => [180 + li * 150, 250 + (i - (n - 1) / 2) * 62] as const))
      return (
        <g>
          {pts.slice(0, -1).map((layer, li) =>
            layer.flatMap(([x1, y1], a) =>
              pts[li + 1].map(([x2, y2], b) => (
                <line key={`${li}-${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={CY} strokeOpacity={0.12 + ((a + b) % 3) * 0.08} />
              )),
            ),
          )}
          {pts.flat().map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="11" fill={i >= pts.flat().length - 2 ? AM : '#0E1320'} stroke={CY} strokeWidth="2" />
          ))}
        </g>
      )
    }
    default: {
      // mesh
      const nodes = [
        [400, 250], [250, 150], [560, 140], [230, 340], [580, 350], [120, 240], [690, 250], [400, 100], [400, 400],
      ]
      const links = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [3, 5], [2, 6], [4, 6], [1, 7], [2, 7], [3, 8], [4, 8]]
      return (
        <g>
          {links.map(([a, b], i) => (
            <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={CY} strokeOpacity="0.35" strokeWidth="2" />
          ))}
          {nodes.map(([x, y], i) => (
            <rect key={i} x={x - (i ? 24 : 34)} y={y - (i ? 16 : 22)} width={i ? 48 : 68} height={i ? 32 : 44} rx="9" fill={i ? '#0E1320' : AM} stroke={i ? CY : AM} strokeWidth="2" />
          ))}
        </g>
      )
    }
  }
}

export function PostCover({ motif, label, className = '' }: { motif: string; label?: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 800 500" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="35%" r="75%">
          <stop offset="0" stopColor="#18213a" />
          <stop offset="1" stopColor="#070a12" />
        </radialGradient>
        <pattern id={`grid-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#1F2840" strokeOpacity="0.45" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill={`url(#bg-${id})`} />
      <rect width="800" height="500" fill={`url(#grid-${id})`} />
      <Motif name={motif} />
      {label && (
        <text x="32" y="470" fill="#8C95AB" fontFamily="JetBrains Mono, monospace" fontSize="18" letterSpacing="2">
          {label.toUpperCase()}
        </text>
      )}
    </svg>
  )
}
