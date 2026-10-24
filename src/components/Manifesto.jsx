import { useRef } from 'react'
import { gsap, useGSAP, SplitText, revealHeading } from '../lib/motion'

const TEXT =
  'Most agencies sell you a template with a fresh coat of paint. We do the opposite. Every brand, site and app we make starts from your audience, is designed with intent and is engineered to stay fast. No fluff, no filler, just work that is properly nailed.'

export default function Manifesto() {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const heading = revealHeading('.manifesto__label')
        // Words brighten as you read; the paragraph stays one readable string for AT.
        const split = SplitText.create('.manifesto__text', { type: 'words', aria: 'auto' })
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: '.manifesto__text', start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
          },
        )
        gsap.from('.manifesto__stat', {
          y: 40, autoAlpha: 0, stagger: 0.12, duration: 1,
          scrollTrigger: { trigger: '.manifesto__stats', start: 'top 85%', once: true },
        })
        return () => { split.revert(); heading.revert() }
      })
      return () => mm.revert()
    },
    { scope: root },
  )
  return (
    <section className="manifesto section" id="manifesto" ref={root} data-theme="light" aria-labelledby="manifesto-label">
      <div className="container manifesto__grid">
        <h2 className="manifesto__label eyebrow" id="manifesto-label">(Our approach)</h2>
        <p className="manifesto__text">{TEXT}</p>
        <ul className="manifesto__stats" aria-label="How we work">
          <li className="manifesto__stat"><b>10</b><span>Disciplines under one roof</span></li>
          <li className="manifesto__stat"><b>1</b><span>Team from strategy to launch</span></li>
          <li className="manifesto__stat"><b>90+</b><span>Lighthouse score target on every build</span></li>
        </ul>
      </div>
    </section>
  )
}
