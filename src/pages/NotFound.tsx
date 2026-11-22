import { TLink } from '../components/layout/TLink'

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[90svh] content-center gap-10 pt-32">
      <p className="mono fade-now text-grey">Error 404</p>
      <h1 className="display-xl rise-now">
        <span className="line-mask"><span className="ink-fade">Nothing here.</span></span>
      </h1>
      <p className="fade-now max-w-[36ch] text-xl text-grey" style={{ '--i': 2 } as React.CSSProperties}>
        This page doesn’t exist, or it moved. The good stuff is one click away.
      </p>
      <p className="mono fade-now flex gap-8" style={{ '--i': 3 } as React.CSSProperties}>
        <TLink to="/" className="link text-white">Home →</TLink>
        <TLink to="/blog" className="link text-white">Writing →</TLink>
      </p>
    </section>
  )
}
