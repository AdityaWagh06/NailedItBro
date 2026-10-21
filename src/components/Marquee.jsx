import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/motion'
import { MARQUEE } from '../data'

// Scroll-velocity marquee: drifts slowly, speeds up and flips with scroll
// direction. Paused off-screen and static for reduced motion.
export default function Marquee() {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const loop = gsap.to('.marquee__track', { xPercent: -50, ease: 'none', duration: 40, repeat: -1 })
        let dir = 1
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (s) => (s.isActive ? loop.play() : loop.pause()),
          onUpdate: (s) => {
            const v = s.getVelocity()
            if (s.direction !== dir) dir = s.direction
            gsap.to(loop, {
              timeScale: dir * (1 + Math.min(Math.abs(v) / 400, 4)),
              duration: 0.25,
              overwrite: true,
              onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.2 }),
            })
          },
        })
        return () => st.kill()
      })
    },
    { scope: root },
  )
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marquee" ref={root} aria-label={MARQUEE.join(', ')} role="img">
      <div className="marquee__track" aria-hidden="true">
        {items.map((t, i) => (
          <span key={i} className="marquee__item">
            {i % 2 ? <em className="serif">{t}</em> : t}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
