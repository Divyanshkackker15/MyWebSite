export interface Role {
  id: string
  org: string
  role: string
  period: string
  certificate: string // TODO: certificate URL; '' hides the link
  points: string[]
  tags: string[]
}

export const experience: Role[] = [
  {
    id: 'infosys',
    org: 'Infosys Springboard',
    role: 'Software Engineering Intern',
    period: 'Sept – Nov 2025',
    certificate: '',
    points: [
      'Designed and implemented a production-ready Inventory Monitoring & Reporting System following the full SDLC within an 8-week agile sprint, engineering a concurrent multi-threaded Spring Boot backend with RESTful API endpoints to handle simultaneous stock-update requests reliably.',
      'Collaborated cross-functionally to gather stakeholder requirements, conducted code reviews, applied unit and integration testing, and enforced server-side validation, improving system availability and performance under real-world constraints.',
    ],
    tags: ['Spring Boot', 'Multithreading', 'REST', 'Agile'],
  },
  {
    id: 'aicte',
    org: 'AICTE IDEA Lab',
    role: 'Lead Technical Project Associate',
    period: 'Jan – Aug 2025',
    certificate: '',
    points: [
      'Led design and development of 2 full-stack prototypes in a 6-person cross-functional team, architecting Spring Boot backends with RESTful APIs consumed by a React frontend, and delivering working features within rapid 4-week iteration cycles.',
      'Translated user requirements into technical specifications through iterative feedback loops; applied SDLC best practices (design, development and testing) to ensure reliability, performance and observability of delivered solutions.',
    ],
    tags: ['Team lead', 'Spring Boot', 'REST', '4-week iterations'],
  },
]
