import { ScrollWords } from '../motion/ScrollWords'
import { asset } from '../../lib/asset'

/**
 * About. A centred introduction in liquid-metal type over a slow chrome render
 * (the site's own liquid object), then the two paragraphs in a calm reading
 * column. The lead rises out of its mask, the middle line lights up word by
 * word as you scroll, the rest fades in.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="about relative overflow-hidden">
      <div aria-hidden="true" className="about__metal">
        <img src={asset('images/hero-wide-sm.webp')} srcSet={`${asset('images/hero-wide-sm.webp')} 1200w, ${asset('images/hero-wide.webp')} 2400w`} sizes="100vw" alt="" width={2400} height={1350} loading="lazy" />
      </div>

      <div className="wrap relative py-[16vh] text-center md:py-[20vh]">
        <p className="mono text-grey" data-reveal>(01) About</p>

        <h2 id="about-title" className="about__lead rise mx-auto mt-8">
          <span className="line-mask"><span className="metal-text">Java by trade,</span></span>
          <span className="line-mask" style={{ '--i': 1 } as React.CSSProperties}><span className="metal-text">and curious by default.</span></span>
        </h2>

        <ScrollWords
          className="about__intro mx-auto mt-10 md:mt-12"
          text="I build backends that stay up, data that stays right, and systems that keep talking under load."
        />

        <p className="about__aside mx-auto mt-7" data-reveal style={{ '--d': 120 } as React.CSSProperties}>
          Then I write down what I learned, mostly so I remember, partly so you don’t have to.
        </p>

        <div aria-hidden="true" className="about__rule mx-auto" data-reveal />

        <div className="about__body mx-auto grid gap-6" data-reveal style={{ '--d': 160 } as React.CSSProperties}>
          <p>
            I'm <span className="text-white">Divyansh</span>, a backend developer from Bhopal. I like systems you can reason about: clean
            APIs, honest data models, transactions that hold when everyone clicks at once.
          </p>
          <p>
            Most days that means Java, Spring Boot and MySQL. Some days it’s Kafka, Redis, Docker, or an idea I can’t leave alone. The
            blog is where all of it ends up.
          </p>
        </div>
      </div>
    </section>
  )
}
