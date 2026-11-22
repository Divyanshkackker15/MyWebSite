import type { ReactNode } from 'react'

/**
 * Small diagram components you can use inside any .mdx post.
 * They are plain HTML/CSS (no diagram library to download) and follow the
 * site theme automatically.
 *
 *   <Flow steps={['Client', 'Gateway', 'Service', 'DB']} caption="…" />
 *   <Layers items={[{ name: 'Controller', note: 'HTTP in/out' }, …]} />
 *   <Compare left={{ title, points }} right={{ title, points }} />
 *   <Callout type="tip" title="…">text</Callout>
 */

export function Flow({ steps, caption, highlight }: { steps: string[]; caption?: string; highlight?: number }) {
  return (
    <figure className="not-prose my-8 rounded-2xl border border-wire bg-hull p-5">
      <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {steps.map((s, i) => (
          <li key={s + i} className="flex flex-col items-center gap-2 md:flex-1 md:flex-row">
            <span
              className={`w-full rounded-xl border px-3 py-3 text-center font-mono text-[13px] ${
                i === highlight ? 'border-amber bg-amber/10 text-amber' : 'border-wire bg-void text-ink'
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="font-mono text-cyan md:px-1">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mt-4 text-center text-sm text-dim">{caption}</figcaption>}
    </figure>
  )
}

export function Layers({ items, caption }: { items: { name: string; note: string }[]; caption?: string }) {
  return (
    <figure className="not-prose my-8 grid gap-2">
      {items.map((it, i) => (
        <div
          key={it.name}
          className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-wire bg-hull px-4 py-3"
          style={{ marginInline: `${i * 3}%` }}
        >
          <span className="font-mono text-sm text-ink">{it.name}</span>
          <span className="text-sm text-dim">{it.note}</span>
        </div>
      ))}
      {caption && <figcaption className="mt-2 text-center text-sm text-dim">{caption}</figcaption>}
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
    <div className="not-prose my-8 grid gap-3 md:grid-cols-2">
      {[left, right].map((side, i) => (
        <div key={side.title} className={`rounded-2xl border p-5 ${i ? 'border-cyan/40 bg-cyan/[0.04]' : 'border-wire bg-hull'}`}>
          <p className={`label ${i ? 'text-cyan' : ''}`}>{side.title}</p>
          <ul className="mt-3 grid gap-2 text-[15px] text-ink/90">
            {side.points.map((p) => (
              <li key={p} className="relative pl-4">
                <span aria-hidden="true" className={`absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full ${i ? 'bg-cyan' : 'bg-dim'}`} />
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
  tip: { label: 'Tip', cls: 'border-ok/40 bg-ok/[0.05]', text: 'text-ok' },
  note: { label: 'Note', cls: 'border-cyan/40 bg-cyan/[0.05]', text: 'text-cyan' },
  warn: { label: 'Watch out', cls: 'border-amber/50 bg-amber/[0.06]', text: 'text-amber' },
  learned: { label: 'What I learned', cls: 'border-amber/50 bg-amber/[0.06]', text: 'text-amber' },
} as const

export function Callout({ type = 'note', title, children }: { type?: keyof typeof CALLOUT; title?: string; children: ReactNode }) {
  const c = CALLOUT[type]
  return (
    <aside className={`not-prose my-8 rounded-2xl border p-5 ${c.cls}`}>
      <p className={`label ${c.text}`}>{title ?? c.label}</p>
      <div className="mt-2 text-[15.5px] leading-relaxed text-ink/90 [&_code]:rounded [&_code]:bg-void [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.88em] [&>p+p]:mt-3">
        {children}
      </div>
    </aside>
  )
}
