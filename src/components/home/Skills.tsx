import { useEffect, useRef, useState } from 'react'
import {
  siApachekafka,
  siApachemaven,
  siCss,
  siDocker,
  siHibernate,
  siHtml5,
  siJavascript,
  siKubernetes,
  siLinux,
  siMongodb,
  siMysql,
  siNextdotjs,
  siPostgresql,
  siReact,
  siSpringboot,
  siSpringsecurity,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons'
import { asset } from '../../lib/asset'

/**
 * Skills: what I work with, explore or keep reading about, backend first.
 * A pixel field sits behind the groups and lights up around the pointer (or
 * a finger) in the colour of the group under it; each name wipes into that
 * colour in pixel steps when hovered, focused or tapped.
 */
type Item = { name: string; icon?: SimpleIcon; img?: string }
type Group = { id: string; name: string; note: string; accent: string; items: Item[] }

const groups: Group[] = [
  {
    id: 'backend',
    name: 'Backend Development',
    note: 'Where I spend most days',
    accent: '#8B6CF0',
    items: [
      { name: 'Java', img: 'java' },
      { name: 'Spring Boot', icon: siSpringboot },
      { name: 'Spring Security', icon: siSpringsecurity },
      { name: 'Hibernate', icon: siHibernate },
      { name: 'REST APIs' },
      { name: 'Microservices' },
      { name: 'JDBC' },
      { name: 'Maven', icon: siApachemaven },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    note: 'Enough to ship the whole thing',
    accent: '#9CC2FF',
    items: [
      { name: 'HTML', icon: siHtml5 },
      { name: 'CSS', icon: siCss },
      { name: 'JavaScript', icon: siJavascript },
      { name: 'TypeScript', icon: siTypescript },
      { name: 'React', icon: siReact },
      { name: 'Next.js', icon: siNextdotjs },
      { name: 'Tailwind CSS', icon: siTailwindcss },
      { name: 'Responsive Design' },
    ],
  },
  {
    id: 'data',
    name: 'Databases & Data',
    note: 'Models that stay honest',
    accent: '#3DDC84',
    items: [
      { name: 'MySQL', icon: siMysql },
      { name: 'PostgreSQL', icon: siPostgresql },
      { name: 'Redis', img: 'redis' },
      { name: 'MongoDB', icon: siMongodb },
      { name: 'Database Design' },
      { name: 'SQL Optimization' },
    ],
  },
  {
    id: 'infra',
    name: 'Messaging & Infrastructure',
    note: 'Getting it shipped and talking',
    accent: '#FFCE1F',
    items: [
      { name: 'Apache Kafka', icon: siApachekafka },
      { name: 'Docker', icon: siDocker },
      { name: 'Kubernetes', icon: siKubernetes },
      { name: 'CI/CD' },
      { name: 'Git', img: 'git' },
      { name: 'GitHub', img: 'github' },
      { name: 'Linux', icon: siLinux },
    ],
  },
  {
    id: 'ai',
    name: 'AI & Intelligent Systems',
    note: 'What I’m exploring now',
    accent: '#B9A6FF',
    items: [
      { name: 'AI Agents' },
      { name: 'Agentic Workflows' },
      { name: 'LLM Integration' },
      { name: 'Prompt Engineering' },
      { name: 'RAG' },
      { name: 'Vector Databases' },
      { name: 'AI Tool Calling' },
      { name: 'Automation' },
    ],
  },
  {
    id: 'architecture',
    name: 'Architecture & Engineering',
    note: 'How the pieces hold together',
    accent: '#FF6A2B',
    items: [
      { name: 'System Design' },
      { name: 'Distributed Systems' },
      { name: 'Microservices Architecture' },
      { name: 'Event-Driven Architecture' },
      { name: 'Authentication & Authorization' },
      { name: 'Transaction Management' },
      { name: 'Performance Optimization' },
    ],
  },
]

const pad = (n: number) => String(n).padStart(2, '0')

/** the pixel field: cells brighten near the pointer and fade out; idle = no drawing */
function usePixelField(canvas: React.RefObject<HTMLCanvasElement | null>, area: React.RefObject<HTMLElement | null>) {
  const colour = useRef('#8B6CF0')
  useEffect(() => {
    const c = canvas.current
    const host = area.current
    if (!c || !host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const CELL = 14
    const GAP = 2
    let cols = 0
    let rows = 0
    let heat = new Float32Array(0)
    let raf = 0
    let px = -1
    let py = -1
    const dpr = Math.min(2, window.devicePixelRatio || 1)

    const resize = () => {
      const r = host.getBoundingClientRect()
      c.width = Math.round(r.width * dpr)
      c.height = Math.round(r.height * dpr)
      c.style.width = `${r.width}px`
      c.style.height = `${r.height}px`
      cols = Math.ceil(r.width / CELL)
      rows = Math.ceil(r.height / CELL)
      heat = new Float32Array(cols * rows)
    }
    const draw = () => {
      raf = 0
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.fillStyle = colour.current
      let alive = false
      const cx = Math.floor(px / CELL)
      const cy = Math.floor(py / CELL)
      if (px >= 0) {
        for (let y = cy - 4; y <= cy + 4; y++) {
          for (let x = cx - 4; x <= cx + 4; x++) {
            if (x < 0 || y < 0 || x >= cols || y >= rows) continue
            const d = Math.hypot(x - cx, y - cy)
            if (d > 4.2) continue
            // a little noise so the edge reads as pixels, not a circle
            const v = (1 - d / 4.2) * (0.75 + Math.random() * 0.25)
            const i = y * cols + x
            if (v > heat[i]) heat[i] = v
          }
        }
      }
      for (let i = 0; i < heat.length; i++) {
        const h = heat[i]
        if (h < 0.02) continue
        alive = true
        ctx.globalAlpha = h * 0.75
        ctx.fillRect((i % cols) * CELL + GAP / 2, Math.floor(i / cols) * CELL + GAP / 2, CELL - GAP, CELL - GAP)
        heat[i] = h * 0.9
      }
      ctx.globalAlpha = 1
      if (alive || px >= 0) raf = requestAnimationFrame(draw)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      px = e.clientX - r.left
      py = e.clientY - r.top
      const g = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-accent]')
      if (g?.dataset.accent) colour.current = g.dataset.accent
      kick()
    }
    const leave = () => {
      px = py = -1
      kick()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    host.addEventListener('pointermove', move, { passive: true })
    host.addEventListener('pointerdown', move, { passive: true })
    host.addEventListener('pointerleave', leave)
    host.addEventListener('pointerup', (e) => e.pointerType !== 'mouse' && leave())
    return () => {
      ro.disconnect()
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerdown', move)
      host.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [canvas, area])
}

export function Skills() {
  const field = useRef<HTMLCanvasElement>(null)
  const area = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  usePixelField(field, area)

  return (
    <section id="skills" aria-labelledby="skills-title" className="skills relative border-t border-line">
      <div className="wrap py-[14vh] md:py-[18vh]">
        <header className="text-center">
          <p className="mono text-grey" data-reveal>Skills &amp; interests</p>
          <h2 id="skills-title" className="skills__title rise mx-auto mt-6">
            <span className="line-mask"><span>What I work with.</span></span>
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-grey" data-reveal style={{ '--d': 120 } as React.CSSProperties}>
            Backend first. The rest is what I build with, explore, or keep reading about, from daily tools to ideas I’m still learning.
          </p>
        </header>

        <div ref={area} className="skills__area mt-14 md:mt-20">
          <canvas ref={field} aria-hidden="true" className="skills__field" />
          <div className="skills__grid">
            {groups.map((g, gi) => (
              <section
                key={g.id}
                aria-labelledby={`sk-${g.id}`}
                className={`skills__group ${gi === 0 ? 'is-core' : ''}`}
                data-accent={g.accent}
                data-reveal
                style={{ '--accent': g.accent, '--d': 70 * gi } as React.CSSProperties}
              >
                <header className="flex items-baseline justify-between gap-4">
                  <h3 id={`sk-${g.id}`} className="skills__name">
                    <span className="mono skills__num">{pad(gi + 1)}</span> {g.name}
                  </h3>
                  <span className="mono text-mute">{pad(g.items.length)}</span>
                </header>
                <p className="mono mt-2 text-mute">{g.note}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((t) => {
                    const key = `${g.id}:${t.name}`
                    return (
                      <li
                        key={t.name}
                        tabIndex={0}
                        className={`skill ${active === key ? 'is-on' : ''}`}
                        onClick={() => setActive((a) => (a === key ? null : key))}
                        onBlur={() => setActive((a) => (a === key ? null : a))}
                      >
                        <span className="skill__wipe" aria-hidden="true" />
                        {t.img ? (
                          <img src={asset(`images/stack/${t.img}.webp`)} alt="" width={18} height={18} loading="lazy" className="skill__img" />
                        ) : t.icon ? (
                          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" className="skill__icon">
                            <path d={t.icon.path} fill="currentColor" />
                          </svg>
                        ) : (
                          <span aria-hidden="true" className="skill__pip" />
                        )}
                        <span className="skill__label">{t.name}</span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
