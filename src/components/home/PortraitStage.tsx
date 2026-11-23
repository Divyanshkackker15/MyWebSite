import { asset } from '../../lib/asset'

/**
 * The portrait as it sits in the hero: black stage, soft coloured light
 * behind the head, a blurred rim glow, the greyscale cutout and the colour
 * cutout on top. The opening sequence renders this same layer inside its
 * small window, so when the window grows to full screen it *is* the hero.
 *
 * Colour comes only from styling: the face itself is the original photo.
 */
export function PortraitStage({ className = '', colourClass = '', mono: withMono = true }: { className?: string; colourClass?: string; mono?: boolean }) {
  const mono = asset('images/me/cut-mono')
  const colour = asset('images/me/cut-colour')
  return (
    <div className={`stage ${className}`} aria-hidden="true">
      <div className="stage__light" />
      <img className="stage__rim" src={`${colour}-xs.webp`} alt="" width={181} height={220} decoding="async" />
      {withMono && (
      <picture>
        <source type="image/webp" srcSet={`${mono}-sm.webp`} />
        <img className="stage__photo" src={`${mono}.png`} alt="" width={1089} height={1323} decoding="async" />
      </picture>
      )}
      <img
        className={`stage__photo stage__colour ${colourClass}`}
        src={`${colour}.webp`}
        srcSet={`${colour}-sm.webp 545w, ${colour}-md.webp 800w, ${colour}.webp 1089w`}
        sizes="(min-width: 768px) 60vh, 100vw"
        alt=""
        width={1089}
        height={1323}
        fetchPriority="high"
        decoding="async"
      />
    </div>
  )
}
