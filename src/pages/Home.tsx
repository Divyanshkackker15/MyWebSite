import { Intro } from '../components/home/Intro'
import { Hero } from '../components/home/Hero'
import { About } from '../components/home/About'
import { Skills } from '../components/home/Skills'
import { Blog } from '../components/home/Blog'
import { BeforeAfter } from '../components/home/BeforeAfter'
import { HowIWork } from '../components/home/HowIWork'
import { Contact } from '../components/home/Contact'

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <About />
      <Skills />
      <Blog />
      <BeforeAfter />
      <HowIWork />
      <Contact />
    </>
  )
}
