/**
 * Framer Motion's animation engine, loaded in its own chunk after first
 * paint (see <LazyMotion> in App.tsx). Components use the light `m.*`
 * elements, which render instantly and start animating once this arrives.
 */
import { domAnimation } from 'framer-motion'
export default domAnimation
