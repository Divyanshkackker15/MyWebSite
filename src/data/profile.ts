import { asset } from '../lib/asset'
/**
 * Everything about me in one place. Components only read from src/data/*,
 * so a future Spring Boot API can return these same shapes as JSON and only
 * the import changes (see README → "Future upgrades").
 *
 * TODO(Divyansh): fill the empty URLs below. Any link left as '' is hidden
 * on the site automatically, so nothing broken is ever shown.
 */
export interface Profile {
  name: string
  firstName: string
  lastName: string
  title: string
  tagline: string
  location: string
  email: string
  summary: string
  currentlyLearning: string
  site: string
  resumeUrl: string
  links: { linkedin: string; github: string; leetcode: string }
  availability: { open: boolean; label: string }
  stats: { value: number; suffix: string; label: string }[]
}

export const profile: Profile = {
  name: 'Divyansh Kackker',
  firstName: 'Divyansh',
  lastName: 'Kackker',
  title: 'Java Backend Developer',
  tagline: 'Spring Boot Microservices Enthusiast',
  location: 'Bhopal, Madhya Pradesh, India',
  email: 'kackkerdivyansh1115@gmail.com',
  // Phone number is intentionally not published (spam bots scrape it).
  summary:
    'Practical, hands-on software engineer focused on distributed systems: building software that performs reliably at scale and solves real engineering challenges. Skilled in Java, Spring Boot, Apache Kafka, Redis and RESTful API design, with a strong grounding in Agile development.',
  currentlyLearning: 'System Design',
  site: 'https://kackkerdivyansh.in',
  resumeUrl: asset('resume.pdf'),
  links: {
    linkedin: '', // TODO: e.g. 'https://www.linkedin.com/in/your-handle/'
    github: '', // TODO: e.g. 'https://github.com/your-handle'
    leetcode: '', // TODO: e.g. 'https://leetcode.com/u/your-handle/'
  },
  availability: { open: true, label: 'Open to work & freelance' },
  stats: [
    { value: 2, suffix: '', label: 'Projects shipped' },
    { value: 2, suffix: '', label: 'Internships & roles' },
    { value: 15, suffix: '+', label: 'REST API endpoints' },
    { value: 40, suffix: '%', label: 'Faster queries' },
  ],
}

/** true when a link has been filled in */
export const hasLink = (url: string | undefined | null): url is string => Boolean(url && url.trim())
