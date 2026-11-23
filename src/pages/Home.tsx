import { Intro } from '../components/home/Intro'
import { Hero } from '../components/home/Hero'
import { About } from '../components/home/About'
import { Writing } from '../components/home/Writing'
import { Work } from '../components/home/Work'
import { BeforeAfter } from '../components/home/BeforeAfter'
import { HowIWork } from '../components/home/HowIWork'
import { Contact } from '../components/home/Contact'

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <About />
      <Writing />
      <Work />
      <BeforeAfter />
      <HowIWork />
      <Contact />
    </>
  )
}
