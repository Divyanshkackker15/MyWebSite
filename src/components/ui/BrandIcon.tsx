import { siGithub, siLeetcode, siSpringboot, siApachekafka, siOpenjdk, siDocker, siMysql, siRedis } from 'simple-icons'

/**
 * Brand marks from Simple Icons (CC0 licence). LinkedIn's mark is not in
 * Simple Icons any more, so a plain "in" glyph is drawn instead.
 */
const icons = {
  github: siGithub,
  leetcode: siLeetcode,
  spring: siSpringboot,
  kafka: siApachekafka,
  java: siOpenjdk,
  docker: siDocker,
  mysql: siMysql,
  redis: siRedis,
} as const

export type BrandName = keyof typeof icons | 'linkedin'

export function BrandIcon({ name, className = 'h-4 w-4', title }: { name: BrandName; className?: string; title?: string }) {
  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
        {title && <title>{title}</title>}
        <rect x="3" y="9" width="4" height="12" rx="0.6" />
        <circle cx="5" cy="5" r="2.2" />
        <path d="M10 9h3.8v1.8c.6-1.1 2-2.1 4-2.1 3.4 0 4.2 2.2 4.2 5.1V21h-4v-6.3c0-1.5-.3-2.7-1.9-2.7-1.7 0-2.1 1.2-2.1 2.7V21h-4z" />
      </svg>
    )
  }
  const icon = icons[name]
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d={icon.path} />
    </svg>
  )
}
