import { useRef, useState, type ComponentProps } from 'react'

/**
 * Replaces <pre> in MDX. Colours come from Shiki at build time (no
 * highlighting JavaScript in the browser); this adds the language label
 * and a copy button.
 */
export function CodeBlock(props: ComponentProps<'pre'> & { 'data-language'?: string }) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const lang = props['data-language']

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
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
    <div className="not-prose my-8 overflow-hidden border border-line">
      <div className="flex items-center justify-between border-b border-line bg-coal px-4 py-2.5">
        <span className="mono text-grey">{lang && lang !== 'text' ? lang : 'code'}</span>
        <button type="button" onClick={copy} className="mono text-grey transition-colors hover:text-white" aria-label="Copy code">
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre ref={ref} {...props} />
    </div>
  )
}
