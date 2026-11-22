/** Skills grouped by category, exactly as on the résumé. */
export interface SkillGroup {
  id: string
  title: string
  blurb: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  { id: 'languages', title: 'Languages', blurb: 'What I write every day', skills: ['Java', 'SQL'] },
  {
    id: 'frameworks',
    title: 'Frameworks',
    blurb: 'How I build services',
    skills: ['Spring Boot', 'Spring Security', 'Spring Data JPA', 'Microservices', 'Spring AI'],
  },
  { id: 'database', title: 'Database', blurb: 'Where the data lives', skills: ['MySQL'] },
  { id: 'devops', title: 'DevOps', blurb: 'How it ships and talks', skills: ['Docker', 'Kubernetes', 'Apache Kafka'] },
  { id: 'tools', title: 'Tools', blurb: 'My daily toolkit', skills: ['Git', 'GitHub', 'Postman', 'JUnit 5'] },
  {
    id: 'core-cs',
    title: 'Core CS',
    blurb: 'The fundamentals underneath',
    skills: ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Operating Systems', 'System Design'],
  },
]
