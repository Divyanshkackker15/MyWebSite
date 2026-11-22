export interface Education {
  id: string
  school: string
  place: string
  course: string
  period: string
  score: string
  primary?: boolean
}

export const education: Education[] = [
  {
    id: 'btech',
    school: 'Lakshmi Narain College of Technology',
    place: 'Bhopal',
    course: 'B.Tech, Computer Science & Engineering',
    period: '2023 – 2027',
    score: 'CGPA 7.82 / 10',
    primary: true,
  },
  {
    id: 'xii',
    school: 'Bal Bhawan School',
    place: 'Bhopal',
    course: 'Class XII · Higher Secondary',
    period: '2022 – 2023',
    score: '80.0%',
  },
  {
    id: 'x',
    school: 'Bal Bhawan School',
    place: 'Bhopal',
    course: 'Class X · Secondary',
    period: '2020 – 2021',
    score: '81.6%',
  },
]
