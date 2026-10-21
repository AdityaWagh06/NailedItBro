import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../lib/motion'

// A sub-1.5s brand reveal. It never captures pointer events, and the hero
// starts animating underneath before the curtain has finished lifting.
export default function Loader({ onReveal }) {
  const root = useRef(null)
  useGSAP(
    () => {
      const tl = gsap.timeline()
      tl.from('.loader__char', { yPercent: 120, duration: 0.7, ease: EASE.out, stagger: 0.035 })
        .from('.loader__rule', { scaleX: 0, duration: 0.6, ease: EASE.inOut }, 0.15)
        .to('.loader__word', { yPercent: -120, duration: 0.5, ease: 'power3.in', stagger: 0.04 }, 0.85)
        .add(() => onReveal?.(), 1.05)
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: EASE.inOut }, 0.95)
        .set(root.current, { display: 'none' })
    },
    { scope: root },
  )
  const words = ['Nailed', 'It', 'Bro']
  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__mark">
        {words.map((w, wi) => (
          <span className="loader__word" key={w}>
            {[...w].map((c, i) => <span className={`loader__char ${wi === 2 ? 'serif' : ''}`} key={i}>{c}</span>)}
          </span>
        ))}
      </div>
      <div className="loader__rule" />
      <p className="loader__tag">Digital studio</p>
    </div>
  )
}
