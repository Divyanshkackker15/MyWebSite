import { useState, type FormEvent } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, Download, Loader2 } from 'lucide-react'
import { profile, hasLink } from '../../data/profile'
import { SectionHeader } from '../ui/SectionHeader'
import { CopyEmail } from '../ui/CopyEmail'
import { Socials } from '../ui/Socials'
import { Reveal } from '../motion/Reveal'
import { Magnetic } from '../motion/Magnetic'

/**
 * Contact form → Formspree (no backend needed).
 * Set VITE_FORMSPREE_ID in .env (or in Cloudflare Pages → Settings →
 * Environment variables). Without it, the form tells visitors to email instead.
 *
 * Spam protection: a hidden "_gotcha" honeypot field that humans never fill.
 */
const FORM_ID = import.meta.env.VITE_FORMSPREE_ID
type Status = 'idle' | 'sending' | 'sent' | 'error' | 'disabled'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // client-side validation (Formspree validates again on its side)
    const next: Record<string, string> = {}
    if (!String(data.get('name') || '').trim()) next.name = 'Please tell me your name.'
    if (!/^\S+@\S+\.\S+$/.test(String(data.get('email') || ''))) next.email = 'Please enter a valid email address.'
    if (String(data.get('message') || '').trim().length < 10) next.message = 'A few more words, please (10+ characters).'
    setErrors(next)
    if (Object.keys(next).length) return

    if (!FORM_ID) {
      setStatus('disabled')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const field =
    'w-full rounded-2xl border border-wire bg-void px-4 py-3.5 text-ink placeholder:text-ghost transition-colors focus:border-amber focus:outline-none aria-[invalid=true]:border-[#ff6b6b]'

  return (
    <section id="contact" className="container-x scroll-mt-20 py-24 md:py-32">
      <SectionHeader
        id="contact"
        title={<>Let's build something <span className="font-serif font-normal italic text-amber">reliable</span>.</>}
        intro="Have a role, a project or a question? Send a message, or email me directly."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="grid content-start gap-8 lg:col-span-5">
          <div>
            <p className="label mb-3">Email</p>
            <CopyEmail />
          </div>
          {Object.values(profile.links).some(hasLink) && (
            <div>
              <p className="label mb-3">Elsewhere</p>
              <Socials variant="list" />
            </div>
          )}
          <div>
            <p className="label mb-3">Résumé</p>
            <Magnetic>
              <a
                href={profile.resumeUrl}
                download="Divyansh-Kackker-Resume.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-wire px-5 py-3 text-sm text-ink transition-colors hover:border-amber hover:text-amber"
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Download résumé (PDF)
              </a>
            </Magnetic>
          </div>
          <p className="label">{profile.location}</p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form noValidate onSubmit={onSubmit} className="relative grid gap-4 rounded-[28px] border border-wire bg-hull p-5 md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="cf-name" className="label">Name</label>
                <input id="cf-name" name="name" autoComplete="name" className={field} placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} />
                {errors.name && <p id="cf-name-err" className="text-sm text-[#ff8a8a]">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="cf-email" className="label">Email</label>
                <input id="cf-email" name="email" type="email" autoComplete="email" className={field} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} />
                {errors.email && <p id="cf-email-err" className="text-sm text-[#ff8a8a]">{errors.email}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="cf-topic" className="label">What's it about?</label>
              <select id="cf-topic" name="topic" className={field} defaultValue="Job opportunity">
                <option>Job opportunity</option>
                <option>Freelance project</option>
                <option>Collaboration</option>
                <option>Just saying hi</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="cf-message" className="label">Message</label>
              <textarea id="cf-message" name="message" rows={5} className={`${field} resize-y`} placeholder="Tell me a little about it…" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'cf-message-err' : undefined} />
              {errors.message && <p id="cf-message-err" className="text-sm text-[#ff8a8a]">{errors.message}</p>}
            </div>
            {/* honeypot: hidden from people, bots fill it and Formspree drops the message */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-dim" aria-live="polite">
                {status === 'error' && <span className="text-[#ff8a8a]">That didn't send. Please email me at {profile.email}.</span>}
                {status === 'disabled' && <span className="text-amber">The form isn't connected yet. Please email me at {profile.email}.</span>}
              </p>
              <Magnetic>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 font-medium text-void transition-shadow hover:shadow-[0_12px_40px_-10px_rgba(255,181,71,0.75)] disabled:opacity-70"
                >
                  {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                  {status !== 'sending' && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />}
                </button>
              </Magnetic>
            </div>

            <AnimatePresence>
              {status === 'sent' && (
                <m.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 grid place-items-center rounded-[28px] bg-hull/95 p-8 text-center backdrop-blur"
                  role="status"
                >
                  <div className="grid justify-items-center gap-4">
                    <CheckCircle2 className="h-10 w-10 text-ok" aria-hidden="true" />
                    <p className="font-display text-2xl font-semibold text-ink">Message sent. Thank you!</p>
                    <p className="text-dim">I'll reply to the email address you gave.</p>
                    <button type="button" onClick={() => setStatus('idle')} className="mt-2 text-sm text-cyan hover:text-amber">
                      Send another message
                    </button>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
