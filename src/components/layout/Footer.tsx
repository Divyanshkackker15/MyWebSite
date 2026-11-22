import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { CopyEmail } from '../ui/CopyEmail'
import { Socials } from '../ui/Socials'
import { SectionLink } from './SectionLink'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden border-t border-wire">
      {/* soft amber floor glow (ebuka-style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(50%_100%_at_50%_100%,rgba(255,181,71,0.12),transparent_70%)]"
      />
      <div className="container-x relative grid gap-12 py-16 md:py-20">
        <div className="grid justify-items-center gap-5 text-center">
          <p className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-none tracking-[-0.045em] text-ink">
            Divyansh <span className="font-serif font-normal italic text-amber">Kackker</span>
          </p>
          <p className="max-w-[44ch] text-dim">
            {profile.title}. Building backends that stay reliable under load.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CopyEmail />
            <Socials />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-wire pt-8 text-sm text-dim md:flex-row">
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <SectionLink id="about" className="hover:text-ink">About</SectionLink>
            <SectionLink id="projects" className="hover:text-ink">Work</SectionLink>
            <SectionLink id="available" className="hover:text-ink">Services</SectionLink>
            <Link to="/blog" className="hover:text-ink">Blog</Link>
            <a href={profile.resumeUrl} download className="hover:text-ink">Résumé</a>
            <a href="/sitemap.xml" className="hover:text-ink">Sitemap</a>
          </nav>
          <p className="text-center">
            © {year} {profile.name} · Designed &amp; built by {profile.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
