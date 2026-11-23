import { useEffect } from 'react'
import { PortraitStage } from './PortraitStage'

/**
 * Opening sequence, about 2.7 s, first visit per browser tab only.
 *
 *   0.1s  a hairline draws across the screen
 *   0.4s  a small window opens on the line, looking at the face (black and white)
 *   0.7s  first and last name rise out from behind the window; labels and a counter appear
 *   1.65s names fade, the window grows to full screen while the camera pulls back,
 *         and colour floods up through the portrait: it lands as the hero itself
 *
 * Pure CSS (main.css → "Opening sequence"), so it starts at first paint.
 * index.html adds .intro-skip when it already played or motion is reduced.
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
        <PortraitStage className="intro__stage" colourClass="intro__colour" />
      </div>
      <p className="intro__name intro__name--first text-white"><span>Divyansh</span></p>
      <p className="intro__name intro__name--last text-white"><span>Kackker</span></p>
      <p className="intro__meta intro__meta--first mono text-grey">Java backend developer</p>
      <p className="intro__meta intro__meta--last mono text-grey">Bhopal, India</p>
      <p className="intro__meta intro__count mono bottom-6 left-1/2 -translate-x-1/2 text-grey" />
    </div>
  )
}
