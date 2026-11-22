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
}
