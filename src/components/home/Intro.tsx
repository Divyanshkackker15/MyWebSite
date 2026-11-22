import { useEffect } from 'react'
import { asset } from '../../lib/asset'

/**
 * Opening sequence, about 2.6 s, first visit per browser tab only.
 *
 *   0.1s  a hairline draws across the screen
 *   0.45s a small window opens on the line, looking at the object
 *   0.75s first and last name slide out from behind the window
 *   1.7s  the window grows to full screen (the camera pushes in) and
 *         becomes the hero underneath; the hero headline rises
 *
 * It runs on CSS alone (main.css → "Opening sequence"), so it starts at
 * first paint without waiting for JavaScript. The inline script in
 * index.html adds .intro-skip when it has played already or the visitor
 * prefers reduced motion.
 */
export function Intro() {
  useEffect(() => {
    const html = document.documentElement
    if (html.classList.contains('intro-skip')) return
    const t = window.setTimeout(() => {
      html.classList.remove('intro-play')
      html.classList.add('intro-skip')
      try {
        sessionStorage.setItem('dk-intro', '1')
      } catch {
        /* private mode */
      }
    }, 3400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro__bg" />
      <div className="intro__line" />
      <div className="intro__window">
        <picture>
          <source media="(orientation: portrait)" srcSet={asset('images/hero-tall-sm.webp')} />
          <img src={asset('images/hero-wide-sm.webp')} alt="" width={1200} height={675} fetchPriority="high" />
        </picture>
      </div>
      <p className="intro__name intro__name--first text-white"><span>Divyansh</span></p>
      <p className="intro__name intro__name--last text-white"><span>Kackker</span></p>
      <p className="intro__meta mono left-4 top-[calc(50%+0.9rem)] text-grey md:left-10">Backend · Writing</p>
      <p className="intro__meta mono right-4 bottom-[calc(50%+0.9rem)] text-grey md:right-10">Bhopal, IN</p>
      <p className="intro__meta intro__count mono bottom-6 left-1/2 -translate-x-1/2 text-grey" />
    </div>
  )
}
