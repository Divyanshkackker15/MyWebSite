import { asset } from '../lib/asset'

/**
 * Everything about me in one place. Components only read from src/data/*.
 * A link left as '' is hidden on the site automatically.
 */
export const profile = {
  name: 'Divyansh Kackker',
  firstName: 'Divyansh',
  lastName: 'Kackker',
  title: 'Java Backend Developer',
  location: 'Bhopal, India',
  email: 'kackkerdivyansh1115@gmail.com',
  site: 'https://kackkerdivyansh.in',
  resumeUrl: asset('resume.pdf'),
  links: {
    linkedin: 'https://www.linkedin.com/in/kackkerdivyansh1115/',
    github: '', // e.g. 'https://github.com/your-handle'
  },
  /** one line, shown small in About */
  previously: [
    { role: 'Software Engineering Intern', org: 'Infosys Springboard', year: '2025' },
    { role: 'Lead Technical Project Associate', org: 'AICTE IDEA Lab', year: '2025' },
  ],
  focus: ['Java', 'Spring Boot', 'Distributed systems', 'Databases', 'Writing'],
}

export const hasLink = (url: string | undefined | null): url is string => Boolean(url && url.trim())
