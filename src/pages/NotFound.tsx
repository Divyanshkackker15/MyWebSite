import { Link } from 'react-router-dom'
import { Page } from '../components/layout/Page'

export default function NotFound() {
  return (
    <Page>
      <section className="container-x grid min-h-[80svh] content-center gap-6 pt-32">
        <p className="label text-cyan">HTTP 404 · Not Found</p>
        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em] text-ink">
          No handler for <span className="font-serif font-normal italic text-amber">this route</span>.
        </h1>
        <pre className="max-w-full overflow-x-auto rounded-2xl border border-wire bg-hull p-5 font-mono text-sm text-dim">
{`{
  "status": 404,
  "error": "Not Found",
  "message": "The page you asked for doesn't exist or has moved."
}`}
        </pre>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="rounded-full bg-amber px-6 py-3 font-medium text-void">Back to home</Link>
          <Link to="/blog" className="rounded-full border border-wire px-6 py-3 text-ink hover:border-cyan hover:text-cyan">Read the blog</Link>
        </div>
      </section>
    </Page>
  )
}
