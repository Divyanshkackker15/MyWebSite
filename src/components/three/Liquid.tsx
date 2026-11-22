import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LIGHT_HEX, type Light } from '../../data/categories'

/**
 * The site's one object: a ring of black liquid metal.
 *
 * - Geometry: a dense torus whose surface is pushed in and out by animated
 *   3D noise in the vertex shader (normals are re-derived per vertex, so
 *   highlights slide across the surface like on a real fluid).
 * - Look: almost-black clearcoated metal. All colour comes from the
 *   environment it reflects: a dark studio with one soft white key light,
 *   two thin strip lights and two coloured rim panels.
 * - The same scene renders the hero (live) and the still images used for
 *   posters, article covers and project visuals (scripts/renders).
 */

export interface Preset {
  rimA: string
  rimB: string
  key: number
}

export const PRESETS: Record<Light | 'hero', Preset> = {
  hero: { rimA: LIGHT_HEX.volt, rimB: LIGHT_HEX.violet, key: 1 },
  volt: { rimA: LIGHT_HEX.volt, rimB: '#1b3fa8', key: 0.9 },
  violet: { rimA: LIGHT_HEX.violet, rimB: '#d946ef', key: 0.9 },
  magenta: { rimA: LIGHT_HEX.magenta, rimB: '#7c3aed', key: 0.9 },
  emerald: { rimA: LIGHT_HEX.emerald, rimB: '#0e7490', key: 0.9 },
}

const NOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
uniform float uTime;
uniform float uAmp;
vec3 liquid(vec3 p, vec3 n){
  float slow = snoise(p*0.55 + vec3(0.0, uTime*0.16, uTime*0.08));
  float swell = snoise(p*1.1 - vec3(uTime*0.12, 0.0, uTime*0.09)) * 0.35;
  return p + n * (slow + swell) * uAmp;
}
`

function useLiquidMaterial(amp: number) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uAmp: { value: amp } }), [amp])
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a0a0a'),
      metalness: 0.6,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.35,
    })
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${NOISE}`)
        .replace(
          '#include <beginnormal_vertex>',
          `#include <beginnormal_vertex>
          vec3 lq0 = liquid(position, objectNormal);
          vec3 lqA = normalize(cross(objectNormal, abs(objectNormal.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
          vec3 lqB = normalize(cross(objectNormal, lqA));
          vec3 lq1 = liquid(position + lqA * 0.012, objectNormal);
          vec3 lq2 = liquid(position + lqB * 0.012, objectNormal);
          objectNormal = normalize(cross(lq1 - lq0, lq2 - lq0));`,
        )
        .replace('#include <begin_vertex>', 'vec3 transformed = lq0;')
    }
    return m
  }, [uniforms])
  return { material, uniforms }
}

/** A dark studio, rendered once into an environment map the metal reflects. */
function Studio({ preset }: { preset: Preset }) {
  const { gl, scene } = useThree()
  useEffect(() => {
    const room = new THREE.Scene()
    room.background = new THREE.Color('#000000')
    // softbox: bright centre fading to nothing, so reflections have soft edges
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, '#fff')
    grad.addColorStop(0.45, 'rgba(255,255,255,0.55)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 128, 128)
    const soft = new THREE.CanvasTexture(c)
    const panel = (w: number, h: number, color: string, intensity: number, pos: [number, number, number], feather = true) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
        map: feather ? soft : null,
        transparent: feather,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
      mesh.position.set(...pos)
      mesh.lookAt(0, 0, 0)
      room.add(mesh)
    }
    panel(12, 7, '#ffffff', 7 * preset.key, [-2, 7, 3]) // big soft key, above
    panel(0.45, 11, '#ffffff', 30 * preset.key, [6, 0.5, 3], false) // crisp strip, right
    panel(14, 0.3, '#ffffff', 22 * preset.key, [0, 1.5, 7], false) // crisp strip, front
    panel(3, 12, '#ffffff', 3 * preset.key, [6.5, 0, 2]) // glow around the strip
    panel(10, 12, preset.rimA, 3.2, [-7, -0.5, -2]) // coloured rim, left-back
    panel(10, 12, preset.rimB, 2.6, [7, -1, -3]) // coloured rim, right-back
    panel(16, 6, preset.rimA, 0.7, [0, -7, 1]) // faint bounce from below
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(room, 0.035).texture
    scene.environment = env
    return () => {
      env.dispose()
      pmrem.dispose()
      soft.dispose()
      room.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          ;(o.material as THREE.Material).dispose()
        }
      })
    }
  }, [gl, scene, preset])
  return null
}

export interface LiquidProps {
  preset?: keyof typeof PRESETS
  /** fixed time for still renders; undefined = animate */
  time?: number
  /** rotation of the object, radians */
  angle?: [number, number, number]
  /** follow the pointer and page scroll */
  interactive?: boolean
  /** 0 → 1 as the hero scrolls away (interactive only) */
  scrollRef?: React.RefObject<number>
  detail?: 'high' | 'low'
  onReady?: () => void
}

function Ring({ time, angle = [0.55, -0.35, 0.18], interactive, scrollRef, detail = 'high', onReady }: LiquidProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const { material, uniforms } = useLiquidMaterial(0.13)
  const geometry = useMemo(
    () => (detail === 'high' ? new THREE.TorusGeometry(1.08, 0.5, 160, 420) : new THREE.TorusGeometry(1.08, 0.5, 96, 240)),
    [detail],
  )
  const pointer = useRef({ x: 0, y: 0 })
  const frames = useRef(0)

  useEffect(() => {
    if (!interactive) return
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [interactive])

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    if (time === undefined) uniforms.uTime.value += Math.min(delta, 0.05)
    else uniforms.uTime.value = time
    const scroll = scrollRef?.current ?? 0
    if (interactive) {
      const t = state.clock.elapsedTime
      const tx = angle[0] + pointer.current.y * 0.18 + scroll * 0.6
      const ty = angle[1] + pointer.current.x * 0.28 + t * 0.05
      m.rotation.x += (tx - m.rotation.x) * 0.04
      m.rotation.y += (ty - m.rotation.y) * 0.04
      m.rotation.z = angle[2]
      m.position.y = Math.sin(t * 0.5) * 0.05 + scroll * 0.9
      const s = 1 - scroll * 0.18
      m.scale.setScalar(s)
    } else {
      m.rotation.set(...angle)
    }
    if (frames.current < 4 && ++frames.current === 4) onReady?.()
  })

  return <mesh ref={mesh} geometry={geometry} material={material} rotation={angle} />
}

export function LiquidCanvas({
  preset = 'hero',
  className,
  still = false,
  dpr = [1, 1.75],
  frameloop = 'always',
  ...ring
}: LiquidProps & { className?: string; still?: boolean; dpr?: number | [number, number]; frameloop?: 'always' | 'never' }) {
  const p = PRESETS[preset]
  return (
    <Canvas
      className={className}
      dpr={dpr}
      frameloop={frameloop}
      camera={{ fov: 28, position: [0, 0, 7.2], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: still, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <Studio preset={p} />
      <Ring {...ring} preset={preset} />
    </Canvas>
  )
}
