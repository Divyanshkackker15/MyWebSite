import type { ReactNode } from 'react'

/**
 * Small diagram components usable inside any .mdx post, in plain HTML/CSS:
 *
 *   <Flow steps={['Client', 'Gateway', 'Service', 'DB']} caption="…" highlight={1} />
 *   <Layers items={[{ name: 'Controller', note: 'HTTP in/out' }, …]} />
 *   <Compare left={{ title, points }} right={{ title, points }} />
 *   <Callout type="tip" title="…">text</Callout>
 */

export function Flow({ steps, caption, highlight }: { steps: string[]; caption?: string; highlight?: number }) {
  return (
    <figure className="not-prose my-10 border border-line bg-coal p-5 md:p-6">
      <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {steps.map((s, i) => (
          <li key={s + i} className="flex flex-col items-center gap-2 md:flex-1 md:flex-row">
            <span
              className={`w-full border px-3 py-3 text-center font-mono text-[12.5px] ${
                i === highlight ? 'border-white bg-white text-black' : 'border-line-2 bg-black text-white'
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="font-mono text-grey md:px-1">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mt-4 text-center text-sm text-grey">{caption}</figcaption>}
    </figure>
  )
}

export function Layers({ items, caption }: { items: { name: string; note: string }[]; caption?: string }) {
  return (
    <figure className="not-prose my-10 grid gap-1.5">
      {items.map((it, i) => (
        <div
          key={it.name}
          className="flex flex-wrap items-baseline justify-between gap-2 border border-line bg-coal px-4 py-3"
          style={{ marginInline: `${i * 3}%` }}
        >
          <span className="font-mono text-sm text-white">{it.name}</span>
          <span className="text-sm text-grey">{it.note}</span>
        </div>
      ))}
      {caption && <figcaption className="mt-3 text-center text-sm text-grey">{caption}</figcaption>}
    </figure>
  )
}

export function Compare({
  left,
  right,
}: {
  left: { title: string; points: string[] }
  right: { title: string; points: string[] }
}) {
  return (
    <div className="not-prose my-10 grid gap-px border border-line bg-line md:grid-cols-2">
      {[left, right].map((side, i) => (
        <div key={side.title} className="bg-coal p-5 md:p-6">
          <p className={`mono ${i ? 'text-white' : 'text-grey'}`}>{side.title}</p>
          <ul className="mt-4 grid gap-2.5 text-[15px] text-[#c9c9c9]">
            {side.points.map((p) => (
              <li key={p} className="relative pl-4">
                <span aria-hidden="true" className={`absolute left-0 top-[0.65em] h-1 w-1 ${i ? 'bg-white' : 'bg-grey'}`} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const CALLOUT = {
  tip: 'Tip',
  note: 'Note',
  warn: 'Watch out',
  learned: 'What I learned',
} as const

export function Callout({ type = 'note', title, children }: { type?: keyof typeof CALLOUT; title?: string; children: ReactNode }) {
  return (
    <aside className={`not-prose my-10 border-l pl-5 ${type === 'warn' ? 'border-[#e98a8a]' : 'border-white'}`}>
      <p className="mono text-grey">{title ?? CALLOUT[type]}</p>
      <div className="mt-2 text-[1.05rem] leading-relaxed text-white [&_code]:bg-coal-2 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.86em] [&>p+p]:mt-3">
        {children}
      </div>
    </aside>
  )
}
