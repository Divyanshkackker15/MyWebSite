import type { ComponentType } from 'react'

/**
 * Code-splitting helper that can be "warmed up" before React renders.
 *
 * React.lazy() always suspends on first render, which would flash a
 * fallback while hydrating our pre-rendered HTML. Instead, entry-client
 * awaits `preload()` for the current URL *before* hydrating, so the
 * component is already in memory and renders synchronously.
 *
 * If something isn't preloaded yet (e.g. clicking to a new page), the
 * wrapper throws the promise, which React's <Suspense> understands.
 */
export function lazyPage<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  let Loaded: ComponentType<P> | null = null
  let promise: Promise<unknown> | null = null

  const preload = () =>
    (promise ??= load().then((m) => {
      Loaded = m.default
    }))

  function LazyPage(props: P) {
    if (!Loaded) throw preload()
    return <Loaded {...props} />
  }

  return { Component: LazyPage, preload }
}
