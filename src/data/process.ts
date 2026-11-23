import { asset } from '../lib/asset'

/**
 * Copy for the Before/After section and the four phases of "How We Sprint".
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

/** How We Sprint: one two-week cycle, four phases. Paintings are public domain (Wikimedia Commons). */
export const phases: Phase[] = [
  {
    n: '01',
    name: 'The Rendezvous',
    body: 'Every sprint opens with a call: what shipped last time, what matters next, and what "done" means for the next two weeks. I leave it with a written plan and the questions that are expensive to answer later.',
    image: asset('images/phases/rendezvous'),
    credit: 'Caravaggio, The Calling of Saint Matthew, 1599–1600',
    dot: '#ff6a2b',
  },
  {
    n: '02',
    name: 'The Silence',
    body: 'Heads down. API contracts, schema and code, with tests written alongside. Quiet is not the same as dark: you get a short written update twice a week, and messages get an answer the same day.',
    image: asset('images/phases/silence'),
    credit: 'Caravaggio, Saint Jerome Writing, c. 1605–06',
    dot: '#ffd60a',
  },
  {
    n: '03',
    name: 'The Exhibition',
    body: 'Every second Friday I show running software, not slides: the endpoints, the data, the failure cases and the numbers. Over a call, or across a table if you are in Bhopal.',
    image: asset('images/phases/exhibition'),
    credit: 'Jean-Léon Gérôme, Pollice Verso, 1872',
    dot: '#c6f432',
  },
  {
    n: '04',
    name: 'The Alterations',
    body: 'You send one list of changes. Small ones come back within 48 hours; bigger ones go into the plan for the next sprint. Then the next Rendezvous starts the loop again.',
    image: asset('images/phases/alterations'),
    credit: 'Caravaggio, The Cardsharps, c. 1594',
    dot: '#3cc8ff',
  },
]
