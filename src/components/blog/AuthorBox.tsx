import { profile } from '../../data/profile'
import { Socials } from '../ui/Socials'
import { SectionLink } from '../layout/SectionLink'
import { asset } from '../../lib/asset'

export function AuthorBox() {
  return (
    <aside aria-label="About the author" className="flex flex-col gap-5 rounded-3xl border border-wire bg-hull p-6 sm:flex-row sm:items-center">
      <picture className="shrink-0">
        <source type="image/webp" srcSet={asset('images/avatar-256.webp')} />
        <img src={asset('images/avatar-256.png')} alt="" width={88} height={88} loading="lazy" className="h-[88px] w-[88px] shrink-0 rounded-full" />
      </picture>
      <div className="grid gap-2">
        <p className="label">Written by</p>
        <p className="font-display text-xl font-semibold text-ink">{profile.name}</p>
        <p className="text-[15px] leading-relaxed text-dim">
          {profile.title} from Bhopal, India. I write about what I learn while building with Java, Spring Boot and microservices.{' '}
          <SectionLink id="available" className="text-cyan underline underline-offset-4 hover:text-amber">I'm available for work.</SectionLink>
        </p>
        <div className="mt-1">
          <Socials />
        </div>
      </div>
    </aside>
  )
}
