import { profile, hasLink } from '../../data/profile'
import { BrandIcon, type BrandName } from './BrandIcon'

const items: { key: keyof typeof profile.links; label: string; icon: BrandName }[] = [
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { key: 'github', label: 'GitHub', icon: 'github' },
  { key: 'leetcode', label: 'LeetCode', icon: 'leetcode' },
]

/** Social links — any profile link that is still empty is simply not shown. */
export function Socials({ variant = 'round' }: { variant?: 'round' | 'list' }) {
  const links = items.filter((i) => hasLink(profile.links[i.key]))
  if (!links.length) return null
  if (variant === 'list') {
    return (
      <ul className="grid gap-2">
        {links.map((i) => (
          <li key={i.key}>
            <a
              href={profile.links[i.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-ink transition-colors hover:text-amber"
            >
              <BrandIcon name={i.icon} className="h-4 w-4 text-dim transition-colors group-hover:text-amber" />
              {i.label}
              <span aria-hidden="true" className="text-dim transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <ul className="flex items-center gap-2">
      {links.map((i) => (
        <li key={i.key}>
          <a
            href={profile.links[i.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={i.label}
            className="grid h-10 w-10 place-items-center rounded-full border border-wire bg-hull text-dim transition-colors hover:border-amber hover:text-amber"
          >
            <BrandIcon name={i.icon} className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  )
}
