/**
 * Writing categories. Add, rename or reorder freely; a post picks one with
 * `category:` in its front-matter. `light` is the colour of the studio light
 * in the post's cover render: volt (blue), violet, magenta or emerald.
 */
export type Light = 'volt' | 'violet' | 'magenta' | 'emerald'

export interface Category {
  name: string
  light: Light
}

export const categories: Category[] = [
  { name: 'Java', light: 'volt' },
  { name: 'Spring Boot', light: 'emerald' },
  { name: 'Backend Engineering', light: 'volt' },
  { name: 'System Design', light: 'violet' },
  { name: 'Databases', light: 'emerald' },
  { name: 'Development', light: 'violet' },
  { name: 'Personal Learnings', light: 'magenta' },
  { name: 'Experiments', light: 'magenta' },
]

export const LIGHT_HEX: Record<Light, string> = {
  volt: '#3d7bff',
  violet: '#8b5cf6',
  magenta: '#e0409a',
  emerald: '#1fbf8a',
}

export function lightFor(category: string): Light {
  return categories.find((c) => c.name === category)?.light ?? 'volt'
}
