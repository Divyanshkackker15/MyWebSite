import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeShiki from '@shikijs/rehype'
import { postsIndex } from './plugins/posts-index'

/**
 * Build pipeline in one picture:
 *
 *   .mdx post ──► MDX compiler ──► React component (code highlighted at build time by Shiki)
 *   .tsx       ──► React + Tailwind
 *   content/blog/*.mdx front-matter ──► posts-index plugin ──► `virtual:posts` (list used by /blog)
 *
 * `npm run build` then runs this config twice (browser bundle + SSR bundle)
 * and scripts/prerender.mjs turns every route into a static HTML file.
 */
export default defineConfig({
  // relative asset URLs for the embeddable preview build
  base: process.env.VITE_PREVIEW_EMBED ? './' : '/',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm, remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
        rehypePlugins: [
          rehypeSlug, // adds id="..." to headings so the table of contents can link to them
          [
            rehypeShiki,
            {
              theme: 'github-dark-default',
              // put the language on <pre> so the code block can show a label
              transformers: [
                {
                  pre(node: { properties: Record<string, unknown> }) {
                    // `this.options.lang` is the language written after the ``` fence
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    node.properties['data-language'] = (this as any).options.lang
                  },
                },
              ],
            },
          ],
        ],
      }),
    },
    react({ include: /\.(mdx|tsx|ts|jsx|js)$/ }),
    tailwindcss(),
    postsIndex(),
  ],
  build: {
    // three.js is big but only ever loaded lazily on desktop
    chunkSizeWarningLimit: 800,
    // preview build only: embed the Latin font files in the CSS, because the
    // sandboxed preview page can't load font files from its own folder
    ...(process.env.VITE_PREVIEW_EMBED
      ? { assetsInlineLimit: (file: string) => /-latin-(wght|400)-.*\.woff2$/.test(file) || undefined }
      : {}),
  },
})
