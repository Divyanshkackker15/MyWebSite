/**
 * Geometry for the hero "service mesh": nodes = services, edges = calls
 * between them. Plain math with no three.js import, so both the 3D scene
 * and the static SVG fallback can use it.
 */
export type Vec3 = [number, number, number]

/** Deterministic pseudo-random numbers, so server and browser match. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Points spread evenly over a sphere (Fibonacci lattice), with a little jitter. */
export function buildMesh(count = 24, radius = 2.3) {
  const rand = seeded(7)
  const nodes: Vec3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    const jitter = 0.85 + rand() * 0.3
    nodes.push([Math.cos(theta) * r * radius * jitter, y * radius * jitter, Math.sin(theta) * r * radius * jitter])
  }

  // connect every node to its 3 nearest neighbours (no duplicate edges)
  const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`)
  const seen = new Set<string>()
  const edges: [number, number][] = []
  const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => ({ j, d: i === j ? Infinity : dist(n, m) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const k = key(i, j)
        if (!seen.has(k)) {
          seen.add(k)
          edges.push([i, j])
        }
      })
  })

  // adjacency list, used by packets to hop from edge to edge
  const neighbours: number[][] = nodes.map(() => [])
  edges.forEach(([a, b]) => {
    neighbours[a].push(b)
    neighbours[b].push(a)
  })
  return { nodes, edges, neighbours }
}
