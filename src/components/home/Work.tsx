import { hasLink } from '../../data/profile'
import { projects } from '../../data/projects'
import { Img } from '../ui/Img'

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="wrap border-t border-line py-[16vh] md:py-[20vh]">
      <p className="mono text-grey" data-reveal>(03) Selected work</p>
      <h2 id="work-title" className="display-l rise mt-6">
        <span className="line-mask"><span>Things I’ve</span></span>
        <span className="line-mask" style={{ '--i': 1 } as React.CSSProperties}><span className="text-grey">built.</span></span>
      </h2>

      <ol className="mt-20 grid gap-28 md:mt-28 md:gap-40">
        {projects.map((p, i) => (
          <li key={p.id} className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
            <div className={`md:col-span-7 ${i % 2 ? 'md:order-2 md:col-start-6' : ''}`}>
              <div className="frame ticks overflow-hidden p-0" data-reveal="clip">
                <Img src={p.image} alt="" width={1600} height={1100} sizes="(min-width: 768px) 55vw, 100vw" className="aspect-[16/11] w-full object-cover" />
              </div>
            </div>
            <div className={`md:col-span-4 ${i % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-9'}`} data-reveal>
              <p className="mono text-grey">{String(i + 1).padStart(2, '0')} · {p.year}</p>
              <h3 className="display-m mt-5 text-white">{p.name}</h3>
              <p className="mt-5 max-w-[32ch] text-lg leading-relaxed text-grey">{p.line}</p>
              <ul className="mono mt-8 flex flex-wrap gap-x-4 gap-y-2 text-grey" aria-label="Built with">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              {(hasLink(p.github) || hasLink(p.live)) && (
                <p className="mono mt-8 flex gap-6">
                  {hasLink(p.github) && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="link text-white">Source ↗</a>
                  )}
                  {hasLink(p.live) && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="link text-white">Live ↗</a>
                  )}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
