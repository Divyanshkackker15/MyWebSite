/**
 * "Available for work" section: what I offer and how a project runs.
 * DRAFT COPY — edit freely; this is a description of how I'd like to work.
 */
export const services: string[] = [
  'REST API development',
  'Spring Boot backends',
  'Auth & security (JWT, OAuth 2.0, RBAC)',
  'Database design & query tuning',
  'Dockerising Java apps',
  'API testing (JUnit 5, Postman)',
]

export interface Phase {
  id: string
  title: string
  promise: string
  body: string
}

export const phases: Phase[] = [
  {
    id: 'discover',
    title: 'Discover',
    promise: 'One problem, clearly defined.',
    body: 'We talk through your users, your data and the problem that matters most. I write it down as user stories and API requirements, so we agree on what "done" means before any code.',
  },
  {
    id: 'design',
    title: 'Design',
    promise: 'Contract first.',
    body: 'I design the API contract, the database schema and the security model up front. You review endpoints and data flows while changes are still cheap.',
  },
  {
    id: 'build',
    title: 'Build',
    promise: 'Short iterations, tested code.',
    body: 'I build in short agile iterations with a layered Spring Boot codebase, JUnit 5 unit and integration tests, and a working demo at the end of each one.',
  },
  {
    id: 'launch',
    title: 'Launch',
    promise: 'Shipped and documented.',
    body: 'The service is containerised with Docker, deployed, and handed over with API docs and a Postman collection, so your team can run it on day one.',
  },
]
