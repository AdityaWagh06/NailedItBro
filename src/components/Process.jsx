import { useRef } from 'react'
import { PROCESS } from '../data'
import { gsap, useGSAP, revealHeading } from '../lib/motion'

export default function Process() {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const h = revealHeading('.process__title')
        // The rail fills as you read through the steps.
        gsap.fromTo('.process__rail-fill', { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: '.process__steps', start: 'top 60%', end: 'bottom 60%', scrub: true },
        })
        gsap.utils.toArray('.step').forEach((step) => {
          gsap.from(step.querySelectorAll('.step__no, .step__title, .step__body'), {
            y: 40, autoAlpha: 0, stagger: 0.08, duration: 1,
            scrollTrigger: { trigger: step, start: 'top 75%', once: true },
          })
          gsap.to(step, {
            '--dot': 1, duration: 0.4,
            scrollTrigger: { trigger: step, start: 'top 60%', toggleActions: 'play none none reverse' },
          })
        })
        gsap.to('.process__deco', {
          yPercent: -30, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        return () => h.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className="process section" id="process" ref={root} data-theme="light" aria-labelledby="process-title">
      <div className="process__deco serif" aria-hidden="true">&amp;</div>
      <div className="container process__grid">
        <div className="process__head">
          <p className="eyebrow">(Process)</p>
          <h2 className="process__title display-2" id="process-title">A clear path from <em className="serif">first call</em> to launch day.</h2>
          <p className="process__lead">One team, four phases and no hand-offs to strangers. You always know what is happening and what comes next.</p>
        </div>
        <div className="process__steps">
          <div className="process__rail" aria-hidden="true"><div className="process__rail-fill" /></div>
          <ol className="process__list">
          {PROCESS.map((p) => (
            <li className="step" key={p.no}>
              <span className="step__no">{p.no}</span>
              <h3 className="step__title">{p.title}</h3>
              <p className="step__body">{p.body}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
