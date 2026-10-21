import { useRef } from 'react'
import { gsap, useGSAP, splitLines, EASE, DUR, STAGGER } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import { Browser, Phone, HeroSite, HeroApp, StatCard, SwatchCard } from './Mockups'
import Magnetic from './Magnetic'

export default function Hero({ ready }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 900px) and (pointer: fine)',
        },
        (ctx) => {
          const { motion, desktop } = ctx.conditions
          if (!motion) {
            gsap.set('.hero [data-intro]', { autoAlpha: 1 })
            return
          }

          // Hide intro elements until the loader hands over.
          gsap.set('[data-intro]', { autoAlpha: 0 })
          const split = splitLines('.hero__title')
          gsap.set(split.lines, { yPercent: 110 })
          gsap.set('.hero__title', { autoAlpha: 1 })

          const intro = gsap.timeline({ paused: true, defaults: { ease: EASE.out } })
          intro
            .fromTo('.hero__eyebrow', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: DUR.base }, 0)
            .to(split.lines, { yPercent: 0, duration: DUR.slow, stagger: STAGGER.lines }, 0.05)
            .fromTo('.hero__sub', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: DUR.base }, 0.45)
            .fromTo('.hero__ctas [data-intro]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: DUR.base, stagger: STAGGER.items }, 0.55)
            .fromTo('.hero__visual', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.2)
            .from('.hv-browser', { yPercent: 18, rotateX: 18, scale: 0.92, autoAlpha: 0, duration: 1.4 }, 0.2)
            .from('.hv-browser .mk-browser__screen > *', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: EASE.inOut }, 0.45)
            .from('.hv-phone', { y: 120, rotate: 8, autoAlpha: 0, duration: 1.3 }, 0.5)
            .from('.hv-stat', { x: -60, y: 40, autoAlpha: 0, duration: 1.2 }, 0.7)
            .from('.hv-swatch', { x: 60, y: -30, autoAlpha: 0, duration: 1.2 }, 0.8)
            .fromTo('.hero__meta > *', { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR.base, stagger: 0.1 }, 0.9)
            .from('.hero__bg-n', { autoAlpha: 0, scale: 0.9, duration: 2 }, 0)

          root.current._intro = intro

          // Scroll out: the composition sinks back while the title drifts up.
          gsap.timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          })
            .to('.hero__visual-inner', { yPercent: 12, scale: 0.94, ease: 'none' }, 0)
            .to('.hero__copy', { yPercent: -10, ease: 'none' }, 0)
            .to('.hero__bg-n', { rotate: 18, yPercent: 20, ease: 'none' }, 0)
            .to('.hero__grid', { yPercent: 15, ease: 'none' }, 0)

          // Pointer parallax by depth, desktop only.
          if (desktop) {
            const layers = gsap.utils.toArray('[data-depth]').map((el) => ({
              x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
              y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
              d: parseFloat(el.dataset.depth),
            }))
            const onMove = (e) => {
              const nx = e.clientX / window.innerWidth - 0.5
              const ny = e.clientY / window.innerHeight - 0.5
              layers.forEach((l) => { l.x(nx * l.d * 40); l.y(ny * l.d * 30) })
            }
            window.addEventListener('pointermove', onMove)
            return () => {
              window.removeEventListener('pointermove', onMove)
              split.revert()
            }
          }
          return () => split.revert()
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  // Play the intro once the loader hands over (or straight away if skipped).
  useGSAP(
    () => {
      if (ready) root.current?._intro?.play()
    },
    { dependencies: [ready], scope: root },
  )

  return (
    <section className="hero" id="top" ref={root} data-theme="light" aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__bg-n serif" aria-hidden="true">n</div>

      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="hero__eyebrow eyebrow" data-intro><span className="dot" /> Digital studio · Brands, websites & apps</p>
          <h1 className="hero__title display" id="hero-title" data-intro>
            We craft digital products that feel <em className="serif">nailed.</em>
          </h1>
          <p className="hero__sub" data-intro>
            Nailed It Bro is a design and engineering studio for ambitious businesses. We shape brands, build fast websites and launch apps people love to use.
          </p>
          <div className="hero__ctas">
            <Magnetic>
              <a href="#contact" className="btn btn--dark" data-intro onClick={(e) => { e.preventDefault(); scrollToTarget('#contact') }}>
                <span className="btn__label" data-text="Start a project">Start a project</span>
                <span className="btn__icon" aria-hidden="true">→</span>
              </a>
            </Magnetic>
            <a href="#work" className="btn btn--ghost" data-intro onClick={(e) => { e.preventDefault(); scrollToTarget('#work') }}>
              <span className="btn__label" data-text="See our work">See our work</span>
            </a>
          </div>
        </div>

        <div className="hero__visual" data-intro>
          <div className="hero__visual-inner">
            <div className="hv-layer hv-browser" data-depth="0.4">
              <Browser url="atelier.studio"><HeroSite /></Browser>
            </div>
            <div className="hv-layer hv-phone" data-depth="1">
              <Phone><HeroApp /></Phone>
            </div>
            <div className="hv-layer hv-stat" data-depth="1.4"><StatCard /></div>
            <div className="hv-layer hv-swatch" data-depth="0.8"><SwatchCard /></div>
          </div>
        </div>
      </div>

      <div className="hero__meta container">
        <span>Independent studio — working worldwide</span>
        <button className="hero__scroll" onClick={() => scrollToTarget('#manifesto')}>
          <span className="hero__scroll-line" aria-hidden="true" /> Scroll to explore
        </button>
        <span className="hide-sm">Strategy · Design · Engineering</span>
      </div>
    </section>
  )
}
