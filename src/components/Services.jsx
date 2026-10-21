import { useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { SERVICES } from '../data'
import { gsap, useGSAP, revealHeading, MOTION_EASE, useMediaQuery, useReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/useSmoothScroll'
import { ServiceIcon, ServicePreview } from './ServiceArt'

export default function Services() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const desktop = useMediaQuery('(min-width: 1000px)')
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const h = revealHeading('.services__title')
        gsap.from('.svc', {
          y: 50, autoAlpha: 0, stagger: 0.07, duration: 1,
          scrollTrigger: { trigger: '.services__list', start: 'top 80%', once: true },
        })
        if (root.current.querySelector('.services__preview')) gsap.from('.services__preview', {
          clipPath: 'inset(12% 12% 12% 12% round 24px)', autoAlpha: 0, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: '.services__list', start: 'top 75%', once: true },
        })
        return () => h.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const s = SERVICES[active]

  return (
    <section className="services section" id="services" ref={root} data-theme="dark" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">(Services)</p>
          <h2 className="services__title display-2" id="services-title">Six disciplines, <em className="serif">one</em> obsessive team.</h2>
        </div>

        <div className="services__layout">
          <ul className="services__list">
            {SERVICES.map((svc, i) => {
              const isActive = i === active
              return (
                <li
                  key={svc.id}
                  className={`svc ${isActive ? 'is-active' : ''}`}
                  style={{ '--tone': svc.tone }}
                  onMouseEnter={() => desktop && setActive(i)}
                >
                  <h3 className="svc__h">
                    <button
                      className="svc__btn"
                      aria-expanded={isActive}
                      aria-controls={`svc-panel-${svc.id}`}
                      onFocus={() => desktop && setActive(i)}
                      onClick={() => setActive(desktop ? i : isActive ? -1 : i)}
                    >
                      <span className="svc__no">{svc.no}</span>
                      <span className="svc__title">{svc.title}</span>
                      <span className="svc__icon"><ServiceIcon id={svc.id} /></span>
                      <span className="svc__plus" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="svc__panel" id={`svc-panel-${svc.id}`} role="region" aria-label={svc.title}>
                    <div className="svc__panel-inner">
                      <p className="svc__short">{svc.short}</p>
                      <p className="svc__body">{svc.body}</p>
                      <ul className="svc__tags">{svc.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
                      {!desktop && <div className="svc__mobile-art"><ServicePreview id={svc.id} /></div>}
                      <a href="#contact" className="svc__cta u-link" tabIndex={isActive ? 0 : -1} onClick={(e) => { e.preventDefault(); scrollToTarget('#contact') }}>
                        Discuss {svc.title.split(' ')[0].toLowerCase()} <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {desktop && s && (
            <div className="services__preview" aria-hidden="true" style={{ '--tone': s.tone }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <m.div
                  key={s.id}
                  className="services__preview-stage is-active"
                  initial={reduced ? false : { opacity: 0, y: 40, scale: 0.96, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -30, scale: 1.02, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, ease: MOTION_EASE }}
                >
                  <ServicePreview id={s.id} />
                </m.div>
              </AnimatePresence>
              <div className="services__preview-cap">
                <span>{s.no} / 06</span>
                <AnimatePresence mode="wait" initial={false}>
                  <m.b key={s.id} initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: reduced ? 0 : 0.4, ease: MOTION_EASE }}>
                    {s.title}
                  </m.b>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
