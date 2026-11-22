/** Projects shown as case studies. `flow` drives the animated request diagram. */
export interface Project {
  id: string
  name: string
  subtitle: string
  outcome: string
  stack: string[]
  github: string // TODO: repo URL; '' hides the button
  live?: string
  highlights: string[]
  stats: { value: string; label: string }[]
  flow: { label: string; detail: string }[]
}

export const projects: Project[] = [
  {
    id: 'gocruze',
    name: 'GoCruze',
    subtitle: 'Safe School Commute Platform',
    outcome: 'A ride-booking backend that helps working parents get their kids to school safely.',
    stack: ['Spring Boot', 'Spring Security 6', 'OAuth 2.0', 'JWT', 'MySQL', 'JUnit 5'],
    github: '',
    highlights: [
      'Designed and implemented 15+ customer-facing RESTful API endpoints for a ride-booking platform serving working parents, with layered architecture and MySQL query optimization.',
      'Developed a secure authentication and authorization system using Spring Security 6, OAuth 2.0, JWT and RBAC for 3 user roles; ensured robustness through JUnit 5 unit and integration testing across the SDLC.',
    ],
    stats: [
      { value: '15+', label: 'REST endpoints' },
      { value: '3', label: 'User roles (RBAC)' },
    ],
    flow: [
      { label: 'Parent app', detail: 'HTTPS request' },
      { label: 'JWT filter', detail: 'Spring Security 6' },
      { label: 'Controller', detail: 'REST endpoint' },
      { label: 'Service', detail: 'Booking logic' },
      { label: 'MySQL', detail: 'Optimised queries' },
    ],
  },
  {
    id: 'votezy',
    name: 'Votezy',
    subtitle: 'Distributed Online Voting System',
    outcome: 'A voting platform where many votes can arrive at once and every one is counted exactly once.',
    stack: ['Spring Boot', 'Spring Data JPA', 'MySQL', 'Transactions', 'JUnit 5'],
    github: '',
    highlights: [
      'Designed and developed a scalable distributed voting platform with RESTful APIs, concurrent vote-submission workflows and transaction management to prevent race conditions, ensuring consistency, availability and reliability at scale.',
      'Optimized real-time result aggregation using Spring Data JPA indexed queries and JOIN optimization, reducing query time by 40%; validated correctness through unit and integration testing.',
    ],
    stats: [
      { value: '40%', label: 'Faster result queries' },
      { value: 'ACID', label: 'Race-safe vote writes' },
    ],
    flow: [
      { label: 'Voters', detail: 'Concurrent requests' },
      { label: 'Vote API', detail: 'Validation' },
      { label: '@Transactional', detail: 'One vote per voter' },
      { label: 'MySQL', detail: 'Indexed tables' },
      { label: 'Results', detail: 'JOIN-optimised' },
    ],
  },
]
