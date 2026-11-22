import type { ComponentProps } from 'react'
import { CodeBlock } from './CodeBlock'
import { Callout, Compare, Flow, Layers } from './Diagrams'

/**
 * How plain Markdown elements render inside posts, plus the custom
 * components a post can use without importing anything.
 */
export const mdxComponents = {
  pre: CodeBlock,
  table: (props: ComponentProps<'table'>) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  a: ({ href = '', ...props }: ComponentProps<'a'>) =>
    href.startsWith('http') ? <a href={href} target="_blank" rel="noopener noreferrer" {...props} /> : <a href={href} {...props} />,
  Flow,
  Layers,
  Compare,
  Callout,
}
