import { useEffect, useRef, useState } from 'react'
import { LiquidCanvas } from './Liquid'

/** The liquid ring, live, following the pointer; renders only while on screen. */
export default function RingCanvas({ className = '' }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !document.hidden))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={box} className={className}>
      <LiquidCanvas preset="hero" interactive frameloop={visible ? 'always' : 'never'} dpr={[1, 1.5]} detail="low" />
    </div>
  )
}
