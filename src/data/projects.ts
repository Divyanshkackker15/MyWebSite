import { asset } from '../lib/asset'

/** Selected work. Empty links are hidden. */
export interface Project {
  id: string
  name: string
  line: string
  stack: string[]
  year: string
  github: string
  live: string
  image: string
}

export const projects: Project[] = [
  {
    id: 'gocruze',
    name: 'GoCruze',
    line: 'A ride-booking backend that gets working parents’ kids to school, safely.',
    stack: ['Spring Boot', 'Spring Security 6', 'OAuth 2.0', 'JWT', 'MySQL'],
    year: '2025',
    github: '',
    live: '',
    image: asset('images/renders/work-gocruze'),
  },
  {
    id: 'votezy',
    name: 'Votezy',
    line: 'A voting system where many votes land at once and every one counts exactly once.',
    stack: ['Spring Boot', 'Spring Data JPA', 'MySQL', 'Transactions'],
    year: '2025',
    github: '',
    live: '',
    image: asset('images/renders/work-votezy'),
  },
]
