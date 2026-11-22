/** Learning journey shown as the scroll-drawn timeline. */
export interface JourneyStep {
  id: string
  title: string
  note: string
  topics: string[]
  current?: boolean
}

export const journey: JourneyStep[] = [
  {
    id: 'java',
    title: 'Java',
    note: 'The foundation: object-oriented design, collections, multithreading and daily DSA practice.',
    topics: ['OOP', 'Collections', 'Multithreading', 'DSA'],
  },
  {
    id: 'spring-boot',
    title: 'Spring Boot',
    note: 'REST APIs with Spring Security and Spring Data JPA, tested with JUnit 5. Used to build GoCruze and Votezy.',
    topics: ['REST', 'Spring Security', 'JPA', 'JUnit 5'],
  },
  {
    id: 'microservices',
    title: 'Microservices',
    note: 'Splitting a system into services that talk through APIs and Kafka events, packaged with Docker and Kubernetes.',
    topics: ['Kafka', 'Docker', 'Kubernetes'],
  },
  {
    id: 'system-design',
    title: 'System Design',
    note: 'Learning now: scalability, load balancing, caching with Redis and the trade-offs behind them.',
    topics: ['Scalability', 'Caching', 'Load balancing'],
    current: true,
  },
]
