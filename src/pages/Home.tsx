import { Page } from '../components/layout/Page'
import { DataBus } from '../components/motion/DataBus'
import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { Journey } from '../components/sections/Journey'
import { Skills } from '../components/sections/Skills'
import { Projects } from '../components/sections/Projects'
import { Experience } from '../components/sections/Experience'
import { Available } from '../components/sections/Available'
import { Process } from '../components/sections/Process'
import { Education } from '../components/sections/Education'
import { BlogPreview } from '../components/sections/BlogPreview'
import { Contact } from '../components/sections/Contact'

/** Home page: sections in the order defined in src/data/sections.ts */
export default function Home() {
  return (
    <Page>
      <DataBus />
      <Hero />
      <About />
      <Journey />
      <Skills />
      <Projects />
      <Experience />
      <Available />
      <Process />
      <Education />
      <BlogPreview />
      <Contact />
    </Page>
  )
}
