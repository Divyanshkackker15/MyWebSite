import { createContext, useContext } from 'react'

/**
 * `booted` turns true when the preloader has finished (or was skipped).
 * The hero waits for it before playing its intro animation.
 */
export const BootContext = createContext(false)
export const useBooted = () => useContext(BootContext)
