/**
 * URL for a file in public/, e.g. asset("images/x.webp") → "/images/x.webp".
 */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
