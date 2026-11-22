import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildMesh } from './meshData'

/**
 * The hero's 3D element (loaded lazily, desktop only).
 *
 * A slowly turning sphere of "services" (nodes) joined by "calls" (lines).
 * Glowing packets travel along the lines and hop to a neighbouring line
 * when they arrive, like requests moving through a microservice system.
 * The whole mesh tilts a little toward the mouse.
 *
 * Performance: ~24 nodes + 18 packets drawn with two InstancedMeshes
 * (2 draw calls), one LineSegments, and rendering pauses off-screen.
 */
const CYAN = new THREE.Color('#4FD1FF')
const AMBER = new THREE.Color('#FFB547')
const PACKETS = 18

function Mesh() {
  const group = useRef<THREE.Group>(null)
  const packetMesh = useRef<THREE.InstancedMesh>(null)
  const haloMesh = useRef<THREE.InstancedMesh>(null)
  const { nodes, edges, neighbours } = useMemo(() => buildMesh(), [])

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], i) => positions.set([...nodes[a], ...nodes[b]], i * 6))
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [nodes, edges])

  const nodePositions = useMemo(() => nodes.map((n) => new THREE.Vector3(...n)), [nodes])

  // each packet: from node → to node, progress t, speed
  const packets = useMemo(
    () =>
      Array.from({ length: PACKETS }, (_, i) => {
        const [from, to] = edges[(i * 7) % edges.length]
        return { from, to, t: (i * 0.137) % 1, speed: 0.25 + ((i * 37) % 10) / 25 }
      }),
    [edges],
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    // slow spin + pointer tilt (lerp for smoothness)
    g.rotation.y += dt * 0.09
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.25, 0.04)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -state.pointer.x * 0.12, 0.04)

    packets.forEach((p, i) => {
      p.t += dt * p.speed
      if (p.t >= 1) {
        // arrived: hop to a random neighbour that isn't where we came from
        const options = neighbours[p.to].filter((n) => n !== p.from)
        const next = options.length ? options[Math.floor(Math.random() * options.length)] : p.from
        p.from = p.to
        p.to = next
        p.t = 0
      }
      tmp.lerpVectors(nodePositions[p.from], nodePositions[p.to], p.t)
      dummy.position.copy(tmp)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      packetMesh.current?.setMatrixAt(i, dummy.matrix)
      dummy.scale.setScalar(3.2)
      dummy.updateMatrix()
      haloMesh.current?.setMatrixAt(i, dummy.matrix)
    })
    if (packetMesh.current) packetMesh.current.instanceMatrix.needsUpdate = true
    if (haloMesh.current) haloMesh.current.instanceMatrix.needsUpdate = true
  })

  // colour each packet once: mostly cyan, every 4th amber
  const setColors = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh || mesh.instanceColor) return
    for (let i = 0; i < PACKETS; i++) mesh.setColorAt(i, i % 4 === 0 ? AMBER : CYAN)
  }

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={CYAN} transparent opacity={0.16} depthWrite={false} />
      </lineSegments>

      {nodePositions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 5 === 0 ? 0.05 : 0.03, 12, 12]} />
          <meshBasicMaterial color={i % 5 === 0 ? AMBER : CYAN} transparent opacity={0.75} />
        </mesh>
      ))}

      <instancedMesh
        ref={(m) => {
          packetMesh.current = m
          setColors(m)
        }}
        args={[undefined, undefined, PACKETS]}
      >
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh
        ref={(m) => {
          haloMesh.current = m
          setColors(m)
        }}
        args={[undefined, undefined, PACKETS]}
      >
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  )
}

export default function ServiceMesh({ active, onReady }: { active: boolean; onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop={active ? 'always' : 'never'}
      onCreated={() => onReady()}
      aria-hidden="true"
    >
      <Mesh />
    </Canvas>
  )
}
