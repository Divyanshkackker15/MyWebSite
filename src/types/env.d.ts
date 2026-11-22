/// <reference types="vite/client" />

declare module 'virtual:posts' {
  // typed as PostMeta[] in src/lib/posts.ts
  const posts: unknown[]
  export default posts
}

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const frontmatter: Record<string, unknown>
  const MDXComponent: ComponentType<{ components?: Record<string, unknown> }>
  export default MDXComponent
}

interface ImportMetaEnv {
  /** Formspree form id, e.g. "xyzzabcd" (from https://formspree.io/forms). Leave empty to disable the form. */
  readonly VITE_FORMSPREE_ID?: string
  /** set only for the shareable preview build: relative paths + in-memory routing */
  readonly VITE_PREVIEW_EMBED?: string
}
