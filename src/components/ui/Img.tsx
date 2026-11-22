/**
 * WebP image with a half-size variant (`<src>-sm.webp`) for small screens.
 * `src` has no extension.
 */
export function Img({
  src,
  alt,
  className = '',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  eager = false,
  width = 1600,
  height = 1000,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  eager?: boolean
  width?: number
  height?: number
}) {
  return (
    <img
      src={`${src}.webp`}
      srcSet={`${src}-sm.webp ${width / 2}w, ${src}.webp ${width}w`}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}
