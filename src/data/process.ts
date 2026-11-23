import { asset } from '../lib/asset'

/**
 * Copy for the Before/After section and the four phases of "How I Work".
 * Edit freely; the sections only read from here.
 */
export interface Card {
  title: string
  body: string
}

/** The usual state of a backend before anyone takes it seriously. */
export const before: Card[] = [
  {
    title: 'The slow query',
    body: 'A page that takes four seconds is usually one missing index and an N+1 loop away from forty milliseconds. Nobody measured, so nobody knows.',
  },
  {
    title: 'The tangled monolith',
    body: 'Every feature touches every other feature. A one-line change needs a full regression test and some luck. It still works. It just no longer lets you move.',
  },
  {
    title: 'Security as an afterthought',
    body: 'Login added in week ten, roles checked by hand in controllers, secrets in the repository. It holds until the day someone actually tries.',
  },
]

/** What I build instead. */
export const after: Card[] = [
  {
    title: 'Measured, then fixed',
    body: 'Query plans read before code is touched. Indexes, joins and caching chosen from evidence, not habit, with the before and after numbers written down.',
  },
  {
    title: 'Boundaries that hold',
    body: 'Modules with clear contracts, transactions wherever money or votes are at stake, and an architecture you can explain on a single page.',
  },
  {
    title: 'Secure by construction',
    body: 'Spring Security, JWT and role-based access designed in from the first day, and tests that prove the rules instead of assuming them.',
  },
]

export interface Phase {
  n: string
  name: string
  body: string
  image: string
  credit: string
  dot: string
}

export const phases: Phase[] = [
  {
    n: '01',
    name: 'Discover',
    body: 'Before a line of code: the problem, the people who have it, the constraints and what "done" means. I ask the questions that are expensive to answer later, and we agree on scope and a timeline in writing.',
    image: asset('images/phases/discover'),
    credit: 'Johannes Vermeer, The Astronomer, 1668',
    dot: '#f04a4a',
  },
  {
    n: '02',
    name: 'Design',
    body: 'System design on paper first: API contracts, database schema, data flow and how each part fails. A design you can review in an hour is far cheaper than a rewrite in a month.',
    image: asset('images/phases/design'),
    credit: 'Johannes Vermeer, The Geographer, 1669',
    dot: '#8b5cf6',
  },
  {
    n: '03',
    name: 'Build',
    body: 'Spring Boot in short sprints, JUnit 5 tests written alongside the code, and a working demo every week. You see progress as running software, never as a status report.',
    image: asset('images/phases/build'),
    credit: 'Joseph Wright of Derby, An Experiment on a Bird in the Air Pump, 1768',
    dot: '#3d7bff',
  },
  {
    n: '04',
    name: 'Launch & Support',
    body: 'Docker images, deployment, documentation and a clean handover, so the system can outlive my involvement. Then a support window for the fixes only real users reveal.',
    image: asset('images/phases/launch'),
    credit: 'Joseph Wright of Derby, A Philosopher Lecturing on the Orrery, c. 1766',
    dot: '#1fbf8a',
  },
]
