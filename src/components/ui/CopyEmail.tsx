import { useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { profile } from '../../data/profile'

/** ebuka-style pill: email address + copy button. */
export function CopyEmail({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <div className={`inline-flex max-w-full items-center gap-1 rounded-full border border-wire bg-hull/80 p-1 pl-4 ${className}`}>
      <Mail className="h-4 w-4 shrink-0 text-dim" aria-hidden="true" />
      <a href={`mailto:${profile.email}`} className="truncate px-2 text-sm text-ink hover:text-amber">
        {profile.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-hull-2 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-dim transition-colors hover:text-ink"
        aria-label="Copy email address"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}
