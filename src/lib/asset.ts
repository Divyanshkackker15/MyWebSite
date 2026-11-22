/**
 * URL for a file in public/. Normally "/images/x.png"; in the preview build
 * (base "./") it becomes "./images/x.png" so the site also works from a sub-folder.
 */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
