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
    github: 'https://github.com/Divyanshkackker15/GoCruze',
    live: '',
    image: asset('images/renders/work-gocruze'),
  },
  {
    id: 'votezy',
    name: 'Votezy',
    line: 'A voting system where many votes land at once and every one counts exactly once.',
    stack: ['Spring Boot', 'Spring Data JPA', 'MySQL', 'Transactions'],
    year: '2025',
    github: 'https://github.com/Divyanshkackker15/VOTEZY',
    live: '',
    image: asset('images/renders/work-votezy'),
  },
  {
    id: 'docmind',
    name: 'DocMind',
    line: 'Ask a question of your own documents and get an answer that cites where it came from.',
    stack: ['Spring Boot', 'Spring AI', 'RAG', 'Vector store'],
    year: '2026',
    github: 'https://github.com/Divyanshkackker15/DocMind',
    live: '',
    image: asset('images/renders/violet-2'),
  },
  {
    id: 'swiftcart',
    name: 'SwiftCart',
    line: 'An e-commerce backend for users, carts and orders, built to take a real shop’s traffic.',
    stack: ['Spring Boot', 'REST', 'Spring Data JPA', 'MySQL'],
    year: '2026',
    github: 'https://github.com/Divyanshkackker15/SwiftCraft',
    live: '',
    image: asset('images/renders/emerald-2'),
  },
]
