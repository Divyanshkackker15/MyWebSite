import { Intro } from '../components/home/Intro'
import { Hero } from '../components/home/Hero'
import { About } from '../components/home/About'
import { Writing } from '../components/home/Writing'
import { Work } from '../components/home/Work'
import { Contact } from '../components/home/Contact'

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <About />
      <Writing />
      <Work />
      <Contact />
    </>
  )
}
