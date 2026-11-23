import { ScrollWords } from '../motion/ScrollWords'
import { hasLink, profile } from '../../data/profile'
import { asset } from '../../lib/asset'

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="wrap py-[18vh] md:py-[24vh]">
      <p className="mono text-grey" data-reveal>(01) About</p>
      <h2 id="about-title" className="sr-only">About</h2>
      <ScrollWords
        className="display-m mt-10 max-w-[19ch] md:mt-14"
        text="Java by trade {java} and curious by default. I build backends {spring} that stay up, data {mysql} that stays right, and systems {kafka} that keep talking under load {docker}. Then I write down what I learned, mostly so I remember, partly so you don’t have to."
      />

      <div className="mt-24 grid gap-14 md:mt-36 md:grid-cols-12 md:gap-8">
        <figure className="md:col-span-4" data-reveal="clip">
          <img
            src={asset('images/portrait-bw.webp')}
            srcSet={`${asset('images/portrait-bw-sm.webp')} 480w, ${asset('images/portrait-bw.webp')} 960w`}
            sizes="(min-width: 768px) 30vw, 90vw"
            alt={`${profile.name}, portrait`}
            width={960}
            height={1200}
            loading="lazy"
            className="aspect-[4/5] w-full max-w-[420px] border border-line object-cover"
          />
        </figure>

        <div className="grid content-between gap-14 md:col-span-7 md:col-start-6">
          <div className="grid max-w-[34rem] gap-5 text-lg leading-relaxed text-grey" data-reveal>
            <p>
              I’m <span className="text-white">{profile.firstName}</span>, a backend developer from Bhopal. I like systems you can reason
              about: clean APIs, honest data models, transactions that hold when everyone clicks at once.
            </p>
            <p>
              Most days that means Java, Spring Boot and MySQL. Some days it’s Kafka, Redis, Docker, or an idea I can’t leave alone. The
              writing below is where all of it ends up.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2" data-reveal style={{ '--d': 150 } as React.CSSProperties}>
            <div>
              <p className="mono text-mute">Previously</p>
              <ul className="mt-4 grid gap-3">
                {profile.previously.map((p) => (
                  <li key={p.org} className="border-t border-line pt-3">
                    <span className="block text-white">{p.org}</span>
                    <span className="text-sm text-grey">{p.role}, {p.year}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mono text-mute">Elsewhere</p>
              <ul className="mt-4 grid gap-3">
                {hasLink(profile.links.linkedin) && (
                  <li className="border-t border-line pt-3">
                    <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link text-white">LinkedIn ↗</a>
                  </li>
                )}
                {hasLink(profile.links.github) && (
                  <li className="border-t border-line pt-3">
                    <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link text-white">GitHub ↗</a>
                  </li>
                )}
                <li className="border-t border-line pt-3">
                  <a href={profile.resumeUrl} target="_blank" rel="noopener" className="link text-white">Résumé (PDF) ↗</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
