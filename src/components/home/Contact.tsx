import { useEffect, useRef, useState } from 'react'
import { siGmail, siReadthedocs } from 'simple-icons'
import { hasLink, profile } from '../../data/profile'
import { asset } from '../../lib/asset'

/**
 * Link cards. Icons: the glossy set (Figma "Social Media Icon Glossy Effect") and the
 * 3D tech set for GitHub; email and résumé use a glossy gradient tile. Platforms
 * without a link in src/data/profile.ts are ready here but stay hidden.
 */
type Social = { label: string; handle: string; href: string; img?: string; tile?: 'light'; path?: string; from: string; to: string }
const elsewhere: Social[] = [
  { label: 'Email', handle: 'Write to me', href: `mailto:${profile.email}`, path: siGmail.path, from: '#FFCE1F', to: '#F5A524' },
  { label: 'LinkedIn', handle: 'Connect', href: profile.links.linkedin, img: asset('images/social/linkedin.webp'), from: '#8B6CF0', to: '#5B3FD0' },
  { label: 'GitHub', handle: 'Code', href: profile.links.github, img: asset('images/stack/github.webp'), tile: 'light', from: '#3DDC84', to: '#9CC2FF' },
  { label: 'Résumé', handle: 'PDF', href: profile.resumeUrl, path: siReadthedocs.path, from: '#B9A6FF', to: '#8B6CF0' },
  { label: 'X', handle: 'Follow', href: profile.links.x, img: asset('images/social/x.webp'), from: '#9CC2FF', to: '#5B3FD0' },
  { label: 'Instagram', handle: 'Follow', href: profile.links.instagram, img: asset('images/social/instagram.webp'), from: '#FFE27A', to: '#B9A6FF' },
  { label: 'YouTube', handle: 'Watch', href: profile.links.youtube, img: asset('images/social/youtube.webp'), from: '#FFCE1F', to: '#F5A524' },
  { label: 'WhatsApp', handle: 'Message', href: profile.links.whatsapp, img: asset('images/social/whatsapp.webp'), from: '#3DDC84', to: '#9CC2FF' },
]

const SUBJECTS = ['General question', 'Job opportunity', 'Freelance project', 'About a post']

/**
 * Contact form → POST /api/contact (worker/index.ts) → Resend → my inbox.
 * Validation runs here for quick feedback and again on the server.
 * Spam protection: a hidden "company" field bots fill in, and a minimum
 * time between the form appearing and being sent.
 */
type Field = 'name' | 'email' | 'subject' | 'message'
type Errors = Partial<Record<Field, string>>
const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Your name, please.'
  else if (v.name.length > LIMITS.name) e.name = 'That’s a long name. 100 characters max.'
  if (!EMAIL.test(v.email.trim())) e.email = 'An email I can reply to.'
  if (!v.subject.trim()) e.subject = 'A few words on what it’s about.'
  else if (v.subject.length > LIMITS.subject) e.subject = '150 characters max.'
  if (v.message.trim().length < 10) e.message = 'A little more detail (10 characters at least).'
  else if (v.message.length > LIMITS.message) e.message = '5000 characters max.'
  return e
}

export function Contact() {
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverMsg, setServerMsg] = useState('')
  const started = useRef(0)
  const status = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    started.current = Date.now()
  }, [])

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = (Object.keys(found) as Field[])[0]
    if (first) {
      document.getElementById(`c-${first}`)?.focus()
      return
    }
    setState('sending')
    try {
      const form = new FormData(e.currentTarget)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, company: form.get('company') ?? '', elapsed: Date.now() - started.current }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong on my side.')
      setState('sent')
    } catch (err) {
      setServerMsg(err instanceof Error ? err.message : 'Something went wrong on my side.')
      setState('error')
    }
    requestAnimationFrame(() => status.current?.focus())
  }

  const input =
    'w-full border-0 border-b border-line-2 bg-transparent px-0 pb-3 pt-2 text-xl text-white placeholder:text-mute transition-colors focus:border-white focus:outline-none focus:ring-0 aria-[invalid=true]:border-[#e05a5a]'

  const field = (k: Field, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="grid gap-2">
      <label htmlFor={`c-${k}`} className="mono text-grey">{label}</label>
      <input
        id={`c-${k}`}
        name={k}
        value={values[k]}
        onChange={set(k)}
        maxLength={LIMITS[k]}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `c-${k}-err` : undefined}
        className={input}
        {...props}
      />
      {errors[k] && <p id={`c-${k}-err`} className="text-sm text-[#e98a8a]">{errors[k]}</p>}
    </div>
  )

  return (
    <section id="contact" aria-labelledby="contact-title" className="contact relative overflow-hidden border-t border-line py-[16vh] md:py-[20vh]">
      <div className="wrap relative">
        <header className="text-center">
          <p className="mono text-grey" data-reveal>(05) Contact</p>
          <h2 id="contact-title" className="display-l rise mt-6">
            <span className="line-mask"><span>Say hello.</span></span>
          </h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lg leading-relaxed text-grey" data-reveal style={{ '--d': 120 } as React.CSSProperties}>
            A question about a post, an idea, a bug that won’t die, or a role you think I’d fit. Write me a message.
          </p>
        </header>

        <div className="contact__stage mt-14 md:mt-20" data-reveal style={{ '--d': 180 } as React.CSSProperties}>
          {/* soft light behind the glass */}
          <span aria-hidden="true" className="contact__orb contact__orb--a" />
          <span aria-hidden="true" className="contact__orb contact__orb--b" />
          <span aria-hidden="true" className="contact__orb contact__orb--c" />

          <div className="contact__card">
            <aside className="contact__info" aria-label="Contact information">
              <div>
                <h3 className="title text-white">Contact information</h3>
                <ul className="mt-8 grid gap-5 text-white">
                  <li className="flex items-start gap-3">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" className="mt-0.5 flex-none text-grey"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.2 7H4v.3l8 5.3 8-5.3V7h-.2L12 12.2Z" /></svg>
                    <a href={`mailto:${profile.email}`} className="link break-all">{profile.email}</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" className="mt-0.5 flex-none text-grey"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7Zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" /></svg>
                    <span>{profile.location}</span>
                  </li>
                  <li className="flex items-start gap-3 text-grey">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" className="mt-0.5 flex-none"><path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm1 5h-2v6l5 3 1-1.7-4-2.4V7Z" /></svg>
                    <span>Usually replies within a day or two</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mono text-mute">Elsewhere</p>
                <ul className="mt-4 grid grid-cols-2 gap-3">
                  {elsewhere.filter((l) => hasLink(l.href)).map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                        className="social-card"
                        style={{ '--from': l.from, '--to': l.to } as React.CSSProperties}
                        aria-label={`${l.label}: ${l.handle}`}
                      >
                        {l.img ? (
                          <span className={`social-card__img ${l.tile === 'light' ? 'is-tile' : ''}`} aria-hidden="true">
                            <img src={l.img} alt="" width={64} height={64} loading="lazy" />
                          </span>
                        ) : (
                          <span className="social-card__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="18" height="18"><path d={l.path} fill="currentColor" /></svg>
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block text-[0.95rem] text-white">{l.label}</span>
                          <span className="mono block truncate text-mute">{l.handle}</span>
                        </span>
                        <span className="social-card__go" aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="contact__form">
              {state === 'sent' ? (
                <div className="grid content-center gap-6 py-10">
                  <p ref={status} tabIndex={-1} className="display-m text-white outline-none" role="status">Sent. Thank you.</p>
                  <p className="text-lg text-grey">I’ll reply to <span className="text-white">{values.email}</span> as soon as I can.</p>
                  <button
                    type="button"
                    className="mono link justify-self-start text-white"
                    onClick={() => {
                      setValues({ name: '', email: '', subject: SUBJECTS[0], message: '' })
                      started.current = Date.now()
                      setState('idle')
                    }}
                  >
                    Send another →
                  </button>
                </div>
              ) : (
                <form noValidate onSubmit={submit} className="grid gap-9" aria-describedby="c-status">
                  <div className="grid gap-9 sm:grid-cols-2 sm:gap-8">
                    {field('name', 'Name', { autoComplete: 'name', placeholder: 'Your name' })}
                    {field('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'you@example.com' })}
                  </div>
                  <fieldset>
                    <legend className="mono text-grey">What’s it about?</legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => (
                        <label key={s} className="contact__chip">
                          <input
                            type="radio"
                            name="subject"
                            value={s}
                            checked={values.subject === s}
                            onChange={() => setValues((v) => ({ ...v, subject: s }))}
                          />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="grid gap-2">
                    <label htmlFor="c-message" className="mono text-grey">Message</label>
                    <textarea
                      id="c-message"
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={set('message')}
                      maxLength={LIMITS.message}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? 'c-message-err' : undefined}
                      placeholder="Write as much as you like."
                      className={`${input} resize-y`}
                    />
                    {errors.message && <p id="c-message-err" className="text-sm text-[#e98a8a]">{errors.message}</p>}
                  </div>
                  {/* honeypot: hidden from people, irresistible to bots */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="c-company">Company</label>
                    <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="relative flex flex-wrap items-center justify-end gap-6">
                    <p id="c-status" ref={status} tabIndex={-1} role="status" className="mr-auto text-sm text-[#e98a8a] outline-none">
                      {state === 'error' ? `${serverMsg} You can also email me directly.` : ''}
                    </p>
                    {/* the paper plane doodle from the reference */}
                    <svg aria-hidden="true" className="contact__plane" viewBox="0 0 160 90" width="160" height="90">
                      <path d="M4 86 C 30 40, 60 90, 86 62 S 120 40, 132 30" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round" />
                      <path d="M120 22 L156 4 L140 40 L134 30 Z" fill="currentColor" opacity="0.9" />
                    </svg>
                    <button type="submit" disabled={state === 'sending'} className="contact__send group">
                      <span>{state === 'sending' ? 'Sending…' : 'Send message'}</span>
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
