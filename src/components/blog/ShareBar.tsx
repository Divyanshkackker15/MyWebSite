import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { BrandIcon } from '../ui/BrandIcon'

/** Share on LinkedIn (uses the post's OG tags for the preview) + copy link. */
export function ShareBar({ url }: { url: string; title?: string }) {
  const [copied, setCopied] = useState(false)
  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.prompt('Copy this link', url)
    }
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="label">Share</span>
      <a
        href={linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        <BrandIcon name="linkedin" className="h-4 w-4" />
        Share on LinkedIn
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-full border border-wire px-4 py-2.5 text-sm text-ink transition-colors hover:border-cyan hover:text-cyan"
      >
        {copied ? <Check className="h-4 w-4 text-ok" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
        <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
    </div>
  )
}
