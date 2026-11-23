import { hasLink, profile } from '../../data/profile'
import { TLink } from './TLink'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden border-t border-line pt-14">
      <div className="wrap grid gap-10 md:grid-cols-4">
        <p className="mono text-grey md:col-span-2">
          Written and built by {profile.name}
          <br />
          {profile.location}
        </p>
        <ul className="mono grid gap-2 text-grey">
          <li><TLink to="/#blog" className="link text-white">Blog</TLink></li>
          <li><TLink to="/#process" className="link text-white">Process</TLink></li>
          <li><TLink to="/#contact" className="link text-white">Contact</TLink></li>
        </ul>
        <ul className="mono grid gap-2 text-grey">
          {hasLink(profile.links.linkedin) && (
            <li><a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link text-white">LinkedIn ↗</a></li>
          )}
          {hasLink(profile.links.github) && (
            <li><a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link text-white">GitHub ↗</a></li>
          )}
          <li><a href={profile.resumeUrl} target="_blank" rel="noopener" className="link text-white">Résumé ↗</a></li>
          <li><a href={`mailto:${profile.email}`} className="link text-white">Email</a></li>
        </ul>
      </div>
      <div className="wrap mt-16 flex items-end justify-between gap-6 pb-6">
        <p className="mono text-mute">© {year}</p>
        <p className="mono text-mute">kackkerdivyansh.in</p>
      </div>
      {/* the name, set huge and cut by the page edge */}
      <svg aria-hidden="true" viewBox="0 0 1000 235" className="block w-full select-none" preserveAspectRatio="xMidYMax slice">
        <text x="500" y="228" textAnchor="middle" fill="currentColor" className="text-coal-2" fontSize="300" fontWeight="450" letterSpacing="-19" fontFamily="var(--font-sans)">
          Kackker
        </text>
      </svg>
    </footer>
  )
}
