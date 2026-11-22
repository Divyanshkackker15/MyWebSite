import { renderEmail, type Message } from './email'

/**
 * Cloudflare Worker in front of the static site. Only /api/* is routed
 * here (wrangler.jsonc → run_worker_first); everything else is a static
 * file from ./dist.
 *
 * POST /api/contact  { name, email, subject, message, company, elapsed }
 *   → validates, filters obvious spam, sends the message to CONTACT_TO
 *     through Resend, with Reply-To set to the visitor.
 */
interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> }
  RESEND_API_KEY?: string
  CONTACT_TO: string
  CONTACT_FROM: string
}

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Light per-IP limit (per Worker instance): 5 messages per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const recent = new Map<string, number[]>()

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

function rateLimited(ip: string, now: number) {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (hits.length >= MAX_PER_WINDOW) return true
  hits.push(now)
  recent.set(ip, hits)
  if (recent.size > 5000) recent.clear()
  return false
}

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max) : ''

export async function handleContact(request: Request, env: Env, now = Date.now()): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Use POST.' })

  // only accept posts from this site's own pages
  const origin = request.headers.get('Origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { ok: false, error: 'Not allowed.' })
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) return json(415, { ok: false, error: 'Send JSON.' })

  let body: Record<string, unknown>
  try {
    const raw = await request.text()
    if (raw.length > 20000) return json(413, { ok: false, error: 'That message is too long.' })
    body = JSON.parse(raw)
  } catch {
    return json(400, { ok: false, error: 'Could not read the form.' })
  }

  // spam: bots fill the hidden field, or submit faster than a person can type
  const elapsed = Number(body.elapsed)
  if (clean(body.company, 200) || !Number.isFinite(elapsed) || elapsed < 2500) {
    return json(200, { ok: true }) // pretend success, send nothing
  }

  const m: Message = {
    name: clean(body.name, LIMITS.name).replace(/\n/g, ' '),
    email: clean(body.email, LIMITS.email),
    subject: clean(body.subject, LIMITS.subject).replace(/\n/g, ' '),
    message: clean(body.message, LIMITS.message),
  }
  if (!m.name || !EMAIL.test(m.email) || !m.subject || m.message.length < 10) {
    return json(422, { ok: false, error: 'Please check the fields and try again.' })
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  if (rateLimited(ip, now)) return json(429, { ok: false, error: 'Too many messages in a short time. Please try again later.' })

  if (!env.RESEND_API_KEY) return json(503, { ok: false, error: 'The form isn’t connected yet.' })

  const { html, text } = renderEmail(m, new Date(now))
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: m.email,
      subject: `${m.subject} · from ${m.name}`,
      html,
      text,
    }),
  })
  if (!res.ok) {
    console.error('resend failed', res.status, await res.text().catch(() => ''))
    return json(502, { ok: false, error: 'The message couldn’t be sent right now.' })
  }
  return json(200, { ok: true })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/contact') return handleContact(request, env)
    if (url.pathname.startsWith('/api/')) return json(404, { ok: false, error: 'Not found.' })
    return env.ASSETS.fetch(request)
  },
}
