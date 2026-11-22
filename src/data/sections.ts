/**
 * The order of the home page. The data bus, the section labels
 * ("[ 04 / 10 ] PROJECTS") and the nav all read from this list, so
 * re-ordering sections means editing this array only.
 */
export const homeSections = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'available', label: 'Availability' },
  { id: 'process', label: 'Process' },
  { id: 'education', label: 'Education' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof homeSections)[number]['id']

export function sectionNumber(id: SectionId) {
  const i = homeSections.findIndex((s) => s.id === id)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `[ ${pad(i + 1)} / ${pad(homeSections.length)} ]`
}
