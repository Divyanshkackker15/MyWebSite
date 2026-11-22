import { asset } from '../../lib/asset'
/**
 * The edited headshot (background removed, graded, rim-lit).
 * WebP for modern browsers, PNG fallback; two sizes so phones download
 * the small one. Width/height are set to prevent layout shift.
 */
export function Portrait({
  className = '',
  priority = false,
  sizes = '(min-width: 1024px) 40vw, min(420px, 90vw)',
}: {
  className?: string
  priority?: boolean
  sizes?: string
}) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${asset('images/portrait-mobile.webp')} 560w, ${asset('images/portrait-desktop.webp')} 960w`}
        sizes={sizes}
      />
      <img
        src={asset('images/portrait-desktop.png')}
        srcSet={`${asset('images/portrait-mobile.png')} 560w, ${asset('images/portrait-desktop.png')} 960w`}
        sizes={sizes}
        width={960}
        height={1166}
        alt="Portrait of Divyansh Kackker in a dark navy shirt"
        className={className}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        draggable={false}
      />
    </picture>
  )
}
