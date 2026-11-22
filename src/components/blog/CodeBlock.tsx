import { useRef, useState, type ComponentProps } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * Replaces <pre> in MDX. The code is already syntax-highlighted at build time
 * by Shiki (zero JS for colours); this only adds the language label and a
 * copy button.
 */
export function CodeBlock(props: ComponentProps<'pre'> & { 'data-language'?: string }) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const lang = props['data-language']

  const copy = async () => {
    const text = ref.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard blocked: select the text so the reader can copy it manually
      const range = document.createRange()
      if (ref.current) {
        range.selectNodeContents(ref.current)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  }

  return (
    <div className="not-prose overflow-hidden rounded-xl border border-wire">
      <div className="flex items-center justify-between border-b border-wire bg-hull px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">{lang && lang !== 'text' ? lang : 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-dim transition-colors hover:bg-hull-2 hover:text-ink"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-ok" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre ref={ref} {...props} />
    </div>
  )
}
