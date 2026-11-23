import {
  siApachekafka,
  siDocker,
  siGit,
  siKubernetes,
  siMysql,
  siOpenjdk,
  siRedis,
  siSpring,
  siSpringboot,
  siSpringsecurity,
  type SimpleIcon,
} from 'simple-icons'
import { ScrollWords } from '../motion/ScrollWords'
import { profile } from '../../data/profile'
import { asset } from '../../lib/asset'

/**
 * What I actually work with, grouped. Keep it honest: only tools used in real projects.
 * `img` uses the 3D icon from the Figma "Tech Stack 3D Icon Set" (public/images/stack);
 * tools that set has no icon for use their simple-icons glyph.
 */
const stack: { group: string; items: { name: string; icon: SimpleIcon; img?: string }[] }[] = [
  {
    group: 'Backend',
    items: [
      { name: 'Java', icon: siOpenjdk, img: 'java' },
      { name: 'Spring Boot', icon: siSpringboot },
      { name: 'Spring Security', icon: siSpringsecurity },
      { name: 'Spring AI', icon: siSpring },
    ],
  },
  {
    group: 'Data',
    items: [
      { name: 'MySQL', icon: siMysql },
      { name: 'Redis', icon: siRedis, img: 'redis' },
      { name: 'Kafka', icon: siApachekafka },
    ],
  },
  {
    group: 'Delivery',
    items: [
      { name: 'Docker', icon: siDocker },
      { name: 'Kubernetes', icon: siKubernetes },
      { name: 'Git', icon: siGit, img: 'git' },
    ],
  },
]

/**
 * About: the scroll-lit statement, then two short paragraphs beside the
 * stack. No portrait here; the hero already carries the photograph.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="wrap py-[16vh] md:py-[20vh]">
      <p className="mono text-grey" data-reveal>(01) About</p>
      <h2 id="about-title" className="sr-only">About</h2>
      <ScrollWords
        className="display-m mt-10 max-w-[19ch] md:mt-14"
        text="Java by trade {java} and curious by default. I build backends {spring} that stay up, data {mysql} that stays right, and systems {kafka} that keep talking under load {docker}. Then I write down what I learned, mostly so I remember, partly so you don’t have to."
      />

      <div className="mt-20 grid gap-12 border-t border-line pt-12 md:mt-28 md:grid-cols-12 md:gap-8 md:pt-16">
        <div className="grid content-start gap-5 text-lg leading-relaxed text-grey md:col-span-5" data-reveal>
          <p>
            I’m <span className="text-white">{profile.firstName}</span>, a backend developer from {profile.location.split(',')[0]}. I like
            systems you can reason about: clean APIs, honest data models, transactions that hold when everyone clicks at once.
          </p>
          <p>
            Most days that means Java, Spring Boot and MySQL. Some days it’s Kafka, Redis, Docker, or an idea I can’t leave alone. The blog
            is where all of it ends up.
          </p>
        </div>

        <div className="grid content-start gap-8 md:col-span-6 md:col-start-7" data-reveal style={{ '--d': 120 } as React.CSSProperties}>
          {stack.map((g) => (
            <div key={g.group} className="about__group">
              <p className="mono text-mute">{g.group}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <li key={t.name} className="about__chip">
                    {t.img ? (
                      <img src={asset(`images/stack/${t.img}.webp`)} alt="" width={18} height={18} loading="lazy" className="about__icon3d" />
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path d={t.icon.path} fill="currentColor" />
                      </svg>
                    )}
                    {t.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
