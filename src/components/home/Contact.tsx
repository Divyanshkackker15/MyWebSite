import { useEffect, useRef, useState } from 'react'
import { hasLink, profile } from '../../data/profile'

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
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', subject: '', message: '' })
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
    <section id="contact" aria-labelledby="contact-title" className="wrap border-t border-line py-[16vh] md:py-[20vh]">
      <p className="mono text-grey" data-reveal>(06) Contact</p>
      <h2 id="contact-title" className="display-xl rise mt-6">
        <span className="line-mask"><span>Say hello.</span></span>
      </h2>

      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-8">
        <div className="grid content-start gap-10 md:col-span-4" data-reveal>
          <p className="max-w-[30ch] text-lg leading-relaxed text-grey">
            A question about a post, an idea, a bug that won’t die, or a role you think I’d fit. I read everything and reply to most.
          </p>
          <dl className="grid gap-6">
            <div>
              <dt className="mono text-mute">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${profile.email}`} className="link break-all text-lg text-white">{profile.email}</a>
              </dd>
            </div>
            {hasLink(profile.links.linkedin) && (
              <div>
                <dt className="mono text-mute">LinkedIn</dt>
                <dd className="mt-2">
                  <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link text-lg text-white">in/kackkerdivyansh1115 ↗</a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="md:col-span-7 md:col-start-6" data-reveal style={{ '--d': 120 } as React.CSSProperties}>
          {state === 'sent' ? (
            <div className="frame ticks grid gap-6 p-8 md:p-12">
              <p ref={status} tabIndex={-1} className="display-m text-white outline-none" role="status">Sent. Thank you.</p>
              <p className="text-lg text-grey">I’ll reply to <span className="text-white">{values.email}</span> as soon as I can.</p>
              <button
                type="button"
                className="mono link justify-self-start text-white"
                onClick={() => {
                  setValues({ name: '', email: '', subject: '', message: '' })
                  started.current = Date.now()
                  setState('idle')
                }}
              >
                Send another →
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="grid gap-10" aria-describedby="c-status">
              <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
                {field('name', 'Name', { autoComplete: 'name', placeholder: 'Your name' })}
                {field('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'you@example.com' })}
              </div>
              {field('subject', 'Subject', { placeholder: 'What’s it about?' })}
              <div className="grid gap-2">
                <label htmlFor="c-message" className="mono text-grey">Message</label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={5}
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
              <div className="flex flex-wrap items-center gap-6">
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="group inline-flex items-center gap-4 border border-white px-7 py-4 text-white transition-colors duration-300 hover:bg-white hover:text-black disabled:opacity-50"
                >
                  <span className="mono">{state === 'sending' ? 'Sending…' : 'Send message'}</span>
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </button>
                <p id="c-status" ref={status} tabIndex={-1} role="status" className="text-sm text-[#e98a8a] outline-none">
                  {state === 'error' ? `${serverMsg} You can also email me directly.` : ''}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
