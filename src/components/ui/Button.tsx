import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Magnetic } from '../motion/Magnetic'

type Variant = 'primary' | 'ghost'

const base =
  'group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-[15px] font-medium transition-[color,background-color,border-color,box-shadow] duration-300'
const variants: Record<Variant, string> = {
  primary:
    'bg-amber text-void hover:shadow-[0_12px_40px_-10px_rgba(255,181,71,0.75)] focus-visible:shadow-[0_12px_40px_-10px_rgba(255,181,71,0.75)]',
  ghost: 'border border-wire text-ink hover:border-cyan hover:text-cyan',
}

/**
 * Magnetic pill button. `to` = internal route (react-router), `href` = normal link.
 * The label slides up and is replaced by a copy of itself on hover.
 */
export function Button({
  children,
  to,
  href,
  variant = 'primary',
  icon,
  download,
  onClick,
  type = 'button',
  magnetic = true,
  external,
}: {
  children: ReactNode
  to?: string
  href?: string
  variant?: Variant
  icon?: ReactNode
  download?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  magnetic?: boolean
  external?: boolean
}) {
  const inner = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon && (
        <span className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
    </>
  )
  const cls = `${base} ${variants[variant]}`
  let el
  if (to) el = <Link to={to} className={cls} onClick={onClick}>{inner}</Link>
  else if (href)
    el = (
      <a
        href={href}
        className={cls}
        download={download || undefined}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  else el = <button type={type} className={cls} onClick={onClick}>{inner}</button>

  return magnetic ? <Magnetic>{el}</Magnetic> : el
}
