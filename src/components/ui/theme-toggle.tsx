import { useEffect, useSyncExternalStore } from 'react'

/**
 * Dark/light switch: a glass pill with a carbon knob. Switching to light, orange
 * liquid flows in behind the sun; switching back, it drains away under the moon.
 * The new theme then spreads out of the toggle in a circle (View Transitions),
 * or cross-fades where that isn't supported. The choice is saved; until the
 * visitor picks one, the site follows the operating system.
 */
export type Theme = 'dark' | 'light'
const KEY = 'dk-theme'
const EVENT = 'dk-theme'

const current = (): Theme => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}

function apply(theme: Theme, save: boolean) {
  const html = document.documentElement
  html.setAttribute('data-theme', theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f4f3ef' : '#000000')
  if (save) {
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* private mode */
    }
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useTheme() {
  return useSyncExternalStore(subscribe, current, () => 'dark' as Theme)
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useTheme()
  const light = theme === 'light'

  // follow the OS until the visitor makes a choice
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem(KEY)
      } catch {
        /* ignore */
      }
      if (!saved) apply(mq.matches ? 'light' : 'dark', false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = light ? 'dark' : 'light'
    const html = document.documentElement
    const btn = e.currentTarget
    const r = btn.getBoundingClientRect()
    // move the knob and liquid straight away; the page follows
    btn.classList.toggle('is-light', next === 'light')
    html.style.setProperty('--tx', `${r.left + r.width / 2}px`)
    html.style.setProperty('--ty', `${r.top + r.height / 2}px`)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
    if (doc.startViewTransition && !reduce) {
      html.classList.add('theme-vt')
      // let the liquid start moving before the page changes colour
      window.setTimeout(() => {
        const vt = doc.startViewTransition!(() => apply(next, true))
        vt.finished.finally(() => html.classList.remove('theme-vt'))
      }, 180)
    } else {
      html.classList.add('theme-fade')
      apply(next, true)
      window.setTimeout(() => html.classList.remove('theme-fade'), 600)
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Light theme"
      onClick={toggle}
      className={`ttoggle ${light ? 'is-light' : ''} ${className}`}
    >
      <span aria-hidden="true" className="ttoggle__fill">
        <span className="ttoggle__liquid" />
        <span className="ttoggle__edge" />
      </span>
      <span aria-hidden="true" className="ttoggle__gloss" />
      <span aria-hidden="true" className="ttoggle__knob">
        <svg className="ttoggle__sun" viewBox="0 0 24 24" width="14" height="14">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </g>
        </svg>
        <svg className="ttoggle__moon" viewBox="0 0 24 24" width="14" height="14">
          <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z" fill="currentColor" />
        </svg>
      </span>
    </button>
  )
}
